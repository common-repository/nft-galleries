<?php

namespace RebelCode\Spotlight\Nft\RestApi;

use WP_Error;
use WP_REST_Request;

/**
 * A REST API endpoint manager.
 */
class EndPointManager
{
    /**
     * The namespace.
     *
     * @var string
     */
    protected $namespace;

    /**
     * The REST API endpoints.
     *
     * @var EndPoint[]
     */
    protected $endPoints;

    /**
     * Constructor.
     *
     * @param string     $namespace The namespace.
     * @param EndPoint[] $endPoints The REST API endpoints.
     */
    public function __construct(string $namespace, array $endPoints)
    {
        $this->namespace = $namespace;
        $this->endPoints = $endPoints;
    }

    /**
     * Registers the routes and endpoints with WordPress.
     */
    public function register()
    {
        foreach ($this->endPoints as $endPoint) {
            $route = $endPoint->getRoute();
            $methods = $endPoint->getMethods();
            $handler = $endPoint->getHandler();
            $authFn = $endPoint->getAuthHandler();

            register_rest_route($this->namespace, $route, [
                'methods' => $methods,
                'callback' => $handler,
                'permission_callback' => $this->getPermissionCallback($authFn),
            ]);
        }
    }

    /**
     * Retrieves the permission callback for an auth guard.
     *
     * @param AuthGuardInterface|null $auth The auth guard instance, if any.
     *
     * @return callable The callback.
     */
    protected function getPermissionCallback(AuthGuardInterface $auth = null)
    {
        if ($auth === null) {
            return '__return_true';
        }

        return function (WP_REST_Request $request) use ($auth) {
            $errors = $auth->getAuthErrors($request);

            if (count($errors) === 0) {
                return true;
            }

            return new WP_Error('unauthorized', 'Unauthorized', [
                'status' => 401,
                'reasons' => $errors,
            ]);
        };
    }
}
