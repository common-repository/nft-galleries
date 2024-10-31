<?php

namespace RebelCode\Spotlight\Nft\Config;

/**
 * Represents a single config entry.
 *
 * A config entry is an entity that controls where and how a certain config value is stored or read from. This is
 * used in conjunction with {@link ConfigSet} to provide configuration that is customizable at a per-entry level.
 *
 * @see   ConfigSet
 */
interface ConfigEntry
{
    /**
     * Retrieves the value for this config entry.
     *
     * @return mixed
     */
    public function getValue();

    /**
     * Sets the value for this config entry.
     *
     * @param mixed $value The value to set.
     */
    public function setValue($value);
}
