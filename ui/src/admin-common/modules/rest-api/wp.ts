import {client} from "spotlight/common/modules/rest-api/client";

export default {
    posts: {
        search: (type: string, search: string = "") => client.get(`/search_posts?search=${search}&type=${type}`),
    },
};
