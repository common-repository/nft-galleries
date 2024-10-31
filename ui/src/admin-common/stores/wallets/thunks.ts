import {createAsyncThunk} from "@reduxjs/toolkit"
import {RestApi} from "spotlight/common/modules/rest-api"
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api"
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client"
import {Wallet} from "spotlight/common/modules/wallets"

export const loadWallets = createAsyncThunk("wallets/load", async () => {
    try {
        const response = await RestApi.wallets.get();

        if (typeof response === "object" && Array.isArray(response.data)) {
            return response?.data ?? [];
        }
    } catch (error) {
        const reason = getErrorResponseMessage(error);

        console.error(reason);
        throw reason;
    }
});

export const deleteWallet = createAsyncThunk("wallets/delete", async (address: string) => {
    try {
        const response = await AdminRestApi.wallets.delete(address);

        if (typeof response === "object" && Array.isArray(response.data)) {
            return response.data;
        }
    } catch (error) {
        const reason = getErrorResponseMessage(error);

        console.error(reason);
        throw reason;
    }

    throw "Spotlight encountered a problem while trying to delete the wallet. Kindly contact customer support for assistance.";
});

export const updateWallet = createAsyncThunk("wallets/update", async (wallet: Wallet) => {
    await AdminRestApi.wallets.update(wallet);

    return wallet;
});

export const addWallet = updateWallet;
