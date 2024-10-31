<?php

namespace RebelCode\Spotlight\Nft\Config;

use OutOfBoundsException;
use RebelCode\Spotlight\Nft\Utils\Arrays;

/**
 * A set of configuration entries.
 *
 * This container-like implementation allows consumers to retrieve {@link ConfigService} instances, which in turn allow
 * for the reading and writing of config entries. The config set does not dictate where and how each config entry
 * stores or reads its values to/from; that is left up to each entry in order to allow the config to be customizable on
 * a per-entry level.
 *
 * The set may optionally be configured with a "default" callback. This callback will be invoked with a requested entry
 * key in the event that the set does not contain an entry for that key. The callback, if given, can create a new
 * {@link ConfigService} instance. This can be useful for non-strict storage systems that allow for entries to be
 * dynamically declared (such as WP Options).
 *
 * @see   ConfigService
 */
class ConfigSet
{
    /** @var ConfigEntry[] */
    protected $entries;

    /** @var callable|null */
    protected $default;

    /**
     * Constructor.
     *
     * @param ConfigEntry[] $entries The config entries.
     * @param callable|null $default Optional callback to invoke when the config set does not have an entry for a
     *                               given key. The key will be passed as argument, and the callback is expected to
     *                               return a {@link ConfigService} instance, or throw a {@link OutOfBoundsException}.
     */
    public function __construct(array $entries, ?callable $default = null)
    {
        $this->entries = $entries;
        $this->default = $default;
    }

    /**
     * Retrieves a config entry by key.
     *
     * @param string $key The key that maps to the config entry to be returned.
     *
     * @return ConfigEntry
     *
     * @throws OutOfBoundsException If the key does not map to a config entry.
     */
    public function get(string $key) : ConfigEntry
    {
        if ($this->has($key)) {
            return $this->entries[$key];
        }

        if ($this->default !== null) {
            return ($this->default)($key);
        }

        throw new OutOfBoundsException("Undefined config for key \"${key}\"");
    }

    /**
     * Checks if the set has a config entry for a given key.
     *
     * @param string $key The key to check for.
     *
     * @return bool True if the set has a config entry for the given key, false if not.
     */
    public function has(string $key) : bool
    {
        return array_key_exists($key, $this->entries);
    }

    /**
     * Retrieves the entire list of entries.
     *
     * @return ConfigEntry[]
     */
    public function getEntries() : array
    {
        return $this->entries;
    }

    /**
     * Retrieves the entire set of values for all entries.
     *
     * @return array
     */
    public function getValues()
    {
        return Arrays::map($this->entries, function (ConfigEntry $entry) {
            return $entry->getValue();
        });
    }
}
