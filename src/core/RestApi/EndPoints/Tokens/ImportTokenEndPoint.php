<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Tokens;

use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use RebelCode\Spotlight\Nft\Server;
use WP_REST_Request;
use WP_REST_Response;

/** The endpoint for importing media. */
class ImportTokenEndPoint extends AbstractEndpointHandler
{
    /** @var Server */
    protected $server;

    /** Constructor */
    public function __construct(Server $server)
    {
        $this->server = $server;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        $options = $request->get_param('options') ?? [];
        $result = $this->server->import($options);

        return new WP_REST_Response($result);
    }
}
