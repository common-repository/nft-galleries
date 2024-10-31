<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Settings;

use RebelCode\Spotlight\Nft\Config\ConfigSet;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/** The handler for the endpoint that saves settings values. */
class SaveSettingsEndpoint extends AbstractEndpointHandler
{
    /** @var ConfigSet */
    protected $config;

    /** Constructor */
    public function __construct(ConfigSet $config)
    {
        $this->config = $config;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        $patch = $request->get_param('settings');

        if (!is_array($patch)) {
            return new WP_Error('snft_no_settings', 'Must provide an object of settings to patch', [
                'status' => 400,
            ]);
        }

        foreach ($patch as $key => $value) {
            $this->config->get($key)->setValue($value);
        }

        return new WP_REST_Response($this->config->getValues());
    }
}
