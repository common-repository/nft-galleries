<?php

namespace RebelCode\Spotlight\Nft\Wp;

/**
 * Represents configuration for a WordPress shortcode in an immutable struct-like form.
 */
class Shortcode
{
    /** @var string */
    protected $tag;

    /** @var callable*/
    protected $callback;

    /**
     * Constructor.
     *
     * @param string   $tag      The shortcode tag.
     * @param callable $callback The function that renders the shortcode. Should return a string containing the
     *                           rendered result.
     */
    public function __construct(string $tag, callable $callback)
    {
        $this->tag = $tag;
        $this->callback = $callback;
    }

    public function getTag() : string
    {
        return $this->tag;
    }

    public function getCallback() : callable
    {
        return $this->callback;
    }

    /**
     * Registers a shortcode to WordPress.
     *
     * @param Shortcode $shortcode The shortcode instance to register.
     */
    public static function register(Shortcode $shortcode)
    {
        add_shortcode($shortcode->tag, $shortcode->callback);
    }
}
