<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Feeds;

use Dhii\Transformer\TransformerInterface;
use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\FeedsTable;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * The handler for the REST API endpoint that exposes feeds.
 */
class GetFeedsEndPoint extends AbstractEndpointHandler
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
        $id = filter_var($request['id'], FILTER_VALIDATE_INT);

        if (empty($id)) {
            $feeds = $this->table->query();

            usort($feeds, function ($a, $b) {
                return $a[FeedsTable::COL_ID] <=> $b[FeedsTable::COL_ID];
            });

            $response = Arrays::map($this->table->query(), [$this->transformer, 'transform']);

            return new WP_REST_Response($response);
        }

        $feed = $this->table->get($id);
        if ($feed === null) {
            return new WP_Error('not_found', "Gallery \"${id}\" does not exist", ['status' => 404]);
        }

        return new WP_REST_Response($this->transformer->transform($feed));
    }
}
