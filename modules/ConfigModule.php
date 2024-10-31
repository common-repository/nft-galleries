<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\FuncService;
use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use RebelCode\Spotlight\Nft\Config\ConfigSet;
use RebelCode\Spotlight\Nft\Config\WpOption;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Di\EndPointService;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\RestApi\EndPoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Settings\GetSettingsEndpoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Settings\SaveSettingsEndpoint;

class ConfigModule extends Module
{
    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            // The config set
            'set' => new Factory(['entries', 'default'], function ($entries, $default) {
                return new ConfigSet($entries, $default);
            }),

            // Entries for the config
            'entries' => new Value([]),

            // The callback used by the config set to create options that do not exist
            'default' => new FuncService([], function ($key) {
                return new WpOption($key);
            }),

            //==========================================================================
            // REST API ENDPOINTS
            //==========================================================================

            'endpoints/get' => new EndPointService(
                '/settings',
                ['GET'],
                GetSettingsEndpoint::class,
                ['@config/set'],
                '@rest_api/auth/user'
            ),

            'endpoints/update' => new EndPointService(
                '/settings',
                ['POST', 'PUT', 'PATCH'],
                SaveSettingsEndpoint::class,
                ['@config/set'],
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
                'endpoints/update',
            ])
        ];
    }
}
