<?php

namespace RebelCode\Spotlight\Nft\Database;

use RebelCode\Spotlight\Nft\Utils\Formatting;
use RuntimeException;

class WhereBuilder
{
    protected $col;

    public function __construct($col)
    {
        $this->col = $col;
    }

    public function isEqualTo($value): string
    {
        return $this->compare('=', $value);
    }

    public function isIn(array $values): string
    {
        return $this->compare('IN', $values);
    }

    public function compare(string $operator, $value): string
    {
        $operator = strtoupper($operator);

        if ($operator === 'IN' || $operator === 'NOT IN' || $operator === 'BETWEEN' || $operator === 'NOT BETWEEN') {
            if (!is_array($value)) {
                throw new RuntimeException("Value for SQL '$operator' comparison must be an array");
            }

            if (empty($value)) {
                throw new RuntimeException("Array for SQL '$operator' comparison cannot be empty");
            }
        }

        $sValue = Formatting::stringifySqlValue($value);

        return "`$this->col` $operator $sValue";
    }
}
