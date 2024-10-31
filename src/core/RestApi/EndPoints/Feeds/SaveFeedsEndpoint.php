<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Feeds;

use Dhii\Transformer\TransformerInterface;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\Feeds\Feed;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use RebelCode\Spotlight\Nft\Wp\RestRequest;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * The handler for the REST API endpoint that saves feeds.
 */
class SaveFeedsEndpoint extends AbstractEndpointHandler
{
    /** @var Table */
    protected $table;

    /** @var TransformerInterface */
    protected $transformer;

    /** Constructor */
    public function __construct(Table $tables, TransformerInterface $transformer)
    {
        $this->table = $tables;
        $this->transformer = $transformer;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        if (!RestRequest::has_param($request, 'feed')) {
            return new WP_Error('snft_missing_feed', 'Missing feed data in request');
        }

        $id = RestRequest::has_param($request, 'id')
            ? $request->get_param('id')
            : null;

        $feedData = $request->get_param('feed');

        // Remove usages
        unset($feedData['usages']);
        // Make sure the accounts and tagged do not contain duplicates
        $feedData['options'] = $feedData['options'] ?? [];
        $feedData['options']['wallets'] = array_unique($feedData['options']['wallets'] ?? []);

        $feed = Feed::fromArray($feedData);
        $record = FeedsTable::feedToRecord($feed);

        if ($id === null) {
            $id = $this->table->insert($record);
            $feed = new Feed($id, $feed->getName(), $feed->getOptions());
        } else {
            $numChanged = $this->table->update(Where::col(FeedsTable::COL_ID)->isEqualTo($id), $record);

            if ($numChanged === 0) {
                return new WP_Error(
                    'snft_feed_save_error',
                    'Failed to update gallery record in the database',
                    ['status' => 500]
                );
            }
        }

        return new WP_REST_Response(['feed' => $this->transformer->transform($feed)]);
    }
}
