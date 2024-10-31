<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Hooks;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Wp\Asset;
use WP_Block_Type;

/**
 * The module that adds the block type to the WordPress block editor.
 */
class WpBlockModule extends Module
{
    /** @inheritDoc */
    public function run(ContainerInterface $c): void
    {
        add_action('enqueue_block_editor_assets', function () use ($c) {
            // Register block assets
            Asset::register('snft-wp-block-js', $c->get('editor_script'));
            Asset::register('snft-wp-block-css', $c->get('editor_style'));

            // Makes sure script config is localized
            do_action(Hooks::UI_LOCALIZE_CONFIG);

            // Triggers action to allow extension
            do_action(Hooks::BLOCK_REGISTER_ASSETS);
        });
    }

    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            'type' => new Constructor(WP_Block_Type::class, ['id', 'args']),
            'id' => new Value('spotlight/nft'),
            'args' => new Factory(['render_fn'], function ($renderFn) {
                return [
                    'editor_script' => 'snft-wp-block-js',
                    'editor_style' => 'snft-wp-block-css',
                    'render_callback' => $renderFn,
                ];
            }),
            'editor_script' => new Factory(
                ['@ui/scripts_url', '@ui/assets_ver', 'script_deps'],
                function ($url, $ver, $deps) {
                    return Asset::script("{$url}/wp-block.js", $ver, $deps);
                }
            ),
            'editor_style' => new Factory(
                ['@ui/scripts_url', '@ui/assets_ver', 'style_deps'],
                function ($url, $ver, $deps) {
                    return Asset::style("{$url}/styles/wp-block.css", $ver, $deps);
                }
            ),
            'script_deps' => new Value([
                'snft-admin-common',
                'snft-editor',
            ]),
            'style_deps' => new Value([
                'snft-admin-common',
                'snft-editor',
            ]),
            'render_fn' => new Factory(['@shortcode/callback'], function ($shortcode) {
                return function ($attrs) use ($shortcode) {
                    $galleryId = $attrs['galleryId'] ?? 0;
                    $className = $attrs['className'] ?? '';

                    return (is_numeric($galleryId) && $galleryId > 0)
                        ? call_user_func($shortcode, ['gallery' => $galleryId, 'class-name' => $className])
                        : '';
                };
            }),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            // Register the block type to WordPress
            'wp/block_types' => new ArrayExtension(['type']),
        ];
    }
}
