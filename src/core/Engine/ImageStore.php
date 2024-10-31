<?php

namespace RebelCode\Spotlight\Nft\Engine;

use RebelCode\Iris\Data\Item;
use RebelCode\Spotlight\Nft\Engine\Data\TokenItem;
use RebelCode\Spotlight\Nft\Utils\Files;
use RebelCode\Spotlight\Nft\Utils\Urls;
use RuntimeException;

class ImageStore
{
    /** @var string */
    protected $path;

    /** @var array|null */
    protected $dirInfoCache = null;

    /** Constructor */
    public function __construct(string $path)
    {
        $this->path = $path;
    }

    /** Caches an item's image and returns a derived item with the image URL set to point to the cached image. */
    public function cacheItemImage(Item $item): ?Item
    {
        $imgUrl = trim($item->get(TokenItem::IMG_URL, ''));
        if (empty($imgUrl)) {
            return $item;
        }

        $dirInfo = $this->getDirInfo();
        $imageFileName = $this->getCachedImageFileName($item);

        $cachedImgPath = $dirInfo['path'] . '/' . $imageFileName;
        $cachedImgUrl = $dirInfo['url'] . '/' . $imageFileName;

        if (!file_exists($cachedImgPath)) {
            try {
                Files::download($imgUrl, $cachedImgPath, 30);
                $contentType = Urls::getContentType($imgUrl);
                $type = stripos($contentType, 'video') !== false ? 'VIDEO' : 'IMAGE';

                $item = $item->with(TokenItem::TYPE, $type);
            } catch (RuntimeException $exception) {
                return null;
            }
        }

        return $item->withChanges([
            TokenItem::IMG_URL => $cachedImgUrl,
            TokenItem::OG_IMG_URL => $imgUrl,
        ]);
    }

    /** Deletes an item's cached image and restores the item's URL back to its original value. */
    public function deleteCachedImage(Item $item): Item
    {
        $dirInfo = $this->getDirInfo();
        $imageFileName = $this->getCachedImageFileName($item);
        $cachedImgPath = $dirInfo['path'] . '/' . $imageFileName;

        @unlink($cachedImgPath);

        return $item->with(TokenItem::IMG_URL, $item->get(TokenItem::OG_IMG_URL, ''));
    }

    /** Calculates the file name for an item's cached image. */
    public function getCachedImageFileName(Item $item): string
    {
        $imgName = basename($item->get(TokenItem::IMG_URL));

        $idPart = str_replace('/', '-', $item->id);
        $imgExtPart = str_replace('/', '-', $imgName);

        return $idPart . '_' . $imgExtPart;
    }

    /** Gets the path and URL of the cache directory. */
    public function getDirInfo(): array
    {
        if ($this->dirInfoCache !== null) {
            return $this->dirInfoCache;
        }

        // Get the info for the "uploads" dir
        $uploadDir = wp_upload_dir();
        if (isset($uploadDir['error']) && $uploadDir['error'] !== false) {
            throw new RuntimeException('Failed to access your uploads directory: ' . $uploadDir['error']);
        }

        // Create the "uploads" dir if needed
        if (!is_dir($uploadDir['basedir'])) {
            $ret = wp_upload_dir();
            if (array_key_exists('error', $ret)) {
                throw new RuntimeException($ret['error']);
            }
        }

        $imagesDir = $uploadDir['basedir'] . '/' . $this->path;
        Files::ensureDirExists($imagesDir);

        $baseUrl = Urls::matchSiteProtocol($uploadDir['baseurl']);
        $imagesUrl = $baseUrl . '/' . $this->path;

        return $this->dirInfoCache = [
            'path' => $imagesDir,
            'url' => $imagesUrl,
        ];
    }
}
