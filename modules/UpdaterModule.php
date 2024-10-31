<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\ServiceList;
use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Actions\UpdateTokensAction;
use RebelCode\Spotlight\Nft\Config\WpOption;
use RebelCode\Spotlight\Nft\Di\ArrayExtension;
use RebelCode\Spotlight\Nft\Di\ConfigService;
use RebelCode\Spotlight\Nft\Engine\Importer;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Wp\CronJob;

class UpdaterModule extends Module
{
    /** The config key for the update interval setting. */
    const CONFIG_UPDATE_INTERVAL = 'updateInterval';

    /** @inheritDoc */
    public function run(ContainerInterface $c)
    {
        // Register the batch handler
        // We don't use the WpModule's API for this because the cron is not auto-scheduled, but scheduled on-demand
        add_action($c->get('batch/cron/hook'), $c->get('batch/cron/handler'));
    }

    /** @inheritDoc */
    public function getFactories(): array
    {
        return [
            //==========================================================================
            // CRON JOB
            //==========================================================================

            'importer' => new Constructor(Importer::class, [
                '@engine/instance',
                'batch/size',
                'batch/delay',
                'batch/cron/hook',
            ]),

            //==========================================================================
            // BATCH IMPORTING
            //==========================================================================

            'batch/size' => new Value(50),
            'batch/delay' => new Value(3),
            'batch/cron/hook' => new Value('snft/import_batch'),
            'batch/cron/handler' => new Factory(['importer'], function (Importer $importer) {
                return [$importer, 'importBatch'];
            }),

            //==========================================================================
            // MAIN UPDATE CRON
            //==========================================================================

            'main/hook' => new Value('snft/update'),
            'main/args' => new Value([]),
            'main/repeat' => new ConfigService('@config/set', static::CONFIG_UPDATE_INTERVAL),

            // The cron job instance
            'main/job' => new Constructor(CronJob::class, [
                'main/hook',
                'main/args',
                'main/repeat',
                'main/handlers',
            ]),

            // The list of handlers for the cron
            'main/handlers' => new ServiceList([
                'main/handlers/tokens',
            ]),

            // The cron handler for updating the tokens
            'main/handlers/tokens' => new Constructor(UpdateTokensAction::class, [
                'importer',
                '@wallets/table',
            ]),

            //==========================================================================
            // CONFIG ENTRIES
            //==========================================================================

            // The config entry that stores the cron job's repetition interval
            'config/interval' => new Value(new WpOption('snft_update_interval', 'hourly')),
        ];
    }

    /** @inheritDoc */
    public function getExtensions(): array
    {
        return [
            // Register the cron job
            'wp/cron_jobs' => new ArrayExtension([
                'main/job',
            ]),
            // Register the config entries
            'config/entries' => new ArrayExtension([
                static::CONFIG_UPDATE_INTERVAL => 'config/interval',
            ]),
        ];
    }
}
