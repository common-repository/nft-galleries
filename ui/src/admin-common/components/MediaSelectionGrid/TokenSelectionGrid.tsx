import React, {useEffect, useRef, useState} from "react"
import classes from "./TokenSelectionGrid.pcss"
import {Props as BaseProps, SelectionGrid} from "spotlight/admin-common/components/SelectionGrid/SelectionGrid"
import {LoadingSpinner} from "spotlight/admin-common/components/Wp/LoadingSpinner"
import {calculateFeedTokensHash, FeedOptions, ModerationMode} from "spotlight/feed"
import {cloneObj} from "spotlight/utils/objects/cloneObj"
import {TokenThumbnail} from "spotlight/feed/components/TokenThumbnail"
import {RestApi} from "spotlight/common/modules/rest-api"
import {Token} from "spotlight/common/modules/tokens"

export type Props = {
    options: FeedOptions;
    selected?: number;
    disabled?: boolean;
    controlled?: boolean;
    canDeselect?: boolean;
    useFilters?: boolean;
    useModeration?: boolean;
    useKeyBinds?: boolean;
    addButton?: BaseProps<Token>["addButton"];
    cache?: TokenSelectionGrid.CacheStrategy;
    autoImport?: boolean;
    onClick?: (tokens: Token | null, idx: number | null, elem: HTMLDivElement) => void;
    onSelect?: (tokens: Token | null, idx: number | null, elem: HTMLDivElement) => void;
    onLoadToken?: (tokens: Token[]) => void;
    children?: BaseProps<Token>["children"];
};

export namespace TokenSelectionGrid {
    export type CacheValue = {
        key: string;
        tokens: Token[];
    };

    export type CacheStrategy = {
        value: CacheValue;
        update: (newValue: CacheValue) => void;
    };
}

export function TokenSelectionGrid(
    {options, useFilters, useModeration, cache, onLoadToken, onClick, onSelect, ...props}: Props,
) {
    const activeOptions = getRequestOptions({options, useFilters, useModeration});
    const [isLoading, setIsLoading] = useState(true);
    const [tokens, setTokens] = useState<Token[]>([]);
    const cacheRef = useRef<TokenSelectionGrid.CacheValue>(null);

    if (!cache) {
        cache = {
            value: cacheRef.current,
            update: newValue => cacheRef.current = newValue,
        };
    }

    useEffect(() => {
        loadToken().then(tokens => {
            setTokens(tokens);
            setIsLoading(false);
            onLoadToken && onLoadToken(tokens);
        });
    }, [activeOptions, useFilters, useModeration]);

    async function loadToken() {
        if (cache.value?.key === calculateFeedTokensHash(activeOptions)) {
            return cache.value.tokens;
        } else {
            setIsLoading(true);

            const response = await RestApi.tokens.get(activeOptions, 0, 0, undefined, props.autoImport);
            const fetchedMedia = response.data.tokens;

            cache.update({
                key: calculateFeedTokensHash(activeOptions),
                tokens: fetchedMedia,
            });

            return fetchedMedia;
        }
    }

    function handleClick(media, idx, elem) {
        onClick && onClick(media, idx, elem);
    }

    function handleSelect(media, idx, elem) {
        onSelect && onSelect(media, idx, elem);
    }

    if (isLoading) {
        return (
            <div className={classes.loading}>
                <LoadingSpinner size={60} />
            </div>
        );
    } else {
        return (
            <SelectionGrid<Token>
                {...props}
                items={tokens}
                onClick={handleClick}
                onSelect={handleSelect}
                keyFn={token => token.id.toString()}>
                {itemProps => <TokenItem {...itemProps} children={props.children} />}
            </SelectionGrid>
        );
    }
}

function TokenItem({item, isSelected, children}) {
    children = children ?? (props => <TokenThumbnail token={props.item} className={classes.thumbnail} />);

    return (
        <div className={isSelected ? classes.selectedToken : classes.token}>
            {children({item, isSelected})}
        </div>
    );
}

function getRequestOptions({options, useFilters, useModeration}: Props): FeedOptions {
    const result = cloneObj(options);

    result.numPosts = 999999;

    if (!useFilters) {
        result.captionWhitelist = [];
        result.captionBlacklist = [];
        result.hashtagWhitelist = [];
        result.hashtagBlacklist = [];
        result.captionWhitelistSettings = false;
        result.captionBlacklistSettings = false;
        result.hashtagWhitelistSettings = false;
        result.hashtagBlacklistSettings = false;
    }

    if (!useModeration) {
        result.moderation = [];
        result.moderationMode = ModerationMode.BLACKLIST;
    }

    return result;
}
