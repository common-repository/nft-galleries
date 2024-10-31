<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Feeds;

use Dhii\Transformer\TransformerInterface;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use RebelCode\Spotlight\Nft\Wp\RestRequest;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/** The handler for the REST API endpoint that deletes feeds. */
class DeleteFeedsEndpoint extends AbstractEndpointHandler
{
    /** @var Table */
    protected $table;

    /** @var TransformerInterface */
    protected $transformer;

    /** Constructor */
    public function __construct(Table $table, TransformerInterface $transformer)
    {
        $this->table = $table;
        $this->transformer = $transformer;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        if (!RestRequest::has_param($request, 'id')) {
            return new WP_Error('snft_missing_id', 'Missing feed ID in request');
        }

        $id = $request->get_param('id');
        $numDeleted = $this->table->delete(Where::col(FeedsTable::COL_ID)->isEqualTo($id));

        if ($numDeleted === 0) {
            return new WP_Error('snft_delete_error', 'Could not delete gallery from the database');
        }

        $feeds = $this->table->query();
        $response = array_map([$this->transformer, 'transform'], $feeds);

        return new WP_REST_Response($response);
    }
}
