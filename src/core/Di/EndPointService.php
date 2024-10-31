<?php

declare(strict_types=1);

namespace RebelCode\Spotlight\Nft\Di;

use Dhii\Services\Factory;
use RebelCode\Spotlight\Nft\RestApi\EndPoint;

class EndPointService extends Factory
{
    /** @var string */
    protected $route;

    /** @var string[] */
    protected $methods;

    /** @var string */
    protected $class;

    /* @var bool */
    protected $hasAuth = false;

    /** Constructor */
    public function __construct(string $route, array $methods, string $class, array $ctorDeps, string $authGuard = null)
    {
        $dependencies = $ctorDeps;

        if ($authGuard !== null) {
            $dependencies[] = $authGuard;
            $this->hasAuth = true;
        }

        parent::__construct($dependencies, [$this, 'definition']);

        $this->route = $route;
        $this->methods = $methods;
        $this->class = $class;
    }

    public function definition(): EndPoint
    {
        $deps = func_get_args();
        $className = $this->class;
        $authGuard = $this->hasAuth
            ? array_pop($deps)
            : null;

        return new EndPoint(
            $this->route,
            $this->methods,
            new $className(...$deps),
            $authGuard
        );
    }
}
