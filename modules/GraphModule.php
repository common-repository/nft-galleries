<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\WordPress\Http\WpClient;

class GraphModule extends Module
{
    public function getFactories(): array
    {
        return [
            'subgraph' => new Value('0x7859821024e633c5dc8a4fcf86fc52e7720ce525-0'),
            'api_key' => new Value('6039d6319d3d6e995a8b0bd1456c4f17'),

            'client' => new Factory([], function () {
                return WpClient::createDefault(null, ['timeout' => 5,]);
            }),
        ];
    }
}
