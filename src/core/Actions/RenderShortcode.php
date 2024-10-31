<?php

namespace RebelCode\Spotlight\Nft\Actions;

use Dhii\Output\TemplateInterface;
use RebelCode\Spotlight\Nft\Config\ConfigSet;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\Database\Tables\WalletsTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\Feeds\FeedTemplate;
use RebelCode\Spotlight\Nft\Server;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use RebelCode\Spotlight\Nft\Utils\Strings;

/** The action that renders the content for the shortcode. */
class RenderShortcode
{
    const ARG_GALLERY = 'gallery';
    const ARG_WALLETS = 'wallets';

    /** @var Table */
    protected $feedsTable;

    /** @var Table */
    protected $walletsTable;

    /** @var TemplateInterface */
    protected $template;

    /** @var  Server */
    protected $server;

    /** @var  ConfigSet */
    protected $config;

    /** Constructor */
    public function __construct(
        Table $feedsTable,
        Table $walletsTable,
        TemplateInterface $template,
        Server $server,
        ConfigSet $config
    ) {
        $this->feedsTable = $feedsTable;
        $this->walletsTable = $walletsTable;
        $this->template = $template;
        $this->server = $server;
        $this->config = $config;
    }

    /**
     * Renders the content for the shortcode.
     *
     * @param mixed $args The render arguments.
     *
     * @return string The rendered content.
     */
    public function __invoke($args): string
    {
        $args = empty($args) || !is_array($args) ? [] : $args;

        $options = Arrays::mapPairs($args, function ($key, $value) {
            return [Strings::kebabToCamel($key), $value];
        });

        // If the "gallery" arg is given, get the gallery for that ID and merge its options with the other args
        if (array_key_exists(static::ARG_GALLERY, $options)) {
            $id = $options[static::ARG_GALLERY];
            $record = $this->feedsTable->get($id);

            if ($record === null) {
                return is_user_logged_in()
                    ? "<p>The selected NFT Gallery does not exist (ID {$id})<br/><small>(This message is only visible when logged in)</small></p>"
                    : '';
            }

            unset($options[static::ARG_GALLERY]);
            $jsonFeedOptions = $record[FeedsTable::COL_OPTIONS];
            $feedOptions = json_decode($jsonFeedOptions, true);
            $options = array_merge($feedOptions, $options);
        }

        $addresses = array_unique($options[static::ARG_WALLETS] ?? []);
        $wallets = !empty($addresses)
            ? $this->walletsTable->query(Where::col(WalletsTable::COL_ADDRESS)->isIn($addresses))
            : [];

        return $this->template->render([
            FeedTemplate::ARG_GALLERY => $options,
            FeedTemplate::ARG_WALLETS => $wallets,
            FeedTemplate::ARG_TOKENS => $this->server->getFeedTokens($options),
        ]);
    }
}
