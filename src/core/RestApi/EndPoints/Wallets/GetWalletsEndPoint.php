<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Wallets;

use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\WalletsTable;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * The handler for the endpoint that provides account information.
 */
class GetWalletsEndPoint extends AbstractEndpointHandler
{
    /** @var Table */
    protected $table;

    /** Constructor */
    public function __construct(Table $table)
    {
        $this->table = $table;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        $id = filter_var($request['id'], FILTER_SANITIZE_STRING);

        if (empty($id)) {
            $data = array_map([$this, 'transformAccount'], $this->table->query());

            return new WP_REST_Response($data);
        }

        $result = $this->table->query("`id` = $id");
        $account = array_shift($result);

        if ($account === null) {
            return new WP_Error('not_found', "Account \"${id}\" was not found", ['status' => 404]);
        }

        return new WP_REST_Response($this->transformAccount($account));
    }

    protected function transformAccount(array $data): array
    {
        return [
            'name' => $data[WalletsTable::COL_NAME] ?? __('(no name)', 'snft'),
            'address' => $data[WalletsTable::COL_ADDRESS] ?? '',
        ];
    }
}
