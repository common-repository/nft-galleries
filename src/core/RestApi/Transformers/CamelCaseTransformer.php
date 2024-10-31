<?php

namespace RebelCode\Spotlight\Nft\RestApi\Transformers;

use Dhii\Transformer\TransformerInterface;

/**
 * A REST API transformer that ensures that all keys use camelCase.
 */
class CamelCaseTransformer implements TransformerInterface
{
    /** @inheritDoc */
    public function transform($source)
    {
        if (!is_iterable($source)) {
            return $source;
        }

        return $this->camelCaseIterable($source);
    }

    /**
     * Applies {@link CamelCaseTransformer::camelCase()} to a all elements in an iterable value.
     *
     * @param iterable $iterable The iterable value.
     *
     * @return array An array with the same values, but potentially camelCase-d keys.
     */
    protected function camelCaseIterable(iterable $iterable)
    {
        $result = [];

        foreach ($iterable as $key => $value) {
            $result[$this->camelCase($key)] = is_iterable($value)
                ? $this->camelCaseIterable($value)
                : $value;
        }

        return $result;
    }

    /**
     * Transforms a snake_case string into a camelCase string.
     *
     * @param string $snakeCase The snake case string.
     *
     * @return string The resulting camelCase string.
     */
    protected function camelCase(string $snakeCase)
    {
        $parts = explode('_', $snakeCase);

        if (count($parts) < 2) {
            return implode('', $parts);
        }

        $head = array_shift($parts);
        $tail = array_map(function ($part) {
            return ucfirst(strtolower($part));
        }, $parts);

        return $head . implode('', $tail);
    }
}
