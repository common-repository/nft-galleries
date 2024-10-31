import React from "react"
import ConnectWallet from "spotlight/admin-common/components/ConnectWallet/ConnectWallet"
import {Modal} from "spotlight/admin-common/components/Modal/Modal"
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener"
import {WalletEvents} from "spotlight/admin-common/events/walletEvents"
import {Wallet} from "spotlight/common/modules/wallets"

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConnect?: (wallet: Wallet) => void;
}

export default function ConnectWalletModal({isOpen, onClose, onConnect}: Props) {
    useDocumentEventListener(WalletEvents.AskingForName.Name, onClose)

    function connectAndClose(wallet: Wallet) {
        onConnect && onConnect(wallet)
        onClose()
    }

    return (
        <Modal
            title="Connect a wallet"
            isOpen={isOpen}
            width={650}
            onClose={onClose}
        >
            <Modal.Content>
                <ConnectWallet onConnect={connectAndClose} />
            </Modal.Content>
        </Modal>
    )
}
