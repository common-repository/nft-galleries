<?php

namespace RebelCode\Spotlight\Nft\Utils;

class Formatting
{
    public static function sqlPrepareScalar($scalar): string
    {
        global $wpdb;

        $format = is_string($scalar)
            ? '%s'
            : (is_float($scalar) ? '%f' : '%d');

        return $wpdb->prepare($format, $scalar);
    }

    public static function stringifySqlValue($value): string
    {
        return is_array($value)
            ? '(' . Arrays::join($value, ', ', [Formatting::class, 'stringifySqlValue']) . ')'
            : static::sqlPrepareScalar($value);
    }
}
