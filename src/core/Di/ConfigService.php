<?php

namespace RebelCode\Spotlight\Nft\Di;

use Dhii\Services\Factory;
use RebelCode\Spotlight\Nft\Config\ConfigEntry;
use RebelCode\Spotlight\Nft\Config\ConfigSet;

/**
 * A service factory helper that automatically resolves to the value of a config entry.
 *
 * @see   ConfigSet
 * @see   ConfigEntry
 */
class ConfigService extends Factory
{
    /**
     * Constructor.
     *
     * @param string $configSet The config set from which to read the entry.
     * @param string $key       The key of the entry whose value to resolve to.
     */
    public function __construct(string $configSet, string $key)
    {
        parent::__construct([$configSet], function (ConfigSet $configSet) use ($key) {
            return $configSet->get($key)->getValue();
        });
    }
}
