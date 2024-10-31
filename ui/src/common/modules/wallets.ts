export interface Wallet {
    name: string;
    address: string;
}

export namespace Wallets {
    export function getOpenSeaUrl(address:string): string {
        return "https://opensea.io/" + address;
    }
}

