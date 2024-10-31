import {Feed} from "spotlight/admin-common/stores/feeds";
import {client} from "spotlight/common/modules/rest-api/client";

export default {
    clearAll: () => client.post("/clear_cache"),
    clearForFeed: (feed: Feed) => client.post("/clear_cache/feed", {options: feed.options}),
};
