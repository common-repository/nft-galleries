import React from "react"
import css from "./WalletsPage.pcss"
import ConnectWalletButton from "spotlight/admin-common/components/ConnectWalletButton/ConnectWalletButton"
import {WalletList} from "spotlight/admin-common/components/WalletList/WalletList"
import {Message, MessageType} from "spotlight/admin-common/components/Message/Message"
import {useSelector} from "react-redux"
import {selectWallets} from "spotlight/admin-common/stores/wallets/selectors"
import ConnectWallet from "spotlight/admin-common/components/ConnectWallet/ConnectWallet"

export default function WalletsPage() {
  const [deleteError, setDeleteError] = React.useState("")

  const wallets = useSelector(selectWallets)

  return (
    <div className={css.root}>
      {wallets.length === 0 &&
        <div className={css.connect}>
          <h2>Connect your first wallet</h2>
          <ConnectWallet showPrompt />
        </div>
      }

      {wallets.length > 0 &&
        <>
          {deleteError.length > 0 && (
            <Message
              type={MessageType.ERROR}
              showIcon={true}
              isDismissible={true}
              onDismiss={() => setDeleteError("")}>
              {deleteError}
            </Message>
          )}

          <div className={css.connectBtn}>
            <ConnectWalletButton />
          </div>

          <WalletList wallets={wallets} onDeleteError={setDeleteError} />
        </>
      }
    </div>
  )
}
