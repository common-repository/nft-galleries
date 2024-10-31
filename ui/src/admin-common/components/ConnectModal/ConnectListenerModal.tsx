import React, {KeyboardEvent, useEffect, useState} from "react"
import css from "./ConnectListenerModal.pcss"
import {Modal} from "spotlight/admin-common/components/Modal/Modal"
import {Button, ButtonType} from "spotlight/admin-common/components/Button"
import {Wallet} from "spotlight/common/modules/wallets"
import {useDispatch, useSelector} from "react-redux"
import {selectWallets} from "spotlight/admin-common/stores/wallets/selectors"
import {addWallet, updateWallet} from "spotlight/admin-common/stores/wallets/thunks"
import {WalletEvents} from "spotlight/admin-common/events/walletEvents"

export function ConnectListenerModal() {
    const dispatch = useDispatch()
    const wallets = useSelector(selectWallets)

    const [isOpen, setIsOpen] = useState(false)
    const [walletsToName, setWalletsToName] = useState<Wallet[]>([])
    const [isDisabled, setIsDisabled] = useState(false)

    const askForNames = async (addresses: string[]) => {
        const toName = addressesToWallets(addresses, wallets)

        if (toName.length > 0) {
            setWalletsToName(toName)
            document.dispatchEvent(new WalletEvents.AskingForName())
            setIsOpen(true)
        }
    }

    const changeName = (idx: number, name: string) => {
        setWalletsToName(accounts => {
            accounts[idx].name = name

            return accounts.slice()
        })
    }

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            submit()
            e.preventDefault()
        }
    }

    const submit = async () => {
        const wallet = walletsToName[0]

        setIsDisabled(true)
        await dispatch(addWallet(wallet))
        setIsDisabled(false)

        document.dispatchEvent(new WalletEvents.Connected(wallet.address))
        closeModal()
    }

    const closeModal = () => {
        setIsOpen(false)
        setWalletsToName([])
    }

    useEffect(() => {
        window.ethereum.on("accountsChanged", askForNames)
        return () => window.ethereum.removeListener("accountsChanged", askForNames)
    }, [askForNames])

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Give this wallet a name">
            <Modal.Content>
                <p>Give your wallets memorable names to make managing them easier:</p>

                {walletsToName.map((account, idx) => (
                    <div key={account.address} className={css.row}>
                        <span className={css.address}>{account.address}</span>
                        <input
                            className={css.nameField}
                            value={account.name}
                            onChange={e => changeName(idx, e.target.value)}
                            onKeyDown={onKeyDown}
                            disabled={isDisabled}
                        />
                    </div>
                ))}
            </Modal.Content>
            <Modal.Footer>
                <Button type={ButtonType.SECONDARY} onClick={closeModal} disabled={isDisabled}>Cancel</Button>
                <Button type={ButtonType.PRIMARY} onClick={submit} disabled={isDisabled}>Connect</Button>
            </Modal.Footer>
        </Modal>
    )
}

function addressesToWallets(addresses: string[], existing: Wallet[]) {
    return addresses
        .filter(a => !existing.some(e => e.address.toLowerCase() === a.toLowerCase()))
        .map(a => ({name: "", address: a.toLowerCase()}))
}
