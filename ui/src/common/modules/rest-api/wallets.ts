import {client} from "spotlight/common/modules/rest-api/client";

export const wallets = {
    get: () => client.get("/wallets"),
};
