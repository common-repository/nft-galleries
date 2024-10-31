<?php

namespace RebelCode\Spotlight\Nft\Database;

use RebelCode\Spotlight\Nft\Utils\Formatting;

class Where
{
    public static function equals(string $col, $value): string
    {
        $sValue = Formatting::sqlPrepareScalar($value);
        return "`$col` = $sValue";
    }

    public static function col(string $col): WhereBuilder
    {
        return new WhereBuilder($col);
    }
}
