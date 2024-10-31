<?php

namespace RebelCode\Spotlight\Nft\GraphQL;

use RebelCode\Spotlight\Nft\Utils\Formatting;

class GraphQuery
{
    /* @var string */
    public $entity;
    /* @var array */
    public $args;
    /* @var array */
    public $fields;

    /** Constructor */
    public function __construct(string $entity, array $args, array $fields)
    {
        $this->entity = $entity;
        $this->args = $args;
        $this->fields = $fields;
    }

    public function toString(bool $pretty = false): string
    {
        [$s1, $e1] = static::getTokens($pretty, 0);
        [$s2, $e2] = static::getTokens($pretty, 1);

        $argsJson = static::argsToString($this->args, $pretty, 1);
        $fieldsStr = static::fieldsToString($this->fields, $pretty, 1);

        return "{{$s1}{$this->entity}({$s2}$argsJson{$e2}) {{$s2}{$fieldsStr}{$e2}}{$e1}}";
    }

    public static function argsToString(array $args, bool $pretty = false, int $indent = 0): string
    {
        [, , $delim] = static::getTokens($pretty, $indent);

        $toImplode = [];
        foreach ($args as $key => $val) {
            if (is_numeric($key)) {
                $toImplode[] = json_encode($val);
            } else {
                [$s2, $e2] = static::getTokens($pretty, $indent + 1);
                $valStr = is_array($val)
                    ? '{' . $s2 . static::argsToString($val, $pretty, $indent + 1) . $e2 . '}'
                    : json_encode($val);

                $toImplode[] = "$key: $valStr";
            }
        }

        return implode($delim, $toImplode);
    }

    public static function fieldsToString(array $fields, bool $pretty = false, int $indent = 0): string
    {
        [, , $delim] = static::getTokens($pretty, $indent);

        $toImplode = [];
        foreach ($fields as $key => $val) {
            if (is_array($val)) {
                [$s2, $e2] = static::getTokens($pretty, $indent + 1);
                $subFields = static::fieldsToString($val, $pretty, $indent + 1);
                $toImplode[] = "$key {{$s2}{$subFields}{$e2}}";
            } else {
                $toImplode[] = $val;
            }
        }

        return implode($delim, $toImplode);
    }

    protected static function getTokens(bool $pretty, int $indent): array
    {
        $in1 = $pretty ? str_repeat('  ', $indent) : '';
        $in2 = $pretty ? str_repeat('  ', $indent + 1) : '';
        $ws = $pretty ? "\n" : ' ';
        $delim = $pretty ? '' : ',';

        $start = $ws . $in2;
        $end = $ws . $in1;

        return [$start, $end, $delim . $start];
    }
}
