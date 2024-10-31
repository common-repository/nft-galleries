<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Modules;

use Dhii\Services\Factories\Alias;
use Dhii\Services\Factories\Constructor;
use Dhii\Services\Factories\ServiceList;
use Dhii\Services\Factories\Value;
use Psr\Container\ContainerInterface;
use RebelCode\Iris\Aggregator;
use RebelCode\Iris\Converter;
use RebelCode\Iris\Engine;
use RebelCode\Iris\Fetcher;
use RebelCode\Spotlight\Nft\Engine\Aggregator\IgAggregationStrategy;
use RebelCode\Spotlight\Nft\Engine\Aggregator\SortProcessor;
use RebelCode\Spotlight\Nft\Engine\Converter\TokenConversionStrategy;
use RebelCode\Spotlight\Nft\Engine\Fetcher\SingleCatalogFetchStrategy;
use RebelCode\Spotlight\Nft\Engine\ImageStore;
use RebelCode\Spotlight\Nft\Engine\TokenStore;
use RebelCode\Spotlight\Nft\Module;
use RebelCode\Spotlight\Nft\Engine\Aggregator\ModerationFilterProcessor;

class EngineModule extends Module
{
    public function run(ContainerInterface $c)
    {
    }

    public function getFactories(): array
    {
        return [
            //==========================================================================
            // ENGINE
            //==========================================================================

            'instance' => new Constructor(Engine::class, [
                'fetcher',
                'converter',
                'aggregator',
                'store',
            ]),

            //==========================================================================
            // STORE
            //==========================================================================

            'store' => new Constructor(TokenStore::class, [
                '@tokens/table',
                'store/images',
            ]),

            'store/images' => new Constructor(ImageStore::class, ['store/images/dir']),
            // The path were the images are cached, relative to the WordPress "uploads" directory
            'store/images/dir' => new Value('sl-nfts'),

            //==========================================================================
            // FETCHER
            //==========================================================================

            'fetcher' => new Constructor(Fetcher::class, [
                'fetcher/strategy',
            ]),

            'fetcher/strategy' => new Constructor(SingleCatalogFetchStrategy::class, [
                'fetcher/catalog',
            ]),

            'fetcher/catalog' => new Alias('opensea/catalog'),

            //==========================================================================
            // CONVERTER
            //==========================================================================

            'converter' => new Constructor(Converter::class, [
                'store',
                'converter/strategy',
            ]),

            'converter/strategy' => new Constructor(TokenConversionStrategy::class),

            //==========================================================================
            // AGGREGATOR
            //==========================================================================

            'aggregator' => new Constructor(Aggregator::class, [
                'store',
                'aggregator/strategy',
            ]),

            'aggregator/strategy' => new Constructor(IgAggregationStrategy::class, [
                'aggregator/pre_processors',
                'aggregator/post_processors',
            ]),

            'aggregator/pre_processors' => new ServiceList([
                'aggregator/processors/sorter',
            ]),

            'aggregator/post_processors' => new ServiceList([
                'aggregator/processors/moderation',
            ]),

            'aggregator/processors/sorter' => new Constructor(SortProcessor::class),
            'aggregator/processors/moderation' => new Constructor(ModerationFilterProcessor::class),
        ];
    }
}
