<?php

namespace RebelCode\Spotlight\Nft\Engine;

use RebelCode\Iris\Data\Item;
use RebelCode\Iris\Data\Source;
use RebelCode\Iris\Exception\StoreException;
use RebelCode\Iris\Store;
use RebelCode\Psr7\Utils;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\MetaCacheTable;
use RebelCode\Spotlight\Nft\Database\Tables\TokensTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\Engine\Data\TokenItem;
use RebelCode\Spotlight\Nft\Engine\Data\WalletSource;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use RebelCode\Spotlight\Nft\Utils\Files;

class TokenStore implements Store
{
    /** @var Table */
    protected $table;

    /** @var ImageStore */
    protected $imgStore;

    /** @var bool */
    protected $cacheImages = false;

    /** Constructor */
    public function __construct(Table $table, ImageStore $imgStore)
    {
        $this->table = $table;
        $this->imgStore = $imgStore;
    }

    public function insert(Item $item): Item
    {
        if ($this->cacheImages) {
            $itemCachedImg = $this->imgStore->cacheItemImage($item);

            if ($itemCachedImg === null) {
                return $item;
            } else {
                $item = $itemCachedImg;
            }
        }

        $fields = [
            TokensTable::COL_ID => $item->id,
            TokensTable::COL_COLLECTION => $item->data[TokenItem::COLLECTION],
            TokensTable::COL_COLLECTION_NAME => $item->data[TokenItem::COLLECTION_NAME],
            TokensTable::COL_NUMBER => $item->data[TokenItem::NUMBER],
            TokensTable::COL_NAME => $item->data[TokenItem::NAME],
            TokensTable::COL_DESC => $item->data[TokenItem::DESC],
            TokensTable::COL_META_URL => $item->data[TokenItem::META_URL],
            TokensTable::COL_TRAITS => json_encode($item->data[TokenItem::TRAITS]),
            TokensTable::COL_TYPE => $item->data[TokenItem::TYPE],
            TokensTable::COL_IMG_URL => $item->data[TokenItem::IMG_URL],
            TokensTable::COL_OG_IMG_URL => $item->data[TokenItem::OG_IMG_URL],
            TokensTable::COL_WALLET => strtolower($item->sources[0]->id),
            TokensTable::COL_PERMALINK => $item->data[TokenItem::PERMALINK],
        ];

        if ($item->localId === null) {
            $this->table->insert($fields);
            $item = $item->withLocalId($item->id);
        } else {
            $this->table->update(
                Where::equals(TokensTable::COL_ID, $item->localId),
                $fields
            );
        }

        return $item;
    }

    public function insertMultiple(array $items, int $mode = self::THROW_ON_FAIL): array
    {
        $result = [];
        foreach ($items as $item) {
            set_time_limit(30);
            try {
                $result[] = $this->insert($item);
            } catch (StoreException $ex) {
                if ($mode === Store::THROW_ON_FAIL) {
                    throw $ex;
                } else {
                    error_log("Ignored IgPostStore exception: {$ex->getMessage()}");
                }
            }
        }

        return $result;
    }

    public function get(string $id): ?Item
    {
        $results = $this->table->query(Where::col(TokensTable::COL_ID)->isEqualTo($id));

        return (count($results) > 0)
            ? $this->recordToItem($results[0])
            : null;
    }

    public function getMultiple(array $ids): array
    {
        if (empty($ids)) {
            return [];
        }

        $results = $this->table->query(Where::col(TokensTable::COL_ID)->isIn($ids));

        return Arrays::createMap($results, function ($record) {
            $item = $this->recordToItem($record);
            return [$item->id, $item];
        });
    }

    public function getForSources(array $sources, ?int $count = null, int $offset = 0): array
    {
        return $this->query(new Store\Query($sources, null, null, $count, $offset));
    }

    public function query(Store\Query $query): array
    {
        $wallets = Arrays::map($query->sources, function (Source $source) {
            return $source->id;
        });

        if (empty($wallets)) {
            return [];
        } else {
            $where = Where::col(TokensTable::COL_WALLET)->isIn($wallets);
            if ($query->condition !== null) {
                $where .= ' AND ' . $this->conditionToSql($query->condition);
            }

            $results = $this->table->query($where, $query->count, $query->offset);

            return Arrays::map($results, function (array $record) {
                return $this->recordToItem($record);
            });
        }
    }

    public function delete(string $id): bool
    {
        $item = $this->get($id);

        $numAffected = $this->table->delete(Where::col(TokensTable::COL_ID)->isEqualTo($id), 1);
        $this->imgStore->deleteCachedImage($item);

        return $numAffected > 0;
    }

    public function deleteMultiple(array $ids): int
    {
        if (empty($ids)) {
            return 0;
        } else {
            return $this->table->delete(Where::col(TokensTable::COL_ID)->isIn($ids));
        }
    }

    public function deleteForSources(array $sources): int
    {
        $addresses = Arrays::map($sources, function (Source $source) {
            return $source->id;
        });

        if (empty($addresses)) {
            return 0;
        } else {
            return $this->table->delete(Where::col(TokensTable::COL_WALLET)->isIn($addresses));
        }
    }

    protected function recordToItem(array $record): Item
    {
        return new Item(
            $record[TokensTable::COL_ID],
            $record[TokensTable::COL_ID],
            [WalletSource::create($record[TokensTable::COL_WALLET])],
            [
                TokenItem::COLLECTION => $record[TokensTable::COL_COLLECTION],
                TokenItem::COLLECTION_NAME => $record[TokensTable::COL_COLLECTION_NAME],
                TokenItem::NUMBER => $record[TokensTable::COL_NUMBER],
                TokenItem::NAME => $record[TokensTable::COL_NAME],
                TokenItem::DESC => $record[TokensTable::COL_DESC],
                TokenItem::META_URL => $record[TokensTable::COL_META_URL],
                TokenItem::TRAITS => json_decode($record[TokensTable::COL_TRAITS]),
                TokenItem::TYPE => $record[TokensTable::COL_TYPE],
                TokenItem::IMG_URL => $record[TokensTable::COL_IMG_URL],
                TokenItem::OG_IMG_URL => $record[TokensTable::COL_OG_IMG_URL],
                TokenItem::PERMALINK => $record[TokensTable::COL_PERMALINK],
            ]
        );
    }

    protected function conditionToSql(Store\Query\Condition $condition): string
    {
        $terms = [];
        foreach ($condition->criteria as $criterion) {
            if ($criterion instanceof Store\Query\Expression) {
                $terms[] = Where::col($criterion->field)->compare($criterion->operator, $criterion->value);
            } elseif ($criterion instanceof Store\Query\Condition) {
                $terms[] = '(' . $this->conditionToSql($criterion) . ')';
            }
        }

        return implode(" $condition->relation ", $terms);
    }
}
