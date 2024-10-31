<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Extension;
use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\ServiceList;
use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Di\EndPointService;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\RestApi\Auth\AuthUserCapability;
use RebelCode\Spotlight\Nft\RestApi\Auth\AuthVerifyToken;
use RebelCode\Spotlight\Nft\RestApi\EndPointManager;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Tools\ClearCacheEndpoint;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\Tools\ClearCacheFeedEndpoint;
use RebelCode\Spotlight\Nft\Utils\Strings;

/** The module that adds the REST API to the plugin. */
class RestApiModule extends Module
{
    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            // The namespace for the REST API
            'namespace' => new Value('snft'),

            // The REST API base URL
            'base_url' => new Factory(['namespace'], function ($ns) {
                return rest_url() . $ns;
            }),

            // The REST API endpoint manager
            'manager' => new Factory(['namespace', 'endpoints'], function ($ns, $endpoints) {
                return new EndPointManager($ns, $endpoints);
            }),

            // The REST API endpoints under the `namespace`
            'endpoints' => new ServiceList([
                'endpoints/clear_cache',
                'endpoints/clear_cache_feed',
            ]),

            //==========================================================================
            // USER AUTH
            //==========================================================================

            // The user capability required to access the REST API endpoints that manage entities
            'auth/user/capability' => new Value('edit_pages'),

            // The auth guard to use to authorize logged-in users
            'auth/user' => new Constructor(AuthUserCapability::class, ['auth/user/capability']),

            //==========================================================================
            // PUBLIC AUTH
            //==========================================================================

            // The HTTP header where the public REST API token should be included for authorized requests
            'auth/public/nonce_header' => new Value('X-SNFT-Auth-Token'),
            // The name of the DB option where the public token is stored
            'auth/public/token_option' => new Value('snft_rest_api_auth_token'),
            // The token to use for public REST API requests.
            // This factory should detect when the site URL changes and
            'auth/public/token' => new Factory(['auth/public/token_option'], function ($optionName) {
                $token = get_option($optionName, null);

                if (empty($token)) {
                    $token = sha1(Strings::generateRandom(32));
                    update_option($optionName, $token);
                }

                return $token;
            }),

            // The auth guard to use for REST API endpoints to authorize requests against the token
            'auth/public' => new Constructor(AuthVerifyToken::class, [
                'auth/public/nonce_header',
                'auth/public/token',
            ]),

            //==========================================================================
            // CACHE CLEAR ENDPOINTS
            //==========================================================================

            // The endpoint for clearing the API cache
            'endpoints/clear_cache' => new EndPointService(
                '/clear_cache',
                ['POST'],
                ClearCacheEndpoint::class,
                ['@tokens/table'],
                'auth/user'
            ),

            // The endpoint for clearing the cache for a specific feed
            'endpoints/clear_cache_feed' => new EndPointService(
                '/clear_cache/feed',
                ['POST'],
                ClearCacheFeedEndpoint::class,
                ['@engine/instance', '@feeds/manager'],
                'auth/user'
            ),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            // Add the REST API's URL to the localization data for the common bundle
            'ui/l10n/common' => new Extension(['base_url'], function ($config, $baseUrl) {
                $config['restApi']['baseUrl'] = $baseUrl;

                return $config;
            }),
        ];
    }

    /** @inheritDoc */
    public function run(ContainerInterface $c)
    {
        add_action('rest_api_init', function () use ($c) {
            /* @var $manager EndPointManager */
            $manager = $c->get('manager');
            $manager->register();
        });

        // Whitelist the REST API endpoints with the "JWT Auth" plugin
        // https://wordpress.org/plugins/jwt-auth/
        add_filter('jwt_auth_whitelist', function ($whitelist) use ($c) {
            $whitelist[] = '/' . rest_get_url_prefix() . '/' . $c->get('namespace') . '/*';

            return $whitelist;
        });

        // Add the public nonce header to the allowed CORS header list
        add_filter('rest_allowed_cors_headers', function ($headers) use ($c) {
            $headers[] = $c->get('auth/public/nonce_header');

            return $headers;
        });
    }
}
