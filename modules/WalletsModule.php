<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\Value;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Database\Column;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\WalletsTable;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Di\EndPointService;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Wallets\DeleteWalletEndPoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Wallets\GetWalletsEndPoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Wallets\PostWalletEndPoint;

class WalletsModule extends Module
{
    public function run(ContainerInterface $c)
    {
        $c->get('table')->create();
    }

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

            'table/name' => new Value('snft_wallets'),
            'table/primary_key' => new Value(WalletsTable::COL_ADDRESS),
            'table/columns' => new Value([
                WalletsTable::COL_NAME => Column::ofType('VARCHAR(100)')->notNull(),
                WalletsTable::COL_ADDRESS => Column::ofType('VARCHAR(100)')->notNull(),
            ]),

            //==========================================================================
            // REST API ENDPOINTS
            //==========================================================================

            'endpoints/get' => new EndPointService(
                'wallets',
                ['GET'],
                GetWalletsEndPoint::class,
                ['table'],
                '@rest_api/auth/user'
            ),

            'endpoints/post' => new EndPointService(
                'wallets',
                ['POST'],
                PostWalletEndPoint::class,
                ['table'],
                '@rest_api/auth/user'
            ),

            'endpoints/delete' => new EndPointService(
                'wallets/delete/(?P<address>.+)',
                ['POST'],
                DeleteWalletEndPoint::class,
                ['table', '@tokens/table'],
                '@rest_api/auth/user'
            ),
        ];
    }

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
