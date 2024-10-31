import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import classes from "./ConnectSidebar.pcss"
import ConnectWalletButton from "spotlight/admin-common/components/ConnectWalletButton/ConnectWalletButton"
import {FeedEditorActions} from "spotlight/feed-editor/store"
import {WalletsFieldGroup} from "spotlight/feed-editor/components/groups/connect/WalletsFieldGroup"
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener"
import {RestApi} from "spotlight/common/modules/rest-api"
import ConnectWallet from "spotlight/admin-common/components/ConnectWallet/ConnectWallet"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {WalletEvents} from "spotlight/admin-common/events/walletEvents"
import {selectWallets} from "spotlight/admin-common/stores/wallets/selectors"
import {Wallet} from "spotlight/common/modules/wallets"

export function ConnectSidebar() {
    const dispatch = useDispatch()
    const {config} = useFeedEditorContext()

    // Disable the contents of the connect sidebar when the feed is fetching media
    const [disabled, setDisabled] = useState(false)
    useDocumentEventListener(RestApi.tokens.events.import.start, () => setDisabled(true), [], [setDisabled])
    useDocumentEventListener(RestApi.tokens.events.import.success, () => setDisabled(false), [], [setDisabled])

    // Automatically select the account that the user connected
    useDocumentEventListener(WalletEvents.Connected.Name, (e: CustomEvent) => {
        dispatch(FeedEditorActions.selectWallet(e.detail))
    })
    const selectConnectedWallet = (wallet: Wallet) => {
        dispatch(FeedEditorActions.selectWallet(wallet.address))
    }

    const hasAccounts = useSelector(selectWallets).length > 0

    return hasAccounts
        ? (
            <div className={classes.connectSidebar}>
                {!config.isDemo && (
                    <div className={classes.connectButton}>
                        <ConnectWalletButton onConnect={selectConnectedWallet} />
                    </div>
                )}

                <WalletsFieldGroup disabled={disabled} />
            </div>
        ) : (
            <div className={classes.connectOnboarding}>
                <p>Connect one or more of your wallets to see a preview of your tokens.</p>
                <ConnectWallet showPrompt={false} onConnect={selectConnectedWallet} />
            </div>
        )
}
