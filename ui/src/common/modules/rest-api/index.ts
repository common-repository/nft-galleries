import {client} from "spotlight/common/modules/rest-api/client"
import {feeds} from "spotlight/common/modules/rest-api/feeds"
import {wallets} from "spotlight/common/modules/rest-api/wallets"
import {tokens} from "spotlight/common/modules/rest-api/tokens"

export const RestApi = {
    config: {
        autoImportMedia: false,
    },
    client,
    feeds,
    wallets,
    tokens,
};
