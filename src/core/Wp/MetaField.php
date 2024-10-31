<?php

namespace RebelCode\Spotlight\Nft\Wp;

/**
 * Represents configuration for a WordPress post meta field in an immutable struct-like form.
 */
class MetaField
{
    /**
     * The default meta field registration arguments.
     */
    const DEFAULT_ARGS = [
        'single' => true,
        'show_in_rest' => true,
    ];

    /** @var string */
    protected $key;

    /** @var array */
    protected $args;

    /**
     * Constructor.
     *
     * @param string $key  The key of the meta field.
     * @param array  $args Optional addition arguments. See {@link register_meta()}.
     */
    public function __construct(string $key, array $args = self::DEFAULT_ARGS)
    {
        $this->key = $key;
        $this->args = $args;
    }

    public function getKey() : string
    {
        return $this->key;
    }

    public function getArgs() : array
    {
        return $this->args;
    }

    /**
     * Registers a meta field for a specific WordPress post type.
     *
     * @param MetaField $field    The meta field to register.
     * @param string    $postType The slug of the post type to register for.
     */
    public static function registerFor(MetaField $field, string $postType)
    {
        register_post_meta($postType, $field->key, $field->args);
    }
}
