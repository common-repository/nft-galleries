<?php

namespace RebelCode\Spotlight\Nft\Wp;

/**
 * Represents an asset, a WordPress mechanism used for enqueueing scripts and stylesheets,
 */
class Asset
{
    /** The type for script assets.*/
    const SCRIPT = 0;
    /** The type for style assets. */
    const STYLE = 1;

    /** @var int */
    public $type;

    /** @var string */
    public $url;

    /** @var string[] */
    public $deps;

    /** @var string|null */
    public $ver;

    /**
     * Constructor.
     *
     * @param int         $type Either {@link Asset::SCRIPT} or {@link Asset::style}.
     * @param string      $url  The URL of the asset.
     * @param string|null $ver  The version of the asset, used for caching.
     * @param string[]    $deps Keys of dependency assets of the same type.
     */
    public function __construct(int $type, string $url, string $ver = null, array $deps = [])
    {
        $this->type = $type;
        $this->url = $url;
        $this->ver = $ver;
        $this->deps = $deps;
    }

    /**
     * Retrieves the asset type.
     *
     * @see   Asset::SCRIPT
     * @see   Asset::style
     *
     * @return int
     */
    public function getType() : int
    {
        return $this->type;
    }

    /**
     * Retrieves the asset URL.
     *
     * @return string
     */
    public function getUrl() : string
    {
        return $this->url;
    }

    /**
     * Retrieves the asset's dependencies.
     *
     * @return string[]
     */
    public function getDeps() : array
    {
        return $this->deps;
    }

    /**
     * Retrieves the version of the asset.
     *
     * @return string
     */
    public function getVer() : ?string
    {
        return $this->ver;
    }

    /**
     * Creates a script asset.
     *
     * @param string      $url  The URL of the asset.
     * @param string|null $ver  The version of the asset, used for caching.
     * @param string[]    $deps Keys of dependency script assets.
     *
     * @return static
     */
    public static function script(string $url, string $ver = null, array $deps = [])
    {
        return new static(static::SCRIPT, $url, $ver, $deps);
    }

    /**
     * Creates a style asset.
     *
     * @param string      $url  The URL of the asset.
     * @param string|null $ver  The version of the asset, used for caching.
     * @param string[]    $deps Keys of dependency style assets.
     *
     * @return static
     */
    public static function style(string $url, string $ver = null, array $deps = [])
    {
        return new static(static::STYLE, $url, $ver, $deps);
    }

    /**
     * Registers an asset.
     *
     * @param string $key   The handle with which to register the asset.
     * @param Asset  $asset The asset instance.
     *
     * @return bool True on success, false on failure.
     */
    public static function register(string $key, Asset $asset)
    {
        return ($asset->type === static::SCRIPT)
            ? wp_register_script($key, $asset->url, $asset->deps, $asset->ver, true)
            : wp_register_style($key, $asset->url, $asset->deps, $asset->ver);
    }
}
