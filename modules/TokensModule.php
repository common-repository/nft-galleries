<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\FuncService;
use Dhii\Services\Factories\Value;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Database\Column;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\TokensTable;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Di\EndPointService;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Tokens\ImportTokenEndPoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Tokens\GetTokensEndPoint;

class TokensModule extends Module
{
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

            'table/name' => new Value('snft_tokens'),
            'table/primary_key' => new Value(TokensTable::COL_ID),
            'table/columns' => new Value([
                TokensTable::COL_ID => Column::ofType('VARCHAR(100)')->notNull(),
                TokensTable::COL_COLLECTION => Column::ofType('VARCHAR(100)')->notNull(),
                TokensTable::COL_COLLECTION_NAME => Column::ofType('VARCHAR(300)')->notNull(),
                TokensTable::COL_NUMBER => Column::ofType('INT')->notNull(),
                TokensTable::COL_NAME => Column::ofType('TEXT'),
                TokensTable::COL_DESC => Column::ofType('TEXT'),
                TokensTable::COL_META_URL => Column::ofType('TEXT')->notNull(),
                TokensTable::COL_TRAITS => Column::ofType('TEXT'),
                TokensTable::COL_IMG_URL => Column::ofType('TEXT')->notNull(),
                TokensTable::COL_OG_IMG_URL => Column::ofType('TEXT')->notNull(),
                TokensTable::COL_TYPE => Column::ofType('VARCHAR(20)')->notNull(),
                TokensTable::COL_WALLET => Column::ofType('TEXT')->notNull(),
                TokensTable::COL_PERMALINK => Column::ofType('TEXT')->notNull(),
            ]),

            //==========================================================================
            // REST API ENDPOINTS
            //==========================================================================

            'endpoints/get' => new EndPointService(
                '/tokens/feed',
                ['POST'],
                GetTokensEndPoint::class,
                ['@server/instance'],
                '@rest_api/auth/user'
            ),

            'endpoints/import' => new EndPointService(
                '/tokens/import',
                ['POST'],
                ImportTokenEndPoint::class,
                ['@server/instance'],
                '@rest_api/auth/public'
            ),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            'rest_api/endpoints' => new ArrayExtension([
                'endpoints/get',
                'endpoints/import',
            ]),
        ];
    }
}
