import React, {useEffect} from "react";
import wp from "spotlight/admin-common/libs/wp";
import {Select, SelectOption} from "spotlight/admin-common/components/fields/Select";
import AdminCommon from "spotlight/admin-common/AdminCommon";
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client";

export type Props = {
    id?: string;
    postType: string;
    postId?: number;
    postTitle?: string;
    onChange: (post: wp.Post | null) => void;
    noPostsMsg?: (search: string) => string;
    loadingMsg?: string;
    placeholder?: string;
};

const defaultNoPostsMsg = (inputValue) => inputValue.length
    ? `No posts were found for "${inputValue}"`
    : "Type to search for posts";

export function PostSelector({id, postType, postId, postTitle, onChange, noPostsMsg, loadingMsg, placeholder}: Props) {
    noPostsMsg = noPostsMsg ?? defaultNoPostsMsg;
    loadingMsg = loadingMsg ?? "Searching...";
    placeholder = placeholder ?? "Select or start typing...";

    const searchDebounce = React.useRef<any>();
    const searchCancel = React.useRef<boolean>(false);
    const searchResults = React.useRef<wp.Post[]>();
    const [defaultPosts, setDefaultPosts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const loadOptions = React.useCallback((search: string) => {
        clearTimeout(searchDebounce.current);

        return new Promise<wp.PostType[]>((resolve) => {
            searchDebounce.current = setTimeout(async () => {
                try {
                    const posts = searchResults.current = await AdminCommon.config.searchPosts(postType, search);
                    const options = posts.map(p => ({value: p.id, label: p.title} as SelectOption));

                    resolve(options);
                } catch (error) {
                    console.error(getErrorResponseMessage(error));
                }
            }, 1000);
        });
    }, [postType]);

    const handleChange = React.useCallback((option: SelectOption) => {
        if (option === null) {
            onChange(null);
        } else {
            const post = searchResults.current.find(p => p.id == option.value);
            onChange(post ?? null);
        }
    }, [onChange, searchResults]);

    useEffect(() => {
        searchCancel.current = false;

        if (postType) {
            setIsLoading(true);
            loadOptions("").then((posts) => {
                if (!searchCancel.current) {
                    setDefaultPosts(posts);
                }
            }).finally(() => {
                if (!searchCancel.current) {
                    setIsLoading(false);
                }
            });
        }

        return () => searchCancel.current = true;
    }, [postType, loadOptions, searchCancel]);

    return (
        <Select
            async
            cacheOptions
            id={id}
            value={postId ? postId : 0}
            defaultValue={0}
            defaultInputValue={postId ? postTitle : ""}
            onChange={handleChange}
            defaultOptions={isLoading ? true : defaultPosts}
            loadOptions={loadOptions}
            placeholder={placeholder}
            noOptionsMessage={noPostsMsg}
            loadingMessage={() => loadingMsg}
            isLoading={isLoading}
            isSearchable={true}
            isClearable={true}
        />
    );
}
