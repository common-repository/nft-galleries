<?php

namespace RebelCode\Spotlight\Nft\Cache;

use InvalidArgumentException;
use Psr\SimpleCache\CacheInterface;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\MetaCacheTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use Throwable;
use Traversable;

class MetaDataCache implements CacheInterface
{
    /** @var Table */
    protected $table;

    /** @var int */
    protected $ttl;

    /** Constructor */
    public function __construct(Table $table, int $ttl)
    {
        $this->table = $table;
        $this->ttl = $ttl;
    }

    /** @inheritDoc */
    public function get($key, $default = null)
    {
        $results = $this->table->query($this->whereKeyIs($key), 1);
        $results = $this->filterExpiredRecords($results);

        if (empty($results)) {
            return $default;
        }

        return $results[0][MetaCacheTable::COL_METADATA];
    }

    /** @inheritDoc */
    public function has($key)
    {
        $results = $this->table->query($this->whereKeyIs($key), 1);
        $results = $this->filterExpiredRecords($results);

        return count($results) > 0;
    }

    /** @inheritDoc */
    public function set($key, $value, $ttl = null)
    {
        try {
            $id = $this->table->insert($this->createRecord($key, $value, $ttl));

            return $id !== 0;
        } catch (Throwable $ex) {
            return false;
        }
    }

    /** @inheritDoc */
    public function delete($key)
    {
        $numRows = $this->table->delete($this->whereKeyIs($key), 1);

        return $numRows > 0;
    }

    /** @inheritDoc */
    public function clear()
    {
        $numRows = $this->table->delete(null);

        return $numRows > 0;
    }

    /** @inheritDoc */
    public function getMultiple($keys, $default = null)
    {
        $keys = $this->iterableToArray($keys);
        $results = $this->table->query($this->whereKeyIn($keys), 1);
        $results = $this->filterExpiredRecords($results);

        if (empty($results)) {
            return $default;
        }

        return array_column($results, MetaCacheTable::COL_METADATA);
    }

    /** @inheritDoc */
    public function setMultiple($values, $ttl = null)
    {
        $values = $this->iterableToArray($values);
        $records = Arrays::map($values, function ($metadata, $token) use ($ttl) {
            return $this->createRecord($token, $metadata, $ttl);
        });

        $numRows = $this->table->insertMany($records);

        return $numRows === count($values);
    }

    /** @inheritDoc */
    public function deleteMultiple($keys)
    {
        $keys = $this->iterableToArray($keys);
        $numRows = $this->table->delete($this->whereKeyIn($keys), 1);

        return $numRows === count($keys);
    }

    protected function whereKeyIs(string $key): string
    {
        return Where::col(MetaCacheTable::COL_TOKEN)->isEqualTo($key);
    }

    /** @param iterable $keys */
    protected function whereKeyIn(array $keys): string
    {
        return empty($keys) ? '' : Where::col(MetaCacheTable::COL_TOKEN)->isIn($keys);
    }

    /** @param iterable $list */
    protected function iterableToArray($list): array
    {
        if (is_array($list)) {
            return $list;
        }
        if ($list instanceof Traversable) {
            return iterator_to_array($list);
        }

        throw new InvalidArgumentException('Argument is not an iterable value');
    }

    protected function createRecord(string $token, string $metadata, ?int $ttl = null): array
    {
        return [
            MetaCacheTable::COL_TOKEN => $token,
            MetaCacheTable::COL_METADATA => $metadata,
            MetaCacheTable::COL_TTL => $ttl ?? $this->ttl,
            MetaCacheTable::COL_TIMESTAMP => time(),
        ];
    }

    protected function filterExpiredRecords(array $records): array
    {
        $results = [];
        $expiredKeys = [];

        foreach ($records as $record) {
            $ts = $record[MetaCacheTable::COL_TIMESTAMP];
            $ttl = $record[MetaCacheTable::COL_TTL];
            $hasExpired = (time() - $ts) < $ttl;

            if ($hasExpired) {
                $expiredKeys[] = $record[MetaCacheTable::COL_TOKEN];
            } else {
                $results[] = $record;
            }
        }

        if (!empty($expiredKeys)) {
            $this->deleteMultiple($expiredKeys);
        }

        return $results;
    }
}
