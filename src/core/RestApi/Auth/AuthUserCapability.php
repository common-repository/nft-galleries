<?php

namespace RebelCode\Spotlight\Nft\RestApi\Auth;

use RebelCode\Spotlight\Nft\RestApi\AuthGuardInterface;
use WP_REST_Request;

/**
 * A REST API auth handler that checks if the request is sent by a logged in user that has a specific capability.
 */
class AuthUserCapability implements AuthGuardInterface
{
    /** @var string */
    protected $capability;

    /**
     * Constructor.
     *
     * @param string $capability The required user capability.
     */
    public function __construct(string $capability)
    {
        $this->capability = $capability;
    }

    /** @inheritDoc */
    public function getAuthErrors(WP_REST_Request $request) : array
    {
        $userId = get_current_user_id();

        if ($userId === 0) {
            return ['You must be logged in'];
        }

        if (!user_can($userId, $this->capability)) {
            return ['You do not have permission to complete this action'];
        }

        return [];
    }
}
