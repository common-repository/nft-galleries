<?php

namespace RebelCode\Spotlight\Nft\Wp;

/**
 * Represents a page that is shown in the WordPress Admin.
 */
class AdminPage
{
    /** @var string */
    protected $title;

    /** @var callable */
    protected $renderFn;

    /**
     * Constructor.
     *
     * @param string   $title    The title of the page, shown in the browser's tab.
     * @param callable $renderFn The function that returns the rendered contents of the page
     */
    public function __construct(string $title, callable $renderFn)
    {
        $this->title = $title;
        $this->renderFn = $renderFn;
    }

    /**
     * Retrieves the title for the page.
     *
     * @return string
     */
    public function getTitle() : string
    {
        return $this->title;
    }

    /**
     * Retrieves the render function for the page.
     *
     * @return callable
     */
    public function getRenderFn() : callable
    {
        $returnFn = $this->renderFn;

        // The first argument is passed by WordPress and is unused
        return function ($unused, ...$args) use ($returnFn) {
            echo call_user_func_array($returnFn, $args);
        };
    }
}
