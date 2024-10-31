import {Dictionary} from "spotlight/utils/dictionary"
import {createSlice, isFulfilled, PayloadAction} from "@reduxjs/toolkit"
import {deleteWallet, loadWallets, updateWallet} from "spotlight/admin-common/stores/wallets/thunks"
import {Wallet} from "spotlight/common/modules/wallets"

export type WalletsState = Dictionary<Wallet>;

export type StateWithWallets = {
    wallets: WalletsState;
}

export const WalletsSlice = createSlice({
    name: "wallets",
    initialState: {} as WalletsState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(updateWallet.fulfilled, (state, action: PayloadAction<Wallet>) => {
            const wallet = action.payload;
            Dictionary.set(state, wallet.address, wallet);
        })
        .addMatcher(
            isFulfilled(loadWallets, deleteWallet),
            (state, action: PayloadAction<Wallet[]>) => {
                Dictionary.clear(state);
                action.payload.forEach(wallet => {
                    Dictionary.set(state, wallet.address, wallet);
                });
            },
        ),
});
