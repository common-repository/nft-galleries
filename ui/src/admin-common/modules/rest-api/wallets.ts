import {client} from "spotlight/common/modules/rest-api/client"
import {Wallet} from "spotlight/common/modules/wallets"

export default {
    add: (wallet: Wallet) => client.post("/wallets", wallet),
    update: (wallet: Wallet) => client.post("/wallets", wallet),
    delete: (address: string) => client.post(`/wallets/delete/${address}`),
};
