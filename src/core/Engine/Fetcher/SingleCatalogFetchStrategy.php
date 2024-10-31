<?php

namespace RebelCode\Spotlight\Nft\Engine\Fetcher;

use RebelCode\Iris\Data\Source;
use RebelCode\Iris\Fetcher\Catalog;
use RebelCode\Iris\Fetcher\FetchStrategy;

class SingleCatalogFetchStrategy implements FetchStrategy
{
    /** @var Catalog */
    protected $catalog;

    /** Constructor */
    public function __construct(Catalog $catalog)
    {
        $this->catalog = $catalog;
    }

    /** @inheritDoc */
    public function getCatalog(Source $source): ?Catalog
    {
        return $this->catalog;
    }
}
