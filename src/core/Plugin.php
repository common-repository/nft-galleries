<?php

namespace RebelCode\Spotlight\Nft;

use Dhii\Modular\Module\Exception\ModuleExceptionInterface;
use Psr\Container\ContainerInterface;
use RebelCode\Spotlight\Nft\Di\Container;
use RebelCode\Spotlight\Nft\Utils\Arrays;

/**
 * The plugin class.
 */
class Plugin implements ContainerInterface
{
    /** @var string */
    protected $pluginFile;

    /** @var ContainerInterface */
    protected $container;

    /** @var ModuleInterface */
    protected $coreModule;

    /**
     * Constructor.
     *
     * @param string $pluginFile The path to the plugin file.
     */
    public function __construct(string $pluginFile)
    {
        $this->pluginFile = $pluginFile;
        // Create the core module
        $this->coreModule = new CoreModule($pluginFile, $this->loadModules());
        // Create the container
        $this->container = new Container('snft',
            $this->coreModule->getFactories(),
            $this->coreModule->getExtensions()
        );
    }

    /** @inheritDoc */
    public function get($id)
    {
        return $this->container->get($id);
    }

    /** @inheritDoc */
    public function has($id)
    {
        return $this->container->has($id);
    }

    /** Loads the modules. */
    protected function loadModules(): array
    {
        $modules = require dirname($this->pluginFile) . '/modules.php';

        return Arrays::map($modules, function ($module, $key) {
            return new PrefixingModule("$key/", $module);
        });
    }

    /**
     * Runs the plugin.
     *
     * @throws ModuleExceptionInterface If a module encounters an error while running.
     */
    public function run()
    {
        $this->coreModule->run($this->container);
    }
}
