import React, {ReactNode} from "react"
import css from "./ConnectWalletButton.pcss"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {Dashicon} from "spotlight/common/components/Dashicon"
import ConnectWalletModal from "spotlight/admin-common/components/ConnectWalletModal/ConnectWalletModal"
import {Wallet} from "spotlight/common/modules/wallets"

type Props = {
    children?: ReactNode;
    onConnect?: (wallet: Wallet) => void
}

export default function ConnectWalletButton({children, onConnect}: Props) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleClick = () => setIsOpen(true)

    const handleModalClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            <Button
                className={css.root}
                size={ButtonSize.HERO}
                type={ButtonType.SECONDARY}
                onClick={handleClick}>
                <Dashicon icon="instagram" />

                {children ?? (<span>Connect more wallets</span>)}
            </Button>

            <ConnectWalletModal
                isOpen={isOpen}
                onConnect={onConnect}
                onClose={handleModalClose}
            />
        </>
    )
}
