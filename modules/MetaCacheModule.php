<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\Value;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Cache\MetaDataCache;
use RebelCode\Spotlight\Nft\Database\Column;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\MetaCacheTable;
use RebelCode\Spotlight\Nft\Module;

class MetaCacheModule extends Module
{
    public function run(ContainerInterface $c): void
    {
    }

    public function getFactories(): array
    {
        return [
            'instance' => new Constructor(MetaDataCache::class, ['table', 'ttl']),
            'ttl' => new Value(60 * 60 * 24),

            //==========================================================================
            // DB TABLE
            //==========================================================================

            'table' => new Constructor(Table::class, [
                'table/name',
                'table/columns',
                'table/primary_key',
            ]),

            'table/name' => new Value('snft_meta_cache'),
            'table/primary_key' => new Value(MetaCacheTable::COL_TOKEN),
            'table/columns' => new Value([
                MetaCacheTable::COL_TOKEN => Column::ofType('VARCHAR(100)')->notNull(),
                MetaCacheTable::COL_TTL => Column::ofType('INT')->notNull(),
                MetaCacheTable::COL_TIMESTAMP => Column::ofType('INT')->notNull(),
                MetaCacheTable::COL_METADATA => Column::ofType('TEXT')->notNull(),
            ]),
        ];
    }
}
