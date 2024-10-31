<?php

namespace RebelCode\Spotlight\Nft\RestApi;

/**
 * A simple implementation of a REST API endpoint.
 */
class EndPoint
{
    /**
     * The endpoint's route.
     *
     * @var string
     */
    public $route;

    /**
     * The endpoint's accepted HTTP methods.
     *
     * @var string[]
     */
    public $methods;

    /**
     * The endpoint's handler.
     *
     * @var callable
     */
    public $handler;

    /**
     * The endpoint's authorization handler, if any.
     *
     * @var AuthGuardInterface|null
     */
    public $authHandler;

    /**
     * Constructor.
     *
     * @param string                  $route       The route.
     * @param string[]                $methods     The accepted HTTP methods.
     * @param callable                $handler     The handler.
     * @param AuthGuardInterface|null $authHandler Optional authorization handler.
     */
    public function __construct($route, array $methods, callable $handler, AuthGuardInterface $authHandler = null)
    {
        $this->route = $route;
        $this->methods = $methods;
        $this->handler = $handler;
        $this->authHandler = $authHandler;
    }

    public function getRoute(): string
    {
        return $this->route;
    }

    /** @return string[] */
    public function getMethods(): array
    {
        return $this->methods;
    }

    public function getHandler(): callable
    {
        return $this->handler;
    }

    public function getAuthHandler(): ?AuthGuardInterface
    {
        return $this->authHandler;
    }
}
