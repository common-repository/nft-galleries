import {client} from "spotlight/common/modules/rest-api/client";

export const feeds = {
    get: () => client.get("/feeds"),
};
