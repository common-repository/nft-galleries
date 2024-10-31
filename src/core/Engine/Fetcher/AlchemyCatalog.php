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
use RebelCode\Spotlight\Nft\Engine\Data\TokenItem;
use RebelCode\Spotlight\Nft\Engine\Data\WalletSource;
use RuntimeException;
use stdClass;
use Throwable;

class AlchemyCatalog implements Catalog
{
    /** @var ClientInterface */
    protected $client;

    /** @var string */
    protected $apiKey;

    /** Constructor.*/
    public function __construct(ClientInterface $client, string $apiKey)
    {
        $this->client = $client;
        $this->apiKey = $apiKey;
    }

    /** @inerhitDoc */
    public function query(Source $source, ?string $cursor = null, ?int $count = null): FetchResult
    {
        if (!WalletSource::validateAddress($source->id)) {
            throw new InvalidSourceException('Invalid wallet address', $source);
        }

        $owner = strtolower($source->id);
        $url = "https://eth-mainnet.alchemyapi.io/v2/$this->apiKey/getNFTs/?owner=$owner";

        try {
            $response = $this->sendQuery($url);
            $items = static::createItems($response, $source);

            $pageKey = $response->pageKey ?? null;
            $totalCount = $response->totalCount;

            return new FetchResult($items, $source, $totalCount, $pageKey, null, []);
        } catch (Throwable $t) {
            return new FetchResult([], $source, null, null, null, [$t->getMessage()]);
        }
    }

    /**
     * @throws ClientExceptionInterface
     * @throws RuntimeException
     */
    public function sendQuery(string $url): stdClass
    {
        $request = new Request('GET', $url);
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
        if (empty($response->ownedNfts) || !is_array($response->ownedNfts)) {
            return [];
        }

        $items = [];
        foreach ($response->ownedNfts as $nftData) {
            if (!empty($nftData->error) || empty($nftData->metadata) || is_string($nftData->metadata)) {
                continue;
            }

            $collection = $nftData->contract->address;
            $num = hexdec($nftData->id->tokenId);

            $id = "$collection/$num";
            $media = $nftData->media[0] ?? new stdClass();
            $imageUrl = $media->gateway ?? '';

            $items[] = new Item($id, null, [$source], [
                TokenItem::COLLECTION => $collection,
                TokenItem::NUMBER => $num,
                TokenItem::NAME => $nftData->title,
                TokenItem::DESC => $nftData->description ?? '',
                TokenItem::IMG_URL => $imageUrl,
                TokenItem::TRAITS => TokenItem::parseTraits($nftData->metadata->attributes ?? []),
            ]);
        }

        return $items;
    }
}
