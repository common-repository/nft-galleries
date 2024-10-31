<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Tokens;

use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use RebelCode\Spotlight\Nft\Server;
use WP_REST_Request;
use WP_REST_Response;

class GetTokensEndPoint extends AbstractEndpointHandler
{
    /** @var Server */
    protected $server;

    /** @var int */
    protected $expiry;

    /** Constructor. */
    public function __construct(Server $server, int $expiry = 0)
    {
        $this->server = $server;
        $this->expiry = $expiry;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        $options = $request->get_param('options') ?? [];
        $from = $request->get_param('from') ?? 0;
        $num = $request->get_param('num') ?? null;

        $result = $this->server->getFeedTokens($options, $from, $num);
        $headers = [];

        if ($this->expiry > 0) {
            $headers['Expires'] = gmdate('D, d M Y H:i:s T', $this->expiry);
        }

        return new WP_REST_Response($result, 200, $headers);
    }
}
