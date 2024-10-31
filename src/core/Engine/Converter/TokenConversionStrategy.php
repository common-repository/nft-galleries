<?php

namespace RebelCode\Spotlight\Nft\Engine\Converter;

use Psr\SimpleCache\CacheInterface;
use RebelCode\Iris\Converter\ConversionStrategy;
use RebelCode\Iris\Data\Item;
use RebelCode\Spotlight\Nft\Engine\Data\TokenItem;

class TokenConversionStrategy implements ConversionStrategy
{
    const HAS_CACHE = 'has_cache';

    /** @var CacheInterface|null */
    protected $metaCache;

    /** Constructor */
    public function __construct(?CacheInterface $metaCache = null)
    {
        $this->metaCache = $metaCache;
    }

    public function convert(Item $item): ?Item
    {
        $item = $this->fixItemName($item);

        if ($item->get(TokenItem::META_URL) === null) {
            return $item;
        }

        $metaData = $this->getMetaData($item);

        // Discard items with no meta data
        if (empty($metaData)) {
            return null;
        }

        // Extract the collection and number from the ID and save them into the metadata
        [$collection, $number] = explode('/', $item->id);
        $metaData[TokenItem::COLLECTION] = $collection;
        $metaData[TokenItem::NUMBER] = hexdec($number);
        // Also keep the meta URL in the metadata itself
        $metaData[TokenItem::META_URL] = $item->data[TokenItem::META_URL];

        return $item->withChanges($metaData);
    }

    public function reconcile(Item $incoming, Item $existing): ?Item
    {
        return $incoming->withLocalId($existing->localId);
    }

    public function finalize(Item $item): ?Item
    {
        return $item;
    }

    protected function getMetaData(Item $item): ?array
    {
        $cachedMeta = $this->metaCache ? $this->metaCache->get($item->id) : null;
        $hasCache = ($cachedMeta !== null);

        // If metadata is not in cache, fetch metadata from the item's URL
        $metaJson = $hasCache
            ? $cachedMeta
            : TokenItem::fetchMetaData($item->get(TokenItem::META_URL, ''));

        // Parse the metadata
        $metaData = TokenItem::parseMetaData($metaJson);

        // Save the metadata to cache
        if ($metaData !== null) {
            if (!$hasCache) {
                $cacheValue = json_encode(json_decode($metaJson));

                if ($this->metaCache) {
                    $this->metaCache->set($item->id, $cacheValue);
                }
            }

            // Keep an indicator in the item's data itself whether the metadata came from cache
            $metaData[static::HAS_CACHE] = $hasCache;
        }

        return $metaData;
    }

    protected function fixItemName(Item $item): Item
    {
        $name = trim($item->get(TokenItem::NAME, ''));

        if (empty($name) || preg_match('/^#\d+$/', $name) === 1) {
            $number = $item->get(TokenItem::NUMBER, 0);
            $collName = $item->get(TokenItem::COLLECTION_NAME, '');

            $newName = ($number > 0)
                ? $collName . ' #' . $number
                : $collName;

            return $item->with(TokenItem::NAME, $newName);
        } else {
            return $item;
        }
    }
}
