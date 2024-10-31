<?php

namespace RebelCode\Spotlight\Nft\Utils;

use RuntimeException;

/**
 * Utility functions for dealing with files.
 */
class Files
{
    /**
     * Deletes a directory, recursively.
     *
     * @param string $path The absolute path to the directory to delete.
     */
    public static function rmDirRecursive(string $path)
    {
        $dir = @opendir($path);
        if (!is_resource($dir)) {
            return;
        }

        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                $full = $path . '/' . $file;
                if (is_dir($full)) {
                    static::rmDirRecursive($full);
                } else {
                    @unlink($full);
                }
            }
        }
        closedir($dir);
        @rmdir($path);
    }

    /**
     * Ensures a directory exists. Will also create intermediate directories if necessary.
     *
     * @param string $dirPath The path to the directory.
     */
    public static function ensureDirExists(string $dirPath): void
    {
        if (!is_dir($dirPath)) {
            if (!mkdir($dirPath, 0775, true)) {
                throw new RuntimeException(
                    'Failed to create directory: ' . $dirPath
                );
            }
        }
    }

    /**
     * Downloads a remote file.
     *
     * @param string $url The URL that points to the resource to be downloaded.
     * @param string $filepath The path to the file to which the resource will be downloaded to.
     * @param int $timeout The number of seconds before the request times out.
     */
    public static function download(string $url, string $filepath, int $timeout = 10)
    {
        $response = wp_remote_get($url, [
            'file' => $filepath,
            'stream' => true,
            'timeout' => $timeout,
        ]);

        if (is_wp_error($response)) {
            throw new RuntimeException(
                'Failed to download the file: ' . $response->get_error_message()
            );
        }

        if (intval(wp_remote_retrieve_response_code($response)) !== 200) {
            throw new RuntimeException(
                'Failed to download the file: ' . wp_remote_retrieve_body($response)
            );
        }
    }
}
