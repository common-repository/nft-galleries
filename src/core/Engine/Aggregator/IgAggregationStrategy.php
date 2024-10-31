<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Engine\Aggregator;

use RebelCode\Iris\Aggregator\AggregationStrategy;
use RebelCode\Iris\Aggregator\ItemProcessor;
use RebelCode\Iris\Data\Feed;
use RebelCode\Iris\Store\Query;

class IgAggregationStrategy implements AggregationStrategy
{
    /** @var ItemProcessor[] */
    protected $preProcessors;

    /** @var ItemProcessor[] */
    protected $postProcessors;

    /**
     * Constructor.
     *
     * @param ItemProcessor[] $preProcessors
     * @param ItemProcessor[] $postProcessors
     */
    public function __construct(array $preProcessors = [], array $postProcessors = [])
    {
        $this->preProcessors = $preProcessors;
        $this->postProcessors = $postProcessors;
    }

    public function doManualPagination(Feed $feed, Query $query): bool
    {
        return true;
    }

    public function getFeedQuery(Feed $feed, ?int $count = null, int $offset = 0): ?Query
    {
        if ($count === null) {
            $numPosts = $feed->get('numPosts');

            if (is_array($numPosts)) {
                $desktop = intval($numPosts['desktop'] ?? 9);
                $tablet = intval($numPosts['tablet'] ?? 0);
                $phone = intval($numPosts['phone'] ?? 0);

                $count = (int) max($desktop, $tablet, $phone);
            } else {
                $count = (int) $numPosts;
            }
        }

        $count = $count <= 0 ? null : $count;

        return new Query($feed->sources, null, null, $count, $offset);
    }

    public function getPreProcessors(Feed $feed, Query $query): array
    {
        return $this->preProcessors;
    }

    public function getPostProcessors(Feed $feed, Query $query): array
    {
        return $this->postProcessors;
    }
}
