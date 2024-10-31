<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft;

use Exception;
use RebelCode\Iris\Data\Feed;
use RebelCode\Iris\Data\Item;
use RebelCode\Iris\Data\Source;
use RebelCode\Iris\Engine;
use RebelCode\Spotlight\Nft\Engine\Importer;
use RebelCode\Spotlight\Nft\Feeds\FeedManager;
use RebelCode\Spotlight\Nft\Utils\Arrays;

class Server
{
    /** @var Engine */
    protected $engine;

    /** @var Importer */
    protected $importer;

    /** @var FeedManager */
    protected $feedManager;

    /** Constructor. */
    public function __construct(Engine $engine, Importer $importer, FeedManager $feedManager)
    {
        $this->engine = $engine;
        $this->importer = $importer;
        $this->feedManager = $feedManager;
    }

    public function getFeedTokens(array $options = [], ?int $from = 0, int $num = null): array
    {
        // If the num arg is not given but the options have a num, use the num from the options
        if ($num === null && array_key_exists('numPosts', $options)) {
            if (is_array($options['numPosts'])) {
                $num = $options['numPosts']['desktop'] ?? 0;
            } else {
                $num = $options['numPosts'];
            }
        }

        // If the num is zero, show all tokens
        $num = ($num ?? 0) <= 0 ? null : $num;

        // Get media and total
        $feed = $this->feedManager->createFeed(0, $options);
        $mainResult = $this->engine->getAggregator()->aggregate($feed, $num, $from);
        $needImport = (count($mainResult->items) === 0);

        if (!$needImport) {
            // Check each feed source whether an import is required
            foreach ($feed->sources as $source) {
                try {
                    $sourceItems = $this->engine->getStore()->getForSources([$source], 1);
                    $needImport = $needImport || count($sourceItems) === 0;
                } catch (Exception $e) {
                    // Fail silently
                    continue;
                }
            }
        }

        $tokens = Arrays::map($mainResult->items, [$this, 'transform']);

        return [
            'tokens' => $tokens,
            'total' => $mainResult->total,
            'needImport' => $needImport,
            'errors' => [],
        ];
    }

    public function getSourceTokens(Source $source, ?int $from, int $num = null): array
    {
        $feed = new Feed(null, [$source], [
            'postOrder' => 'date_desc',
            'mediaType' => 'all',
        ]);

        $result = $this->engine->getAggregator()->aggregate($feed, $num, $from);
        $tokens = Arrays::map($result->items, [$this, 'transform']);

        return [
            'tokens' => $tokens,
            'total' => $result->total,
            'errors' => [],
        ];
    }

    public function import(array $options): array
    {
        $feed = $this->feedManager->createFeed(0, $options);

        [$items, $hasMoreBatches, $errors] = $this->importer->updateSources($feed->sources);

        return [
            'success' => true,
            'items' => $items,
            'batching' => $hasMoreBatches,
            'errors' => $errors,
        ];
    }

    public function transform(Item $item): array
    {
        return apply_filters('snft/server/transform_item', array_merge($item->data, [
            'id' => $item->id,
        ]));
    }
}
