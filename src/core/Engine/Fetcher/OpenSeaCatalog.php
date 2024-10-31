<?php

namespace RebelCode\Spotlight\Nft\Engine\Fetcher;

use Psr\Http\Client\ClientExceptionInterface;
use Psr\Http\Client\ClientInterface;
use RebelCode\Iris\Data\Item;
use RebelCode\Iris\Data\Source;
use RebelCode\Iris\Exception\InvalidSourceException;
use RebelCode\Iris\Fetcher\Catalog;
use RebelCode\Iris\Fetcher\FetchResult;
use RebelCode\Psr7\Request;
use RebelCode\Psr7\Uri;
use RebelCode\Spotlight\Nft\Engine\Data\TokenItem;
use RebelCode\Spotlight\Nft\Engine\Data\TokenTrait;
use RebelCode\Spotlight\Nft\Engine\Data\WalletSource;
use RebelCode\Spotlight\Nft\Utils\Arrays;
use RuntimeException;
use stdClass;
use Throwable;

class OpenSeaCatalog implements Catalog
{
    const API_KEY = '674bad3dfef94e8a9d9840c9f85ed236';

    /** @var ClientInterface */
    protected $client;

    /** Constructor.*/
    public function __construct(ClientInterface $client)
    {
        $this->client = $client;
    }

    public function query(Source $source, ?string $cursor = null, ?int $count = null): FetchResult
    {
        if (!WalletSource::validateAddress($source->id)) {
            throw new InvalidSourceException('Invalid wallet address', $source);
        }

        $owner = strtolower($source->id);

        try {
            $response = $this->sendQuery($owner, $count, $cursor);
            $items = static::createItems($response, $source);
            $nextCursor = $response->next;
            $prevCursor = $response->previous;

            return new FetchResult($items, $source, null, $nextCursor, $prevCursor, []);
        } catch (Throwable $t) {
            return new FetchResult([], $source, null, null, null, [$t->getMessage()]);
        }
    }

    /**
     * @throws ClientExceptionInterface
     * @throws RuntimeException
     */
    public function sendQuery(string $owner, ?int $count, ?string $cursor): stdClass
    {
        $url = new Uri('https://api.opensea.io/api/v1/assets?owner=' . $owner);
        if ($count !== null) {
            $url = Uri::withQueryValue($url, 'limit', $count);
        }
        if ($cursor !== null) {
            $url = Uri::withQueryValue($url, 'cursor', $cursor);
        }

        $request = new Request('GET', $url, [
            'X-API-KEY' => static::API_KEY,
        ]);

        $response = $this->client->sendRequest($request);

        $body = $response->getBody()->getContents();
        if ($response->getStatusCode() !== 200) {
            throw new RuntimeException('Erroneous response code for response: ' . $body);
        }

        $data = @json_decode($body);
        if (!is_object($data)) {
            throw new RuntimeException('Malformed JSON response body: ' . $body);
        }

        return $data;
    }

    /** @return Item[] */
    protected static function createItems(stdClass $response, Source $source): array
    {
        if (empty($response->assets) || !is_array($response->assets)) {
            return [];
        }

        $items = [];
        foreach ($response->assets as $asset) {
            if (!empty($asset->error) || empty($asset->name)) {
                continue;
            }

            preg_match('/\/([0-9]+)$/', $asset->permalink, $matches);
            $num = $matches[1] ?? 0;

            $items[] = new Item($asset->id, null, [$source], [
                TokenItem::PERMALINK => $asset->permalink,
                TokenItem::COLLECTION => $asset->asset_contract->address,
                TokenItem::COLLECTION_NAME => $asset->collection->name,
                TokenItem::NUMBER => $num,
                TokenItem::NAME => $asset->name,
                TokenItem::DESC => $asset->description ?? '',
                TokenItem::IMG_URL => $asset->image_url,
                TokenItem::OG_IMG_URL => $asset->image_url,
                TokenItem::TRAITS => Arrays::map($asset->traits, function($trait) {
                    return [
                        TokenTrait::TYPE => $trait->trait_type,
                        TokenTrait::VALUE => $trait->value,
                    ];
                }),
            ]);
        }

        return $items;
    }
}
