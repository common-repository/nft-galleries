<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Settings;

use RebelCode\Spotlight\Nft\Config\ConfigSet;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use WP_REST_Request;
use WP_REST_Response;

/**
 * The handler for the endpoint that provides settings values.
 */
class GetSettingsEndpoint extends AbstractEndpointHandler
{
    /** @var ConfigSet */
    protected $config;

    /**
     * Constructor.
     *
     * @param ConfigSet $config The config set.
     */
    public function __construct(ConfigSet $config)
    {
        $this->config = $config;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        return new WP_REST_Response($this->config->getValues());
    }
}
