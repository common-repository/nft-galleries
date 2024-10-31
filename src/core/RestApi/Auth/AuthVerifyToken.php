<?php

namespace RebelCode\Spotlight\Nft\RestApi\Auth;

use RebelCode\Spotlight\Nft\RestApi\AuthGuardInterface;
use WP_REST_Request;

/**
 * A REST API auth handler implementation that verifies a token in the request.
 */
class AuthVerifyToken implements AuthGuardInterface
{
    /**
     * The token value.
     *
     * @var string
     */
    protected $token;

    /**
     * The name of the header from where the nonce value is read.
     *
     * @var string
     */
    protected $header;

    /**
     * Constructor.
     *
     * @param string $header The name of the header from where the nonce value is read.
     * @param string $token  The token value to validate against.
     */
    public function __construct($header, $token)
    {
        $this->header = $header;
        $this->token = $token;
    }

    /** @inheritDoc */
    public function getAuthErrors(WP_REST_Request $request) : array
    {
        $value = $request->get_header($this->header);

        return ($value !== $this->token)
            ? ['Invalid auth token. Please refresh the page.']
            : [];
    }
}
