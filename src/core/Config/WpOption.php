<?php

namespace RebelCode\Spotlight\Nft\Config;

/**
 * A config entry implementation that uses WordPress Options for storage.
 *
 * @see   ConfigService
 */
class WpOption implements ConfigEntry
{
    /** @var string */
    protected $key;

    /** @var mixed */
    protected $default;

    /** @var bool */
    protected $autoload;

    /**
     * Constructor.
     *
     * @param string $key The option key.
     * @param mixed $default The default value for this option.
     * @param bool $autoload Whether to autoload the option or not.
     */
    public function __construct(string $key, $default = null, bool $autoload = false)
    {
        $this->key = $key;
        $this->default = $default;
        $this->autoload = $autoload;
    }

    /**
     * Retrieves the key of the option.
     *
     * @return string
     */
    public function getKey() : string
    {
        return $this->key;
    }

    /**
     * Retrieves the default value of the option.
     *
     * @return mixed
     */
    public function getDefault()
    {
        return $this->default;
    }

    /** @inheritDoc */
    public function getValue()
    {
        return get_option($this->key, $this->default);
    }

    /** @inheritDoc */
    public function setValue($value)
    {
        return update_option($this->key, $value, $this->autoload);
    }
}
