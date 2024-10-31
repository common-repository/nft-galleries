export namespace WalletEvents {
    export class Connected extends CustomEvent<string> {
        static readonly Name = "snft/wallet/connected"

        constructor(address: string) {super(Connected.Name, {detail: address})}
    }

    export class AskingForName extends CustomEvent<never> {
        static readonly Name = "snft/wallet/asking_name"

        constructor() {super(AskingForName.Name)}
    }
}
