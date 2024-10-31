<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\Value;
use RebelCode\Spotlight\Nft\Actions\RenderShortcode;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Wp\Shortcode;

/** The module that adds the shortcode (to display feeds) to the plugin. */
class ShortcodeModule extends Module
{
    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            'tag' => new Value('nft-gallery'),
            'callback' => new Constructor(RenderShortcode::class, [
                '@feeds/table',
                '@wallets/table',
                '@feeds/template',
                '@server/instance',
                '@config/set',
            ]),
            'instance' => new Constructor(Shortcode::class, ['tag', 'callback']),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            'wp/shortcodes' => new ArrayExtension(['instance']),
        ];
    }
}
