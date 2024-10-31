<?php

namespace RebelCode\Spotlight\Nft\Wp;

/**
 * Represents a WordPress transient in an immutable struct-like form.
 */
class Transient
{
    /** @var string */
    protected $key;

    /** @var int */
    protected $expiry;

    /**
     * Constructor.
     *
     * @param string $key    The transient's key.
     * @param int    $expiry The timestamp for when the transient expires.
     */
    public function __construct(string $key, int $expiry)
    {
        $this->key = $key;
        $this->expiry = $expiry;
    }

    public function getKey() : string
    {
        return $this->key;
    }

    public function getExpiry() : int
    {
        return $this->expiry;
    }

    /**
     * Retrieves the value of a transient.
     *
     * @param Transient $transient The transient instance.
     * @param mixed     $default   The value to return if the transient is not set.
     *
     * @return mixed
     */
    public static function getValue(Transient $transient, $default = null)
    {
        $value = get_transient($transient->key);

        return ($value === false) ? $default : $value;
    }

    /**
     * Sets a value to a transient.
     *
     * @param Transient $transient The transient instance.
     * @param mixed     $value     The value to set to the transient.
     *
     * @return bool True on success, false on failure.
     */
    public static function setValue(Transient $transient, $value)
    {
        return set_transient($transient->key, $value, $transient->expiry);
    }
}
