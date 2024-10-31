<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Server;

class ServerModule extends Module
{
    public function getFactories(): array
    {
        return [
            'instance' => new Constructor(Server::class, [
                '@engine/instance',
                '@updater/importer',
                '@feeds/manager'
            ]),
        ];
    }
}
