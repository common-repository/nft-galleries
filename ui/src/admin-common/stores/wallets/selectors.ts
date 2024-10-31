import {StateWithWallets} from "./index"
import {Dictionary} from "spotlight/utils/dictionary"

export const selectWallets = (state: StateWithWallets) => Dictionary.values(state.wallets);
export const selectWallet = (address: string) => (state: StateWithWallets) => Dictionary.get(state.wallets, address);
export const selectHasWallets = (state: StateWithWallets) => !Dictionary.isEmpty(state.wallets);

export const selectWalletList = (addresses: string[]) => (state: StateWithWallets) => {
    return addresses.map(addr => selectWallet(addr)(state)).filter(wallet => !!wallet);
};
