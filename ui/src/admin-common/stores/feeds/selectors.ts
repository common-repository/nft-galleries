import {Dictionary} from "spotlight/utils/dictionary";
import {StateWithFeeds} from "spotlight/admin-common/stores/feeds/index";

/* Selects the feeds as an array */
export const selectFeeds = (state: StateWithFeeds) => Dictionary.values(state.feeds);

/* Selects a feed by ID */
export const selectFeedById = (id) => (state: StateWithFeeds) => id ? Dictionary.get(state.feeds, id) : null;

/* Selects whether the store has feeds */
export const selectHasFeeds = (state: StateWithFeeds) => !Dictionary.isEmpty(state.feeds);
