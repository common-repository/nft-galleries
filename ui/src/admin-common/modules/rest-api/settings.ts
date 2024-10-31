import {client} from "spotlight/common/modules/rest-api/client";

export default {
    get: () => client.get("/settings"),
    save: (settings: Record<string, any>) => client.post("/settings", {settings}),
};
