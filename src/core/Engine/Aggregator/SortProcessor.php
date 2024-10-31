<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Engine\Aggregator;

use RebelCode\Iris\Aggregator\ItemProcessor;
use RebelCode\Iris\Data\Feed;
use RebelCode\Iris\Data\Item;
use RebelCode\Iris\Store\Query;
use RebelCode\Spotlight\Nft\Engine\Data\TokenItem;

class SortProcessor implements ItemProcessor
{
    public function process(array &$items, Feed $feed, Query $query): void
    {
        usort($items, function (Item $a, Item $b) {
            $t1 = $a->get(TokenItem::NAME);
            $t2 = $b->get(TokenItem::NAME);

            return strcasecmp($t1, $t2);
        });
    }
}
