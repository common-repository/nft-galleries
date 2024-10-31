import {Feed} from "spotlight/admin-common/stores/feeds";
import {client} from "spotlight/common/modules/rest-api/client";

export default {
    save: (feed: Feed) => client.post(feed.id ? `/feeds/${feed.id}` : "/feeds", {feed}),
    delete: (id: number) => client.post(`/feeds/delete/${id}`),
};
