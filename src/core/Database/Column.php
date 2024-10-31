<?php

namespace RebelCode\Spotlight\Nft\Database;

class Column
{
    /* @var string */
    public $type;
    /* @var string|null */
    public $default;
    /* @var bool */
    public $canBeNull;
    /* @var bool */
    public $autoInc;

    /** Constructor */
    public function __construct(string $type, ?string $default = null, bool $canBeNull = true, bool $autoInc = false)
    {
        $this->type = $type;
        $this->default = $default;
        $this->canBeNull = $canBeNull;
        $this->autoInc = $autoInc;
    }

    public static function ofType(string $type): self
    {
        $instance = new self($type);
        $instance->type = $type;

        return $instance;
    }

    public function notNull(): self
    {
        $clone = clone $this;
        $clone->canBeNull = false;
        return $clone;
    }

    public function autoInc(bool $autoInc = true): self
    {
        $clone = clone $this;
        $clone->autoInc = $autoInc;
        return $clone;
    }

    public function default(string $default): self
    {
        $clone = clone $this;
        $clone->default = $default;
        return $clone;
    }

    public function toString(): string
    {
        $default = $this->default ? " DEFAULT {$this->default}" : '';
        $autoInc = $this->autoInc ? " AUTO_INCREMENT" : '';
        $null = $this->canBeNull ? 'NULL' : 'NOT NULL';

        return "{$this->type} $default $null $autoInc";
    }
}
