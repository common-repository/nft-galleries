<?php

namespace RebelCode\Spotlight\Nft\Engine\Data;

use RebelCode\Spotlight\Nft\Utils\Arrays;

use RebelCode\Spotlight\Nft\Utils\Urls;

use function stripos;
use function wp_remote_get;
use function wp_remote_retrieve_body;

class TokenItem
{
    const PERMALINK = 'permalink';
    const COLLECTION = 'collection';
    const COLLECTION_NAME = 'collectionName';
    const NUMBER = 'number';
    const META_URL = 'metaUrl';
    const NAME = 'name';
    const DESC = 'description';
    const TRAITS = 'traits';
    const IMG_URL = 'imageUrl';
    const OG_IMG_URL = 'ogImageUrl';
    const TYPE = 'type';

    /** Fetches the metadata for an item. */
    public static function fetchMetaData(string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        $response = wp_remote_get($url);
        if (is_wp_error($response)) {
            return null;
        }

        return wp_remote_retrieve_body($response);
    }

    public static function parseMetaData(?string $json): ?array
    {
        if (empty($json)) {
            return null;
        }

        $info = @json_decode($json);
        if (!is_object($info)) {
            return null;
        }

        return [
            static::NAME => $info->name ?? '',
            static::DESC => $info->description ?? '',
            static::TRAITS => static::parseTraits($info->attributes ?? []),
            static::IMG_URL => Urls::resolveIpfs($info->image ?? ''),
        ];
    }

    public static function parseTraits(array $attributes): array
    {
        return Arrays::map($attributes, function ($data) {
            return [
                TokenTrait::TYPE => $data->trait_type,
                TokenTrait::VALUE => $data->value,
            ];
        });
    }
}
