<?php

namespace RebelCode\Spotlight\Nft\RestApi\Transformers;

use Dhii\Transformer\TransformerInterface;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\Feeds\Feed;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use WP_Post;
use wpdb;

/**
 * Transforms {@link Feed} instances, or {@link WP_Post} instances that represents feeds, into REST API response format.
 */
class FeedTransformer implements TransformerInterface
{
    /** @var wpdb */
    protected $wpdb;

    /**
     * Constructor.
     *
     * @param wpdb $wpdb The WordPress database driver.
     */
    public function __construct(wpdb $wpdb)
    {
        $this->wpdb = $wpdb;
    }

    /** @inheritDoc */
    public function transform($feed)
    {
        if (is_array($feed)) {
            $feed = FeedsTable::recordToFeed($feed);
        }

        $shortcodeUsages = Feed::getShortcodeUsages($feed, $this->wpdb);
        $wpBlockUsages = Feed::getWpBlockUsages($feed, $this->wpdb);
        $elementorUsages = Feed::getElementorWidgetUsages($feed, $this->wpdb);

        // Shortcodes and blocks can exist in the same page
        $contentUsages = Arrays::mergeUnique($shortcodeUsages, $wpBlockUsages, function ($a, $b) {
            return $a['id'] === $b['id'];
        });
        // Elementor widgets are not part of post_content, so we don't need to merge only uniques
        $usages = array_merge($contentUsages, $elementorUsages);

        return [
            'id' => $feed->getId(),
            'name' => $feed->getName(),
            'usages' => $usages,
            'options' => $feed->getOptions(),
        ];
    }
}
