<?php

namespace RebelCode\Spotlight\Nft\Di;

use Psr\Container\NotFoundExceptionInterface;

/**
 * Implementation of an exception when a service is not found in a DI container.
 */
class NotFoundException extends ContainerException implements NotFoundExceptionInterface
{
}
