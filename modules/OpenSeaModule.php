<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factory;
use RebelCode\Spotlight\Nft\Engine\Fetcher\OpenSeaCatalog;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\WordPress\Http\WpClient;

class OpenSeaModule extends Module
{
    /** @inerhitDoc */
    public function getFactories(): array
    {
        return [
            'catalog' => new Constructor(OpenSeaCatalog::class, ['client',]),
            'client' => new Factory([], function () {
                return WpClient::createDefault(null, ['timeout' => 5]);
            }),
        ];
    }
}
