<?php

namespace RebelCode\Spotlight\Nft\Engine\Data;

use RebelCode\Iris\Data\Source;

class WalletSource
{
    const TYPE = 'WALLET';

    public static function create(string $address): Source
    {
        return new Source($address, static::TYPE);
    }

    public static function validateAddress(string $address): bool
    {
        return preg_match('/0x[0-9a-fA-F]{40}/', $address) === 1;
    }

    public static function sanitizeAddress(string $address): string
    {
        return strtolower($address);
    }
}
