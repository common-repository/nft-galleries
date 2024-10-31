<?php

/*
 * @wordpress-plugin
 *
 * Plugin Name: NFT Galleries
 * Description: Display beautiful NFT galleries anywhere on your website in seconds.
 * Version: 0.1.1
 * Plugin URI: https://rebelcode.com/nft-gallery-for-wordpress/
 * Author: RebelCode
 * Author URI: https://rebelcode.com
 * Requires at least: 5.7
 * Requires PHP: 7.4
 */

use RebelCode\Spotlight\Nft\Hooks;
use RebelCode\Spotlight\Nft\Plugin;

// If not running within a WordPress context, or the plugin is already running, stop
if (!defined('ABSPATH')) {
    exit;
}

//======================================================================================================================
// FUNCTIONS
//======================================================================================================================

if (!function_exists('snft')) {
    /**
     * Retrieves the plugin instance.
     *
     * @return Plugin
     */
    function snft()
    {
        static $instance = null;

        return ($instance === null)
            ? $instance = new Plugin(SNFT_DIR . '/plugin.php')
            : $instance;
    }
}

if (!function_exists('snftCheckRequirements')) {
    /**
     * Checks whether the plugin dependencies are satisfied.
     *
     * @return bool True if dependencies are satisfied, false if not.
     */
    function snftCheckRequirements()
    {
        // Check PHP version
        if (version_compare(PHP_VERSION, SNFT_MIN_PHP_VERSION, '<')) {
            add_action('admin_notices', function () {
                printf(
                    '<div class="notice notice-error"><p>%s</p></div>',
                    sprintf(
                        _x(
                            '%1$s requires PHP version %2$s or later',
                            '%1$s is the name of the plugin, %2$s is the required PHP version',
                            'snft'
                        ),
                        '<strong>' . SNFT_NAME . '</strong>',
                        SNFT_MIN_PHP_VERSION
                    )
                );
            });

            return false;
        }

        // Check WordPress version
        global $wp_version;
        if (version_compare($wp_version, SNFT_MIN_WP_VERSION, '<')) {
            add_action('admin_notices', function () {
                printf(
                    '<div class="notice notice-error"><p>%s</p></div>',
                    sprintf(
                        _x(
                            '%1$s requires WordPress version %2$s or later',
                            '%1$s is the name of the plugin, %2$s is the required WP version',
                            'snft'
                        ),
                        '<strong>' . SNFT_NAME . '</strong>',
                        SNFT_MIN_WP_VERSION
                    )
                );
            });

            return false;
        }

        // Check for extensions
        foreach (SNFT_PHP_EXTENSIONS as $ext) {
            if (!extension_loaded($ext)) {
                add_action('admin_notices', function () use ($ext) {
                    printf(
                        '<div class="notice notice-error"><p>%s</p></div>',
                        sprintf(
                            _x(
                                '%1$s requires the %2$s PHP extension. Kindly install and enable this extension or contact your hosting provider for assistance.',
                                '%1$s is the name of the plugin, %2$s is the name of the extension',
                                'snft'
                            ),
                            '<strong>' . SNFT_NAME . '</strong>',
                            '<code>' . $ext . '</code>'
                        )
                    );
                });

                return false;
            }
        }

        return true;
    }
}

//======================================================================================================================
// BOOTSTRAPPING
//======================================================================================================================

// Filter whether this plugin can run
if (apply_filters('snft/can_run', true) !== true) {
    return;
}

// Define plugin constants, if not already defined
if (!defined('SNFT')) {
    // Used to detect the plugin
    define('SNFT', true);
    // The plugin name
    define('SNFT_NAME', 'NFT Galleries');
    // The plugin version
    define('SNFT_VERSION', '0.1.1');
    // The path to the plugin's main file
    define('SNFT_FILE', __FILE__);
    // The dir to the plugin's directory
    define('SNFT_DIR', __DIR__);
    // The minimum required PHP version
    define('SNFT_MIN_PHP_VERSION', '7.4');
    // The minimum required WordPress version
    define('SNFT_MIN_WP_VERSION', '5.7');
    // The required PHP extensions
    define('SNFT_PHP_EXTENSIONS', ['json']);

    // Dev mode constant that controls whether development tools are enabled
    if (!defined('SNFT_DEV')) {
        define('SNFT_DEV', false);
    }
}

// Stop if dependencies aren't satisfied
if (!snftCheckRequirements()) {
    return;
}

// Load the autoloader - loaders all the way down!
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
}

// Run the plugin's modules
add_action('plugins_loaded', function () {
    // Trigger the plugin-specific `init` action on the WordPress `init` action
    add_action('init', function () {
        do_action(Hooks::INIT);
    }, 11);

    try {
        snft()->run();
    } catch (Throwable $ex) {
        if (!is_admin()) {
            return;
        }

        $message = sprintf(
            _x('%s has encountered an error.', '%s is the name of the plugin', 'snft'),
            '<b>' . SNFT_NAME . '</b>'
        );

        $link = current_user_can('activate_plugins')
            ? sprintf(
                '<a href="%s">%s</a>',
                admin_url('plugins.php?snft_error_deactivate=' . wp_create_nonce('snft_error_deactivate')),
                __('Click here to deactivate the plugin', 'snft')
            )
            : '';

        $details = '<b>' . __('Error details', 'snft') . '</b>' .
                   "<pre>{$ex->getMessage()}</pre>" .
                   "<pre>In file: {$ex->getFile()}:{$ex->getLine()}</pre>" .
                   "<pre>{$ex->getTraceAsString()}</pre>";

        $style = '<style type="text/css">#error-page {max-width: unset;} pre {overflow-x: auto;}</style>';

        wp_die(
            "$style <p>$message <br /> $link</p> $details",
            SNFT_NAME . ' | Error',
            [
                'back_link' => true,
            ]
        );
    }
});

//======================================================================================================================
// EMERGENCY DEACTIVATION
// Allows the user to deactivate the plugin from the error screen to prevent lock-out.
//======================================================================================================================

if (!empty($_GET['snft_error_deactivate'])) {
    if (!function_exists('wp_verify_nonce')) {
        require ABSPATH . '/wp-includes/pluggable.php';
    }
    if (!function_exists('deactivate_plugins')) {
        require ABSPATH . '/wp-admin/includes/plugin.php';
    }
    if (!function_exists('current_user_can')) {
        require ABSPATH . '/wp-includes/capabilities.php';
    }

    if (current_user_can('activate_plugins') &&
        wp_verify_nonce($_GET['snft_error_deactivate'], 'snft_error_deactivate') !== false) {
        deactivate_plugins([plugin_basename(__FILE__)]);
        wp_redirect($_SERVER['REQUEST_URI'] ?? admin_url());
        exit(1);
    } else {
        wp_die('You cannot do that!', 'NFT Gallery - Deactivation Forbidden', [
            'response' => 403,
            'back_link' => true,
        ]);
    }
}
