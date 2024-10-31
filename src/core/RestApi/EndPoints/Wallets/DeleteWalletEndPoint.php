<?php

namespace RebelCode\Spotlight\Nft\RestApi\EndPoints\Wallets;

use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Database\Tables\TokensTable;
use RebelCode\Spotlight\Nft\Database\Tables\WalletsTable;
use RebelCode\Spotlight\Nft\Database\Where;
use RebelCode\Spotlight\Nft\RestApi\EndPoints\AbstractEndpointHandler;
use RebelCode\Spotlight\Nft\Wp\RestRequest;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/** Endpoint handler for deleting wallets. */
class DeleteWalletEndPoint extends AbstractEndpointHandler
{
    /** @var Table */
    protected $walletsTable;

    /** @var Table */
    protected $tokensTable;

    /** Constructor. */
    public function __construct(Table $walletsTable, Table $tokensTable)
    {
        $this->walletsTable = $walletsTable;
        $this->tokensTable = $tokensTable;
    }

    /** @inheritDoc */
    protected function handle(WP_REST_Request $request)
    {
        if (!RestRequest::has_param($request, 'address')) {
            return new WP_Error('snft_missing_address', 'Missing wallet address in request');
        }

        $address = $request->get_param('address');

        $result = $this->walletsTable->delete(
            Where::col(WalletsTable::COL_ADDRESS)->isEqualTo($address)
        );

        if (!$result) {
            return new WP_Error('snft_wallet_delete_failed', 'Failed to delete the wallet', [
                'status' => 500,
            ]);
        }

        $this->tokensTable->delete(
            Where::col(TokensTable::COL_WALLET)->isEqualTo($address)
        );

        return new WP_REST_Response($this->walletsTable->query());
    }
}
