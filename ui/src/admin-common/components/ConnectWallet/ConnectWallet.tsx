import React, {useState} from "react"
import {AnyAction} from "redux"
import {useDispatch} from "react-redux"
import {ThunkDispatch} from "@reduxjs/toolkit"
import css from "./ConnectWallet.pcss"
import {ConnectMetaMask} from "spotlight/admin-common/components/ConnectMetaMask/ConnectMetaMask"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {addWallet} from "spotlight/admin-common/stores/wallets/thunks"
import {Wallet} from "spotlight/common/modules/wallets"
import {triggerError} from "spotlight/common/modules/errors/handlers"

export interface Props {
  showPrompt?: boolean;
  onConnect?: (wallet: Wallet) => void;
  onError?: (wallet: Wallet, e: any) => void;
}

export default function ConnectWallet({showPrompt = true, onConnect, onError}: Props) {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>()
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const isNameValid = (name.length > 0)
  const isAddressValid = (address.startsWith("0x") && address.length > 40)

  async function onAddWallet() {
    if (!isNameValid || !isAddressValid) return

    const wallet = {name, address: address.toLowerCase()}

    try {
      setIsAdding(true)
      await dispatch(addWallet(wallet))
      setIsAdding(false)
      onConnect && onConnect(wallet)
    } catch (e) {
      onError && onError(wallet, e)
      triggerError({
        type: "wallet/add/error",
        message: e.message,
      })
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onAddWallet()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className={css.root}>
      <div className={showPrompt ? css.manualAddress : null}>
        {showPrompt && <p className={css.promptMsg}>Enter your address details</p>}

        <div className={css.walletForm}>
          <label htmlFor="connect-wallet-name">Name</label>
          <input
            id="connect-wallet-name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isAdding}
            onKeyDown={onKeyDown}
            placeholder="My wallet"
          />

          <label htmlFor="connect-wallet-address">Address</label>
          <input
            id="connect-wallet-address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={isAdding}
            onKeyDown={onKeyDown}
            placeholder="0x0000000000000000000000000000000000000000"
          />
        </div>

        <Button
          className={css.connectBtn}
          type={ButtonType.PRIMARY}
          size={ButtonSize.HERO}
          onClick={onAddWallet}
          disabled={isAdding || !isNameValid || !isAddressValid}>
          Add wallet
        </Button>
      </div>
    </div>
  )
}

function OrSeparator() {
  return (
    <div className={css.orSeparator}>
      <div className={css.orLine} />
      <span className={css.orText}>OR</span>
      <div className={css.orLine} />
    </div>
  )
}
