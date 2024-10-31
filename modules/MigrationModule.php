<?php

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\FuncService;
use Dhii\Services\Factories\Value;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Config\ConfigEntry;
use RebelCode\Spotlight\Nft\Config\WpOption;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Hooks;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use RebelCode\Spotlight\Nft\Wp\CronJob;

/** The module that adds the migration system. */
class MigrationModule extends Module
{
    /** Controls whether migrations use the locking mechanisms. */
    const CHECK_LOCK = false;
    const VERSION = 'version';
    const UPGRADE_LOCK = 'upgrade_lock';

    /** @inheritDoc */
    public function run(ContainerInterface $c)
    {
        // Hook in the migration function into the migration cron
        add_action(Hooks::MIGRATION, $c->get('function'), 10, 2);

        /* @var $verCfg ConfigEntry */
        $verCfg = $c->get('config/version');

        $dbVer = $verCfg->getValue();
        $currVer = $c->get('plugin/version');

        // If "0.0" (no version in DB), it could be a new installation.
        // Try to detect an existing installation by checking for wallets.
        // If there are wallets in the DB, keep the "0.0" to invoke the migration.
        // If there are no wallets, it's most likely a new installation. No migration needed.
        if ($dbVer === '0.0') {
            $dbVer = count($c->get('wallets/table')->query()) > 0 ? $dbVer : $currVer;
        }

        /* @var $lockCfg ConfigEntry */
        $lockCfg = $c->get('config/upgrade_lock');
        // Check if migrations are locked
        $isLocked = static::CHECK_LOCK && $lockCfg->getValue() === '1';

        // Compare the DB and current versions. If DB version is lower, run the migrations
        if (!$isLocked && version_compare($dbVer, $currVer, '<')) {
            // Lock to prevent other threads from registering the cron
            $lockCfg->setValue('1');

            // Register the migration cron
            CronJob::register(new CronJob(Hooks::MIGRATION, [$dbVer, SNFT_VERSION]));
        }
    }

    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            // The DB config that stores the previous version
            'config/version' => new Value(new WpOption('snft_version', '0.0')),

            // The DB config that "locks" other threads from also performing the upgrade
            'config/upgrade_lock' => new Value(new WpOption('snft_upgrade_lock', '0')),

            // The list of callbacks to invoke if a migration is required
            'migrations' => new Value([]),

            // The migration function
            'function' => new FuncService(
                ['config/upgrade_lock', 'config/version', 'migrations'],
                function ($dbVer, $currVer, ConfigEntry $lock, ConfigEntry $version, array $migrations) {
                    try {
                        // Make sure the migration is locked
                        $lock->setValue('1');

                        // Run the callbacks
                        Arrays::callEach($migrations, [$dbVer, $currVer]);

                        // Update the version config
                        $version->setValue(SNFT_VERSION);
                    } finally {
                        // Unlock the upgrade process
                        $lock->setValue('0');
                    }
                }
            ),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            // Register the config entries into the config set
            'config/entries' => new ArrayExtension([
                static::VERSION => 'config/version',
                static::UPGRADE_LOCK => 'config/upgrade_lock',
            ]),
        ];
    }
}
