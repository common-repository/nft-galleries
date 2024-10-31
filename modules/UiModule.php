<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Alias;
use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\FuncService;
use Dhii\Services\Factories\StringService;
use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Hooks;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use RebelCode\Spotlight\Nft\Wp\AdminPage;
use RebelCode\Spotlight\Nft\Wp\Asset;
use RebelCode\Spotlight\Nft\Wp\Menu;
use RebelCode\Spotlight\Nft\Wp\SubMenu;

/**
 * The module for the UI front-end of the plugin.
 */
class UiModule extends Module
{
    /** @inheritDoc */
    public function run(ContainerInterface $c)
    {
        // Register the assets
        {
            add_action(Hooks::INIT, $c->get('register_assets_fn'), 100);
        }

        // Actions for enqueueing assets
        {
            // Action that localizes config for the apps.
            add_action(Hooks::UI_LOCALIZE_CONFIG, function () use ($c) {
                $common = $c->get('l10n/common');
                wp_localize_script('snft-common', $c->get('l10n/common/var'), $common);

                $adminCommon = $c->get('l10n/admin-common');
                wp_localize_script('snft-admin-common', $c->get('l10n/admin-common/var'), $adminCommon);
            });

            // Action that enqueues the admin app.
            add_action(Hooks::UI_ENQ_ADMIN_APP, function () use ($c) {
                // Enqueue assets
                array_map([$this, 'enqueueScript'], $c->get('admin_scripts'));
                array_map([$this, 'enqueueStyle'], $c->get('admin_styles'));

                // Localize
                do_action(Hooks::UI_LOCALIZE_CONFIG);
            });

            // Action that enqueues the front app.
            add_action(Hooks::UI_ENQ_FRONT_APP, function () use ($c) {
                // Enqueue assets
                array_map([$this, 'enqueueScript'], $c->get('front_scripts'));
                array_map([$this, 'enqueueStyle'], $c->get('front_styles'));

                // Localize
                do_action(Hooks::UI_LOCALIZE_CONFIG);
            });
        }

        {
            // Remove WordPress' emoji-to-image conversion
            remove_action('wp_head', 'print_emoji_detection_script', 7);
            remove_action('admin_print_scripts', 'print_emoji_detection_script');
            remove_action('wp_print_styles', 'print_emoji_styles');
            remove_action('admin_print_styles', 'print_emoji_styles');
        }
    }

    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            //==========================================================================
            // MENU
            //==========================================================================

            // The menu
            'menu' => new Constructor(Menu::class, [
                'main_page',
                'menu/slug',
                'menu/label',
                'menu/capability',
                'menu/icon',
                'menu/position',
                'menu/items',
            ]),

            // Configuration for the menu
            'menu/slug' => new Value('snft'),
            'menu/capability' => new Value('edit_pages'),
            'menu/label' => new Value('NFT Gallery'),
            'menu/icon' => new Value('dashicons-images-alt2'),
            'menu/position' => new Value(30),

            // The items that appear under the WP Admin menu entry
            // The UI react app  will mount over the menu with identical-looking components. But we still need to
            // register them in order for the menu to appear while the user is on pages where the app is not loaded.
            'menu/items' => new Factory(['menu/slug', 'menu/capability'], function ($parentSlug, $cap) {
                $parentUrl = admin_url("admin.php?page={$parentSlug}");

                return [
                    SubMenu::url("{$parentUrl}&screen=galleries", 'Galleries', $cap),
                    SubMenu::url("{$parentUrl}&screen=settings", 'Settings', $cap),
                ];
            }),

            //==========================================================================
            // MAIN PAGE (Where the app is mounted)
            //==========================================================================

            // The page to show for the menu
            'main_page' => new Constructor(AdminPage::class, ['main_page/title', 'main_page/render_fn']),

            // The title of the page, shown in the browser's tab
            'main_page/title' => new Value('NFTs'),

            // The render function for the page
            'main_page/render_fn' => new FuncService(['main_page/root_element_id'], function ($id) {
                do_action(Hooks::UI_ENQ_ADMIN_APP);

                return sprintf('<div class="wrap"><div id="%s"></div></div>', $id);
            }),

