import {createSlice, isFulfilled, PayloadAction} from "@reduxjs/toolkit";
import {Dictionary} from "spotlight/utils/dictionary";
import {deleteFeed, duplicateFeed, loadFeeds, saveFeed} from "spotlight/admin-common/stores/feeds/thunks";
import {FeedOptions} from "spotlight/feed";
import {createFeedOptions} from "spotlight/feed/options";

/**
 * Represents a saved feed.
 *
 * A saved feed is a set of feed options that also have an associated ID and name, among other pieces of data.
 *
 * Instances of this class do not necessarily represent a feed that has already been saved. An instance could
 * represent a feed that has not yet been saved, but will be. As such, do not assume that a feed must already
 * exist in the database on the server.
 */
export type Feed = {
    id: number | null;
    name: string;
    usages: Array<Feed.Usage>;
    options: FeedOptions;
};

export namespace Feed {
    /**
     * Represents a reference to a WordPress entity where a feed shortcode, block or widget is being shown.
     */
    export type Usage = {
        // The ID
        id: number;
        // The name
        name: string;
        // The type
        type: string;
        // The edit link
        link: string;
    }

    export function getLabel(feed: Feed) {
        const name = feed.name?.trim();

        return name?.length > 0 ? name : "(no name)";
    }
}

export type FeedsState = Dictionary<Feed>;

export type StateWithFeeds = {
    feeds: FeedsState;
};

// Utility function to add a feed to the state. Checks for valid IDs first.
function addFeed(state, feed: Feed) {
    if (feed.id) {
        feed.options = createFeedOptions(feed.options);
        Dictionary.set(state, feed.id, feed);
    }
}

export const FeedsSlice = createSlice({
    name: "feeds",
    initialState: {} as FeedsState,
    reducers: {},
    // @ts-ignore
    extraReducers: builder => builder
        // Set loaded feeds to state
        .addCase(loadFeeds.fulfilled, (state, action: PayloadAction<Feed[]>) => {
            action.payload.forEach(feed => addFeed(state, feed));
        })
        // Removes a feed after it is deleted
        .addCase(deleteFeed.fulfilled, (state, action: PayloadAction<number>) => {
            Dictionary.remove(state, action.payload);
        })
        // Updates a feed in state after it is saved or duplicated
        .addMatcher(
            isFulfilled(saveFeed, duplicateFeed),
            (state, action: PayloadAction<Feed>) => {
                addFeed(state, action.payload);
            },
        ),
});

export * from "./thunks";
