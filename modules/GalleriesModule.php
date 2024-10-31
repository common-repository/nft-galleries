<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\Value;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Database\Column;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Di\EndPointService;
use RebelCode\Spotlight\Nft\Feeds\FeedManager;
use RebelCode\Spotlight\Nft\Feeds\FeedTemplate;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Feeds\DeleteFeedsEndpoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Feeds\GetFeedsEndPoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Feeds\SaveFeedsEndpoint;
use RebelCode\Spotlight\Nft\RestApi\Transformers\FeedTransformer;

/**
 * The module that adds the galleries and related functionality to the plugin.
 */
class GalleriesModule extends Module
{
    /** @inheritDoc */
    public function run(ContainerInterface $c)
    {
        $c->get('table')->create();
    }

    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            //==========================================================================
            // DB TABLE
            //==========================================================================

            'table' => new Constructor(Table::class, [
                'table/name',
                'table/columns',
                'table/primary_key',
            ]),

            'table/name' => new Value('snft_galleries'),
            'table/primary_key' => new Value(FeedsTable::COL_ID),
            'table/columns' => new Value([
                FeedsTable::COL_ID => Column::ofType('BIGINT(20)')->notNull()->autoInc(),
                FeedsTable::COL_NAME => Column::ofType('VARCHAR(100)')->notNull(),
                FeedsTable::COL_OPTIONS => Column::ofType('LONGTEXT')->notNull(),
            ]),

            //==========================================================================
            // RENDERING
            //==========================================================================

            // The template that renders feeds
            'template' => new Constructor(FeedTemplate::class, []),

            //==========================================================================
            // MANAGER TABLE
            //==========================================================================

            // The item feed manager
            'manager' => new Constructor(FeedManager::class, ['table', '@wallets/table']),

            //==========================================================================
            // REST API
            //==========================================================================

            'transformer' => new Constructor(FeedTransformer::class, ['@wp/db']),

            'endpoints/get' => new EndPointService(
                'feeds',
                ['GET'],
                GetFeedsEndPoint::class,
                ['table', 'transformer'],
                '@rest_api/auth/user'
            ),

            'endpoints/post' => new EndPointService(
                'feeds(?:/(?P<id>\d+))?',
                ['POST'],
                SaveFeedsEndpoint::class,
                ['table', 'transformer'],
                '@rest_api/auth/user'
            ),

            'endpoints/delete' => new EndPointService(
                'feeds/delete/(?P<id>\d+)',
                ['POST'],
                DeleteFeedsEndpoint::class,
                ['table', 'transformer'],
                '@rest_api/auth/user'
            ),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            'rest_api/endpoints' => new ArrayExtension([
                'endpoints/get',
                'endpoints/post',
                'endpoints/delete',
            ]),
        ];
    }
}
