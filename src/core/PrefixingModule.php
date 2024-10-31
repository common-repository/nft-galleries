<?php

namespace RebelCode\Spotlight\Nft;

use Dhii\Container\DeprefixingContainer;
use Dhii\Services\Service;
use Psr\Container\ContainerInterface;

/**
 * A module decorator that prefixes all of a module's services.
 *
 * This instance ensures that all service factories given by the inner module are prefixed. In addition, the decorator
 * will also prefix all service dependencies for both factories and extensions.
 *
 * Naturally, prefixing can break references to services outside of the module. For this reason, extension keys will NOT
 * be prefixed and dependencies that start with an '@' character will also NOT be prefixed. This gives modules the
 * ability to extend or depend on external services.
 *
 * Example:
 * ```
 * [
 *      "foo" => new Constructor(Foo::class, ['bar']),
 *      "bar" => new Value("hello"),
 * ]
 * // If prefix is set to "pre/", the above will be transformed into:
 * [
 *      "pre/foo" => new Constructor(Foo::class, ['pre/bar']),
 *      "pre/bar" => new Value("hello"),
 * ]
 * ```
 */
class PrefixingModule extends Module
{
    /** @var string */
    protected $prefix;

    /** @var ModuleInterface */
    protected $inner;

    /**
     * Constructor.
     *
     * @param string          $prefix The prefix to apply to service keys.
     * @param ModuleInterface $inner  The module instance to which to apply the prefixing.
     */
    public function __construct(string $prefix, ModuleInterface $inner)
    {
        $this->prefix = $prefix;
        $this->inner = $inner;
    }

    /**
     * @inheritDoc
     */
    public function getFactories() : array
    {
        return $this->prefixFactories($this->inner->getFactories());
    }

    /**
     * @inheritDoc
     */
    public function getExtensions() : array
    {
        return $this->prefixExtensions($this->inner->getExtensions());
    }

    /**
     * @inheritDoc
     */
    public function run(ContainerInterface $c)
    {
        $container = new DeprefixingContainer($c, $this->prefix, false);

        $this->inner->run($container);
    }

    /**
     * Applies the prefix to a service key.
     *
     * Service keys that start with '@' are not prefixed, but the '@' is omitted.
     *
     * @param string $key The service key.
     *
     * @return string The prefixed service key.
     */
    protected function applyPrefix(string $key)
    {
        return ($key[0] === '@')
            ? substr($key, 1)
            : $this->prefix . $key;
    }

    /**
     * Prefixes a list of factories.
     *
     * @param Service[] $factories The factories to prefix.
     *
     * @return Service[] The list of prefixed factories.
     */
    protected function prefixFactories(array $factories)
    {
        $results = [];

        foreach ($factories as $key => $factory) {
            $newKey = $this->applyPrefix($key);

            $results[$newKey] = $this->prefixDependencies($factory);
        }

        return $results;
    }

    /**
     * Prefixes a list of extensions.
     *
     * @param Service[] $extensions The extensions to prefix.
     *
     * @return Service[] The list of prefixed extensions.
     */
    protected function prefixExtensions(array $extensions)
    {
        $results = [];

        foreach ($extensions as $key => $extension) {
            $results[$key] = $this->prefixDependencies($extension);
        }

        return $results;
    }

    /**
     * Creates a copy of the service with its dependencies prefixed.
     *
     * @param callable|Service $service The service whose dependencies to prefix.
     *
     * @return Service The new service.
     */
    protected function prefixDependencies($service)
    {
        if (!($service instanceof Service)) {
            return $service;
        }

        $dependencies = $service->getDependencies();
        $dependencies = array_map([$this, 'applyPrefix'], $dependencies);

        return $service->withDependencies($dependencies);
    }
}
