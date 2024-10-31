<?php

namespace RebelCode\Spotlight\Nft\Actions;

use RebelCode\Spotlight\Nft\Database\Table;
use RebelCode\Spotlight\Nft\Engine\Data\WalletSource;
use RebelCode\Spotlight\Nft\Engine\Importer;
use RebelCode\Spotlight\Nft\Utils\Arrays;

class UpdateTokensAction
{
    /** @var Importer */
    protected $importer;

    /** @var Table */
    protected $table;

    /** Constructor */
    public function __construct(Importer $importer, Table $table)
    {
        $this->importer = $importer;
        $this->table = $table;
    }

    public function __invoke()
    {
        $results = $this->table->query();

        $sources = Arrays::mapNonNull($results, function (array $result) {
            $address = trim($result['address'] ?? '');

            return empty($address) ? null : WalletSource::create($address);
        });

        $this->importer->updateSources($sources);
    }
}
