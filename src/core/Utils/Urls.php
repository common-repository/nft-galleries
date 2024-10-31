<?php

namespace RebelCode\Spotlight\Nft\Utils;

class Urls
{
    public static function resolveIpfs(string $url): string
    {
        if (stripos($url, 'ipfs://') === 0) {
            $path = substr($url, 7);
            return "https://gateway.ipfs.io/ipfs/$path";
        } else {
            return $url;
        }
    }

    public static function makeHttps(string $url): string
    {
        return str_replace('http://', 'https://', $url);
    }

    public static function makeHttp(string $url): string
    {
        return str_replace('https://', 'http://', $url);
    }

    public static function matchSiteProtocol(string $url): string
    {
        return is_ssl() ? static::makeHttps($url) : static::makeHttp($url);
    }

    public static function getContentType(string $url): ?string
    {
        $headers = @get_headers($url, true);
        $headers = $headers ? : [];

        return $headers['Content-type'] ?? $headers['Content-Type'] ?? $headers['content-type'] ?? null;
    }
}
