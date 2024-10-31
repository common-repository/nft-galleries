<?php

namespace RebelCode\Spotlight\Nft;

class Hooks
{
    const INIT = 'snft/init';
    const MIGRATION = 'snft/migration';

    const UI_ENQ_ADMIN_APP = 'snft/enqueue_admin_app';
    const UI_ENQ_FRONT_APP = 'snft/enqueue_front_app';
    const UI_LOCALIZE_CONFIG = 'snft/localize_config';
    const UI_REGISTER_ASSETS = 'snft/register_assets';
    const BLOCK_REGISTER_ASSETS = 'snft/wp_block/register_assets';

    const REST_API_CLEAR_CACHE = 'snft/rest_api/clear_cache';
}
