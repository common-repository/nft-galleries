<?php

namespace RebelCode\Spotlight\Nft\Feeds;

use Dhii\Output\TemplateInterface;
use RebelCode\Spotlight\Nft\Hooks;

/** The template that renders a feed. */
class FeedTemplate implements TemplateInterface
{
    const ARG_GALLERY = 'gallery';
    const ARG_WALLETS = 'wallet';
    const ARG_TOKENS = 'tokens';

    /** @inheritDoc */
    public function render($ctx = null)
    {
        if (!is_array($ctx)) {
            return '';
        }

        $varName = hash("crc32b", SNFT_VERSION . json_encode($ctx));

        return static::renderFeed($varName, $ctx);
    }

    /**
     * Renders a feed.
     *
     * @param string $var The name of the property in the localized JS object variable.
     * @param array  $ctx The render context.
     *
     * @return string The rendered feed.
     */
    public static function renderFeed(string $var, array $ctx): string
    {
        $feedOptions = $ctx[static::ARG_GALLERY] ?? [];
        $wallets = $ctx[static::ARG_WALLETS] ?? [];
        $tokens = $ctx[static::ARG_TOKENS] ?? [];

        // Convert into JSON, which is also valid JS syntax
        $feedJson = json_encode($feedOptions);
        $walletsJson = json_encode($wallets);
        $tokenJson = json_encode($tokens);

        // Prepare the HTML class
        $className = 'nft-gallery';
        if (array_key_exists('className', $feedOptions) && !empty($feedOptions['className'])) {
            $className .= ' ' . $feedOptions['className'];
        }

        // Output the required HTML and JS
        ob_start();
        ?>
        <div class="<?php echo esc_attr($className) ?>" data-gallery-var="<?php echo esc_attr($var) ?>"></div>
        <input type="hidden" id="snft__f__<?php echo esc_attr($var) ?>" data-json='<?php echo esc_attr($feedJson) ?>' />
        <input type="hidden" id="snft__w__<?php echo esc_attr($var) ?>" data-json='<?php echo esc_attr($walletsJson) ?>' />
        <input type="hidden" id="snft__t__<?php echo esc_attr($var) ?>" data-json='<?php echo esc_attr($tokenJson) ?>' />
        <?php

        // Trigger the action that will enqueue the required JS bundles
        do_action(Hooks::UI_ENQ_FRONT_APP);

        return ob_get_clean();
    }
}
