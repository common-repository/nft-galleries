<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Feeds\Preview;

use RebelCode\Spotlight\Nft\SaaS\SaasResourceFetcher;
use Throwable;

class FeedPreviewProvider extends SaasResourceFetcher
{
    protected $preview = [];

    public function get(): array
    {
        if (empty($this->preview)) {
            try {
                $this->preview = parent::get();
            } catch (Throwable $t) {}
        }

        return $this->preview;
    }
}
