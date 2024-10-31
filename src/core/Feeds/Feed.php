<?php

namespace RebelCode\Spotlight\Nft\Feeds;

use RebelCode\Spotlight\Nft\Utils\Arrays;
use wpdb;

/**
 * Represents a feed saved in the database.
 */
class Feed
{
    /** @var int|null */
    protected $id;

    /** @var string */
    protected $name;

    /** @var array */
    protected $options;

    /**
     * Constructor.
     *
     * @param int|null $id The ID of the feed in the database.
     * @param string $name The user-given name for the feed.
     * @param array $options The options for the feed, which control rendering.
     */
    public function __construct(?int $id, string $name = '', array $options = [])
    {
        $this->id = $id;
        $this->name = $name;
        $this->options = $options;
    }

    /**
     * Retrieves the ID of the feed.
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Retrieves the name of the feed.
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Retrieves the options for this feed.
     *
     * @return array
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * Retrieves a single option, optionally defaulting to a specific value.
     *
     * @param string $key The key of the option to retrieve.
     * @param mixed $default Optional value to return if no option is found for the given $key.
     *
     * @return mixed|null The value for the option that corresponds to the given $key, or $default if not found.
     */
    public function getOption(string $key, $default = null)
    {
        return array_key_exists($key, $this->options)
            ? $this->options[$key]
            : $default;
    }

    /**
     * Creates a feed instance from an array.
     *
     * @param array $data The array from which to create the feed.
     *
     * @return Feed The created feed instance.
     */
    public static function fromArray(array $data): Feed
    {
        $id = $data['id'] ?? null;
        $name = $data['name'] ?? '';
        $options = $data['options'] ?? [];

        return new Feed($id, $name, $options);
    }

    /**
     * Finds usages of the shortcode for a specific feed.
     *
     * @param Feed $feed The feed instance.
     * @param wpdb $wpdb The WordPress database driver.
     *
     * @return array A list of associative sub-arrays, each containing information about posts whose contents include
     *               an occurrence of the shortcode with the given feed's ID. Each sub-array will have the below keys:
     *               'id' => The ID of the post
     *               'name' => The title of the post
     *               'type' => The post type
     *               'link' => The URL to the post's edit page
     */
    public static function getShortcodeUsages(Feed $feed, wpdb $wpdb): array
    {
        $query = sprintf(
        /** @lang text */
            "SELECT ID, post_title, post_type
                    FROM %s
                    WHERE post_type != 'revision' AND
                          post_status != 'trash' AND
                          post_content REGEXP '\\\\[nft-gallery[[:blank:]]+gallery=[\\'\"]%s[\\'\"]'",
            $wpdb->prefix . 'posts',
            $feed->getId()
        );

        $results = $wpdb->get_results($query);

        return Arrays::map($results, function ($row) {
            return [
                'id' => $row->ID,
                'name' => $row->post_title,
                'type' => get_post_type_object($row->post_type)->labels->singular_name,
                'link' => get_permalink($row->ID),
            ];
        });
    }

    /**
     * Finds usages of the WordPress block for a specific feed.
     *
     * @param Feed $feed The feed instance.
     * @param wpdb $wpdb The WordPress database driver.
     *
     * @return array A list of associative sub-arrays, each containing information about posts whose contents include
     *               an occurrence of the wp block with the given feed's ID. Each sub-array will have the below keys:
     *               'id' => The ID of the post
     *               'name' => The title of the post
     *               'type' => The post type
     *               'link' => The URL to the post's edit page
     */
    public static function getWpBlockUsages(Feed $feed, wpdb $wpdb): array
    {
        $query = sprintf(
        /** @lang text */
            "SELECT ID, post_title, post_type
                    FROM %s
                    WHERE post_type != 'revision' AND
                          post_status != 'trash' AND
                          post_content REGEXP '<!-- wp:spotlight/nft \\\\{\"galleryId\":\"?%s\"?'",
            $wpdb->prefix . 'posts',
            $feed->getId()
        );

        $results = $wpdb->get_results($query);

        return Arrays::map($results, function ($row) {
            return [
                'id' => $row->ID,
                'name' => $row->post_title,
                'type' => get_post_type_object($row->post_type)->labels->singular_name,
                'link' => get_permalink($row->ID),
            ];
        });
    }

    /**
     * Finds usages of the Spotlight Elementor widget for a specific feed.
     *
     * @param Feed $feed The feed instance.
     * @param wpdb $wpdb The WordPress database driver.
     *
     * @return array A list of associative sub-arrays, each containing information about posts whose Elementor page data
     *               includes a Spotlight widget that uses the given feed. Each sub-array will have the below keys:
     *               'id' => The ID of the post
     *               'name' => The title of the post
     *               'type' => The post type
     *               'link' => The URL to the post's edit page
     */
    public static function getElementorWidgetUsages(Feed $feed, wpdb $wpdb): array
    {
        $query = sprintf(
        /** @lang text */
            "SELECT ID, post_title, post_type
             FROM %s as post
             JOIN %s as meta on post.ID = meta.post_id
             WHERE post.post_type != 'revision' AND
                   post.post_status != 'trash' AND
                   meta.meta_key = '_elementor_data' AND
                   meta.meta_value LIKE '%%\"widgetType\":\"snft-feed\"%%' AND
                   meta.meta_value LIKE '%%\"feed\":\"%d\"%%'",
            $wpdb->posts,
            $wpdb->postmeta,
            $feed->getId()
        );

        $results = $wpdb->get_results($query);

        return Arrays::map($results, function ($row) {
            return [
                'id' => $row->ID,
                'name' => $row->post_title,
                'type' => __('Elementor widget', 'sl-insta'),
                'link' => get_permalink($row->ID),
            ];
        });
    }
}
