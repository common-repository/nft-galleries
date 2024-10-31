<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Engine;

use RebelCode\Iris\Engine;
use RebelCode\Iris\Fetcher\FetchQuery;
use RebelCode\Iris\Fetcher\FetchResult;
use RebelCode\Spotlight\Nft\Wp\CronJob;

class Importer
{
    const INTERRUPT_TRANSIENT = '_snft_importer_interrupt';
    const RUNNING_MARKER = '_snft_importer_running';

    /** @var Engine */
    protected $engine;

    /** @var int */
    protected $batchSize;

    /** @var int */
    protected $batchDelay;

    /** @var string */
    protected $batchCronHook;

    public function __construct(Engine $engine, int $batchSize, int $batchDelay, string $batchCronHook)
    {
        $this->engine = $engine;
        $this->batchSize = $batchSize;
        $this->batchDelay = $batchDelay;
        $this->batchCronHook = $batchCronHook;
    }

    public function updateSources(array $sources): array
    {
        $items = [];
        $errors = [];
        $scheduledBatch = false;

        foreach ($sources as $source) {
            /** @var $subResult FetchResult */
            /** @var $subScheduledBatch bool */
            [$subResult, $subScheduledBatch] = $this->importBatch(new FetchQuery($source, null, $this->batchSize));

            $items = array_merge($items, $subResult->items);
            $errors = array_merge($errors, $subResult->errors);
            $scheduledBatch = $scheduledBatch || $subScheduledBatch;
        }

        return [$items, $scheduledBatch, $errors];
    }

    public function importBatch(FetchQuery $query): array
    {
        // Mark the importer as running.
        update_option(static::RUNNING_MARKER, '1', false);
        // When execution ends, remove the marker
        register_shutdown_function(function () {
            delete_option(static::RUNNING_MARKER);
        });
        // If an error occurs, remove the marker
        $prevHandler = null;
        $prevHandler = set_error_handler(function () use (&$prevHandler) {
            delete_option(static::RUNNING_MARKER);
            if (is_callable($prevHandler)) {
                $prevHandler(...func_get_args());
            }
        });

        // Run the import
        try {
            // Allocate up to 30 minutes
            set_time_limit(30 * 60);

            $result = $this->engine->import($query);

            $interrupt = get_transient(static::INTERRUPT_TRANSIENT);
            $nextQuery = $query->forNextBatch($result);

            $scheduleBatch = empty($interrupt) && $nextQuery !== null;

            if ($scheduleBatch) {
                $job = new CronJob($this->batchCronHook, [$nextQuery]);
                CronJob::schedule($job, time() + $this->batchDelay);
            }
        } finally {
            // Remove the running marker
            delete_option(static::RUNNING_MARKER);

            // Remove the interrupt transient to allow future imports
            delete_transient(static::INTERRUPT_TRANSIENT);

            // Restore the previous error handler
            if (is_callable($prevHandler)) {
                set_error_handler($prevHandler);
            }
        }

        return [$result, $scheduleBatch];
    }
}
