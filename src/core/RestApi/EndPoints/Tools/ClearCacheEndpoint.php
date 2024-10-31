<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Tools;

use Exception;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Hooks;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use WP_REST_Request;
use WP_REST_Response;

/**
 * The handler for the REST API endpoint that clears the cache.
 */
class ClearCacheEndpoint extends AbstractEndpointHandler
{
    /** @var Table */
    protected $tokensTable;

    /** Constructor */
    public function __construct(Table $tokensTable)
    {
        $this->tokensTable = $tokensTable;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        try {
            $this->tokensTable->delete(null);

            do_action(Hooks::REST_API_CLEAR_CACHE);

            return new WP_REST_Response(['success' => true]);
        } catch (Exception $exc) {
            return new WP_REST_Response(['success' => false, 'error' => $exc->getMessage()], 500);
        }
    }
}