            // The ID of the root element, onto which React will mount
            'main_page/root_element_id' => new Value('snft-admin'),

            //==========================================================================
            // PATHS
            //==========================================================================

            // The path, relative to the plugin directory, where the UI code is located
            'root_path' => new Value('/ui'),
            // The path, relative to the root URL, from where assets are located
            'assets_path' => new Value('/dist'),
            // The path, relative to the root URL, from where static (non-built) assets are located
            'static_path' => new Value('/static'),
            // The path, relative to assets_path, from where scripts are located
            'scripts_path' => new Value(''),
            // The path, relative to assets_path, from where styles are located
            'styles_path' => new Value('/styles'),
            // The path, relative to assets_path, from where images are located
            'images_path' => new Value('/images'),

            //==========================================================================
            // URLS
            //==========================================================================

            // The URL to where the UI code is located
            'root_url' => new StringService('{0}{1}', ['@plugin/url', 'root_path']),
            // The URL from where assets will be served
            'assets_url' => new StringService('{0}{1}', ['root_url', 'assets_path']),
            // The URL from where static assets will be served
            'static_url' => new StringService('{0}{1}', ['root_url', 'static_path']),
            // The URL from where scripts and styles are served
            'scripts_url' => new StringService('{0}{1}', ['assets_url', 'scripts_path']),
            'styles_url' => new StringService('{0}{1}', ['assets_url', 'styles_path']),
            // The URL from where images will be served
            'images_url' => new StringService('{0}{1}', ['root_url', 'images_path']),

            //==========================================================================
            // ASSETS
            //==========================================================================

            // The version to use for assets (the plugin's current version)
            'assets_ver' => new Alias('plugin/version', new Value('')),

            // The scripts
            'scripts' => new Factory(['scripts_url', 'assets_ver'], function ($url, $ver) {
                return [
                    /* === VENDORS === */
                    'snft-runtime' => Asset::script("{$url}/runtime.js", $ver),
                    'snft-admin-vendors' => Asset::script("{$url}/admin-vendors.js", $ver),
                    'snft-common-vendors' => Asset::script("{$url}/common-vendors.js", $ver, [
                        'snft-runtime',
                        'react',
                        'react-dom',
                    ]),

                    /* === FEED === */

                    'snft-common' => Asset::script("{$url}/common.js", $ver, [
                        'snft-common-vendors',
                    ]),
                    'snft-feed' => Asset::script("{$url}/feed.js", $ver, [
                        'snft-common',
                    ]),
                    'snft-layouts' => Asset::script("{$url}/layouts.js", $ver, [
                        'snft-feed',
                    ]),

                    /* === ADMIN COMMON === */

                    'snft-admin-common' => Asset::script("{$url}/admin-common.js", $ver, [
                        'snft-admin-vendors',
                        'snft-common',
                        'snft-feed',
                        'snft-layouts',
                    ]),
                    'snft-editor' => Asset::script("{$url}/feed-editor.js", $ver, [
                        'snft-admin-common',
                        'snft-feed',
                    ]),

                    /* === FRONT APP === */

                    'snft-front' => Asset::script("{$url}/front-app.js", $ver, [
                        'snft-feed',
                        'snft-layouts',
                    ]),

                    /* === ADMIN APP === */

                    // The main admin app
                    'snft-admin' => Asset::script("{$url}/admin-app.js", $ver, [
                        'snft-editor',
                    ]),

                    /* === WP BLOCK APP === */

                    'snft-wp-block' => Asset::style("{$url}/wp-block.js", $ver, [
                        'snft-admin-common',
                        'snft-feed',
                    ]),
                ];
            }),

