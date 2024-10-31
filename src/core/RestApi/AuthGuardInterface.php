<?php

namespace RebelCode\Spotlight\Nft\RestApi;

use WP_REST_Request;

/**
 * Represents an authorization guard for the REST API.
 *
 * Objects that implement this interface are used to determine if a client is authorized to carry out a specific
 * request.
 */
interface AuthGuardInterface
{
    /**
     * Retrieves any auth errors from a request.
     *
     * @param WP_REST_Request $request The request.
     *
     * @return array|null Any authorization error messages. An empty array signifies that the request is authorized.
     */
    public function getAuthErrors(WP_REST_Request $request) : array;
}
