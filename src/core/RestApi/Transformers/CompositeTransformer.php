<?php

namespace RebelCode\Spotlight\Nft\RestApi\Transformers;

use Dhii\Transformer\TransformerInterface;

/**
 * A REST API transformer that is composed of other transformers.
 *
 * The children transformers are called in sequence; each transformer will be given the previous transformer's result
 * as input, making the order of transformers potentially an important factor.
 */
class CompositeTransformer implements TransformerInterface
{
    /** @var TransformerInterface[] */
    protected $transformers;

    /**
     * Constructor.
     *
     * @param TransformerInterface[] $transformers
     */
    public function __construct(iterable $transformers)
    {
        $this->transformers = $transformers;
    }

    /** @inheritDoc */
    public function transform($source)
    {
        foreach ($this->transformers as $transformer) {
            $source = $transformer->transform($source);
        }

        return $source;
    }
}
