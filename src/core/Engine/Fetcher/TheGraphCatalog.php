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
use RebelCode\Spotlight\Nft\GraphQL\GraphQuery;
use RuntimeException;
use stdClass;
use Throwable;

/**
 * A catalog that uses a subgraph from thegraph.com to fetch ERC721 tokens.
 */
class TheGraphCatalog implements Catalog
{
    protected const QUERY_ENTITY = 'erc721Tokens';

    protected const QUERY_FIELDS = [
        'id',
        'identifier',
        'uri',
        'owner' => ['id'],
    ];

    protected const QUERY_HEADERS = [
        'Content-type' => 'application/json',
    ];

    /** @var ClientInterface */
    protected $client;

    /** @var string */
    protected $url;

    /** Constructor */
    public function __construct(ClientInterface $client, string $subGraphId, string $apiKey)
    {
        $this->client = $client;
        $this->url = "https://gateway.thegraph.com/api/$apiKey/subgraphs/id/$subGraphId";
    }

    /** @inheritDoc */
    public function query(Source $source, ?string $cursor = null, ?int $count = null): FetchResult
    {
        if (!WalletSource::validateAddress($source->id)) {
            throw new InvalidSourceException('Invalid wallet address', $source);
        }

        $query = static::createQuery($source, $cursor, $count);

        try {
            $responseData = $this->sendQuery($query);
            $items = static::createItems($responseData->data->erc721Tokens, $source);

            $numItems = count($items);
            $nextCursor = $numItems > 0
                ? strval($query->args['skip'] + $numItems)
                : null;

            return new FetchResult($items, $source, null, $nextCursor, null, []);
        } catch (Throwable $t) {
            return new FetchResult([], $source, null, null, null, [$t->getMessage()]);
        }
    }

    public static function createQuery(Source $source, ?string $cursor = null, ?int $count = null): GraphQuery
    {
        $address = WalletSource::sanitizeAddress($source->id);
        $skip = is_numeric($cursor) ? intval($cursor) : 0;

        $filters = [
            'where' => [
                'owner' => $address,
            ],
        ];

        if ($count !== null) {
            $filters['first'] = $count;
            $filters['skip'] = $skip;
        }

        return new GraphQuery(static::QUERY_ENTITY, $filters, static::QUERY_FIELDS);
    }

    /**
     * @throws ClientExceptionInterface
     * @throws RuntimeException
     */
    public function sendQuery(GraphQuery $query): stdClass
    {
        $body = json_encode([
            'query' => $query->toString(),
            'variables' => (object) null,
        ]);

        $request = new Request('POST', $this->url, static::QUERY_HEADERS, $body);
        $response = $this->client->sendRequest($request);
        $responseBody = $response->getBody()->getContents();

        if ($response->getStatusCode() !== 200) {
            throw new RuntimeException('Erroneous response code for response: ' . $responseBody);
        }

        $responseData = @json_decode($responseBody);
        if ($responseData === null) {
            throw new RuntimeException('Malformed JSON response body: ' . $responseBody);
        }

        return $responseData;
    }

    /** @return Item[] */
    public static function createItems(array $response, Source $source): array
    {
        $items = [];
        foreach ($response as $data) {
            $items[] = new Item($data->id ?? '', null, [$source], [
                TokenItem::META_URL => $data->uri,
            ]);
        }

        return $items;
    }
}
