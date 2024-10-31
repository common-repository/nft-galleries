import React from "react"
import {Modal} from "spotlight/admin-common/components/Modal/Modal"
import WalletInfo from "spotlight/admin-common/components/AccountInfo/WalletInfo"

interface Props {
    address: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

export default function WalletInfoModal({address, isOpen, onClose, onUpdate}: Props) {
    return (
        <Modal isOpen={isOpen && !!address} title="Account details" icon="admin-users" onClose={onClose}>
            {address && (
                <>
                    <Modal.Content>
                        <WalletInfo address={address} onUpdate={onUpdate} />
                    </Modal.Content>
                </>
            )}
        </Modal>
    );
}
