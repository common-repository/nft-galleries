<?php

namespace RebelCode\Spotlight\Nft\Feeds;

use RebelCode\Iris\Data\Feed;
use RebelCode\Iris\Data\Source;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\Engine\Data\WalletSource;
use RebelCode\Spotlight\Nft\Utils\Arrays;

class FeedManager
{
    /** @var Table */
    public $feeds;

    /** @var Table */
    public $wallets;

    /** Constructor */
    public function __construct(Table $feeds, Table $accounts)
    {
        $this->feeds = $feeds;
        $this->wallets = $accounts;
    }

    public function get(int $id): ?Feed
    {
        return $this->recordToFeed($this->feeds->get($id));
    }

    /**
     * @return Feed[] A list of feeds.
     */
    public function getAll(): array
    {
        return Arrays::map($this->feeds->query(), [$this, 'recordToFeed']);
    }

    /**
     * @return Source[] A list of item sources.
     */
    public function getSources(array $options): array
    {
        $sources = [];

        foreach ($options['wallets'] ?? [] as $address) {
            $record = $this->wallets->get($address);

            if ($record !== null) {
                $sources[] = WalletSource::create($address);
            }
        }

        return $sources;
    }

    public function createFeed(?int $id, array $options): Feed
    {
        return new Feed($id ?? 0, $this->getSources($options), $options);
    }

    public function recordToFeed(array $record): ?Feed
    {
        $optionsJson = $record[FeedsTable::COL_OPTIONS] ?? '{}';
        $options = json_decode($optionsJson);

        return $this->createFeed($record[FeedsTable::COL_ID] ?? 0, $options);
    }
}
