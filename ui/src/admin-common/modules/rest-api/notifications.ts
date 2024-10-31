import {client} from "spotlight/common/modules/rest-api/client";

export default {
    get: () => client.get("/notifications"),
};
