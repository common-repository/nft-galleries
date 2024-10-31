<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Wallets;

use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\WalletsTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use WP_REST_Request;
use WP_REST_Response;

class PostWalletEndPoint extends AbstractEndpointHandler
{
    /* @var Table */
    protected $table;

    /** Constructor */
    public function __construct(Table $table)
    {
        $this->table = $table;
    }

    protected function handle(WP_REST_Request $request)
    {
        $name = $request->get_param('name');
        $address = $request->get_param('address');

        $whereAddress = Where::col(WalletsTable::COL_ADDRESS)->isEqualTo($address);

        $existing = $this->table->query($whereAddress);

        if (count($existing) > 0) {
            $this->table->update($whereAddress, [
                WalletsTable::COL_NAME => $name,
            ]);
        } else {
            $this->table->insert([
                WalletsTable::COL_NAME => $name,
                WalletsTable::COL_ADDRESS => $address,
            ]);
        }

        return new WP_REST_Response(['success' => true]);
    }
}
