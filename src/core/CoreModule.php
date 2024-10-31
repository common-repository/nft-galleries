<?php

namespace RebelCode\Spotlight\Nft;

use Dhii\Services\Extension;
use Dhii\Services\Factories\Value;
use Dhii\Services\Factory;
use Psr\Container\ContainerInterface;

/**
 * The core module for the plugin that acts as a composite for all the other modules.
 */
class CoreModule extends Module
{
    /** @var string */
    protected $pluginFile;

    /** @var ModuleInterface[] */
    protected $modules;

    /** @var Factory[] */
    protected $factories;

    /** @var Extension[] */
    protected $extensions;

    /**
     * Constructor.
     *
     * @param string $pluginFile The path to the plugin file.
     * @param ModuleInterface[] $modules The plugin's modules.
     */
    public function __construct(string $pluginFile, array $modules)
    {
        $this->pluginFile = $pluginFile;
        $this->modules = $modules;

        $this->compileServices();
    }

    /**
     * Retrieves the modules.
     *
     * @return ModuleInterface[] A list of module instances.
     */
    public function getModules(): array
    {
        return $this->modules;
    }

    /**
     * Retrieves the compiled services.
     *
     * @return array A tuple array with two entries: the factory and the extension maps.
     */
    public function getCompiledServices(): array
    {
        return [$this->factories, $this->extensions];
    }

    /**
     * @return Factory[]
     */
    public function getCoreFactories(): array
    {
        return [
            'plugin/core' => new Value($this),
            'plugin/version' => new Value(SNFT_VERSION),
            'plugin/modules' => new Value($this->modules),
            'plugin/file' => new Value($this->pluginFile),
            'plugin/dir' => new Value(dirname($this->pluginFile)),
            'plugin/url' => new Factory(['plugin/file'], function ($file) {
                return rtrim(plugin_dir_url($file), '\\/');
            }),
        ];
    }

    /**
     * @return Extension[]
     */
    public function getCoreExtensions(): array
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getFactories(): array
    {
        return $this->factories;
    }

    /**
     * @inheritDoc
     */
    public function getExtensions(): array
    {
        return $this->extensions;
    }

    /**
     * @inheritDoc
     */
    public function run(ContainerInterface $c)
    {
        foreach ($this->modules as $module) {
            $module->run($c);
        }
    }

    /**
     * Compiles all the module services.
     */
    protected function compileServices()
    {
        $this->factories = $this->getCoreFactories();
        $this->extensions = $this->getCoreExtensions();

        foreach ($this->modules as $module) {
            $this->factories = array_merge($this->factories, $module->getFactories());
            $moduleExtensions = $module->getExtensions();

            if (empty($this->extensions)) {
                $this->extensions = $moduleExtensions;
                continue;
            }

            foreach ($moduleExtensions as $key => $extension) {
                if (!array_key_exists($key, $this->extensions)) {
                    $this->extensions[$key] = $extension;
                    continue;
                }

                $prevExtension = $this->extensions[$key];
                $this->extensions[$key] = function (ContainerInterface $c, $prev) use ($prevExtension, $extension) {
                    return $extension($c, $prevExtension($c, $prev));
                };
            }
        }
    }
}
