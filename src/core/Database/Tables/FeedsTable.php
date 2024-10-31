<?php

namespace RebelCode\Spotlight\Nft\Database\Tables;

use RebelCode\Spotlight\Nft\Feeds\Feed;

class FeedsTable
{
    const COL_ID = 'id';
    const COL_NAME = 'name';
    const COL_OPTIONS = 'options';

    public static function feedToRecord(Feed $feed): array
    {
        return [
            static::COL_ID => $feed->getId(),
            static::COL_NAME => $feed->getName(),
            static::COL_OPTIONS => json_encode($feed->getOptions()),
        ];
    }

    public static function recordToFeed(array $record): Feed
    {
        return new Feed(
            $record[static::COL_ID],
            $record[static::COL_NAME],
            json_decode($record[static::COL_OPTIONS], true)
        );
    }
}
