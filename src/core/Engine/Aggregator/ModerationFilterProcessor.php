<?php

namespace RebelCode\Spotlight\Nft\Engine\Aggregator;

use RebelCode\Iris\Aggregator\ItemProcessor;
use RebelCode\Iris\Data\Feed;
use RebelCode\Iris\Data\Item;
use RebelCode\Iris\Store\Query;

/**
 * Filters media according to a feed's moderation options.
 */
class ModerationFilterProcessor implements ItemProcessor
{
    /** @inheritDoc */
    public function process(array &$items, Feed $feed, Query $query): void
    {
        // Flip the array so that token IDs are array keys, enabling fast look up of IDs
        $moderation = array_flip($feed->get('moderation', []));

        // Do nothing if moderation is empty
        if (empty($moderation)) {
            return;
        }

        $isBlacklist = $feed->get('moderationMode', 'blacklist') === "blacklist";

        $items = array_filter($items, function (Item $item) use ($feed, $moderation, $isBlacklist) {
            return (
                // Allow token if mode is blacklist and the token is not in the moderation list
                ($isBlacklist && array_key_exists($item->id, $moderation) === false) ||
                // Allow token if mode is whitelist and the token is in the moderation list
                (!$isBlacklist && array_key_exists($item->id, $moderation) !== false)
            );
        });
    }
}
