<?php

namespace RebelCode\Spotlight\Nft\Wp;

/**
 * Represents a top-level WordPress admin menu.
 */
class Menu
{
    /** @var string */
    protected $slug;

    /** @var string */
    protected $label;

    /** @var string */
    protected $capability;

    /** @var string */
    protected $icon;

    /** @var int|null */
    protected $position;

    /** @var AdminPage */
    protected $page;

    /** @var SubMenu[] */
    protected $items;

    /**
     * Constructor.
     *
     * @param AdminPage $page       The page that the menu refers to.
     * @param string    $slug       The slug name for the menu.
     * @param string    $label      The label to show in the WP admin menu bar.
     * @param string    $capability The user capability required to show the menu and access the page.
     * @param string    $icon       The icon to show near the menu's label in the WP admin menu bar.
     * @param int|null  $position   The position of the menu in the WP admin menu bar.
     * @param SubMenu[] $items      The submenu items for this menu.
     */
    public function __construct(
        AdminPage $page,
        string $slug,
        string $label,
        string $capability,
        string $icon = '',
        int $position = null,
        array $items = []
    ) {
        $this->page = $page;
        $this->slug = $slug;
        $this->label = $label;
        $this->capability = $capability;
        $this->icon = $icon;
        $this->position = $position;
        $this->items = $items;
    }

    /**
     * Registers a menu with WordPress.
     *
     * @param Menu $menu The menu instance to register.
     */
    public static function register(Menu $menu)
    {
        if (!current_user_can($menu->capability)) {
            return;
        }

        add_menu_page(
            $menu->page->getTitle(),
            $menu->label,
            $menu->capability,
            $menu->slug,
            $menu->page->getRenderFn(),
            $menu->icon,
            $menu->position
        );

        foreach ($menu->items as $item) {
            SubMenu::registerFor($menu->slug, $item);
        }
    }
}
