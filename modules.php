<?php

namespace RebelCode\Spotlight\Nft\Modules;

return [
    // Plugin modules
    'wp' => new WordPressModule(),
    'config' => new ConfigModule(),
    'migrator' => new MigrationModule(),
    // DB modules
    'tokens' => new TokensModule(),
    'wallets' => new WalletsModule(),
    'feeds' => new GalleriesModule(),
    // Back-end modules
    'meta_cache' => new MetaCacheModule(),
    'rest_api' => new RestApiModule(),
    'opensea' => new OpenSeaModule(),
    'engine' => new EngineModule(),
    'server' => new ServerModule(),
    'updater' => new UpdaterModule(),
    // User interface modules
    'ui' => new UiModule(),
    'shortcode' => new ShortcodeModule(),
    'wp_block' => new WpBlockModule(),
    // Integrations
    'integrations/caching' => new CacheIntegrationsModule(),
];