            // The styles
            'styles' => new Factory(['styles_url', 'static_url', 'assets_ver'], function ($url, $static, $ver) {
                return [
                    'snft-common' => Asset::style("{$url}/common.css", $ver, []),
                    'snft-feed' => Asset::style("{$url}/feed.css", $ver, [
                        'snft-common',
                    ]),
                    'snft-layouts' => Asset::style("{$url}/layouts.css", $ver, [
                        'snft-feed',
                    ]),
                    'snft-admin-common' => Asset::style("{$url}/admin-common.css", $ver, [
                        'snft-common',
                        'snft-feed',
                        'snft-layouts',
                        'dashicons',
                    ]),
                    'snft-admin' => Asset::style("{$url}/admin-app.css", $ver, [
                        'snft-admin-common',
                        'wp-edit-post',
                    ]),
                    'snft-editor' => Asset::style("{$url}/feed-editor.css", $ver, [
                        'snft-admin-common',
                        'snft-feed',
                    ]),
                    'snft-front' => Asset::style("{$url}/front-app.css", $ver, [
                        'snft-common',
                        'snft-layouts',
                    ]),
                    'snft-wp-block' => Asset::style("{$url}/wp-block.css", $ver),
                ];
            }),

            // The function that registers all the scripts and styles
            'register_assets_fn' => new FuncService(['scripts', 'styles'], function ($arg, $scripts, $styles) {
                Arrays::eachAssoc($scripts, [Asset::class, 'register']);
                Arrays::eachAssoc($styles, [Asset::class, 'register']);

                do_action(Hooks::UI_REGISTER_ASSETS);
            }),

            // The scripts to load for the admin app
            'admin_scripts' => new Value([
                'wp_enqueue_media', // see wp_enqueue_media()
                'snft-admin',
            ]),

            // The styles to load for the admin app
            'admin_styles' => new Value([
                'snft-admin',
                'snft-editor',
            ]),

            // The scripts to load for the front app
            'front_scripts' => new Value([
                'snft-front',
            ]),

            // The styles to load for the front app
            'front_styles' => new Value([
                'snft-front',
            ]),

            //==========================================================================
            // LOCALIZATION
            //==========================================================================

            // Localization data for the common bundle
            'l10n/common/var' => new Value('SnftCommonConfig'),
            'l10n/common' => new Factory(
                ['images_url', '@rest_api/auth/public/token'],
                function ($imagesUrl, $token) {
                    return [
                        'restApi' => [
                            'baseUrl' => '',
                            'authToken' => $token,
                        ],
                        'imagesUrl' => $imagesUrl,
                    ];
                }
            ),

            // Localization data for the admin-common bundle
            'l10n/admin-common/var' => new Value('SnftAdminCommonConfig'),
            'l10n/admin-common' => new Factory([], function () {
                return [
                    'adminUrl' => admin_url(),
                    'restApi' => [
                        'wpNonce' => wp_create_nonce('wp_rest'),
                    ],
                    'cronSchedules' => Arrays::mapPairs(wp_get_schedules(), function ($key, $val, $idx) {
                        return [$idx, array_merge($val, ['key' => $key])];
                    }),
                    'hasElementor' => defined('ELEMENTOR_VERSION'),
                ];
            }),

            //==========================================================================
            // ADMIN ONBOARDING
            //==========================================================================

            // The name of option that indicates whether the user went through the onboarding process
            'onboarding/option' => new Value('snft_user_did_onboarding'),
            // Whether or not the user has completed the onboarding process
            'onboarding/is_done' => new Factory(['onboarding/option'], function ($option) {
                return filter_var(get_option($option, false), FILTER_VALIDATE_BOOLEAN);
            }),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            'wp/menus' => new ArrayExtension(['menu']),
        ];
    }

    /**
     * Enqueues a script by its handle, or via a callback function (useful for enqueueing WP core assets).
     *
     * @param string|callable $script Script handle or callback function.
     */
    protected function enqueueScript($script)
    {
        if (is_callable($script)) {
            $script();
        } else {
            wp_enqueue_script($script);
        }
    }

    /**
     * Enqueues a style by its handle, or via a callback function (useful for enqueueing WP core assets).
     *
     * @param string|callable $style Style handle or callback function.
     */
    protected function enqueueStyle($style)
    {
        if (is_callable($style)) {
            $style();
        } else {
            wp_enqueue_style($style);
        }
    }
}
