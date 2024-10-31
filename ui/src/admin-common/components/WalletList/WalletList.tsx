import React from "react"
import css from "./WalletList.pcss"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import Table from "spotlight/admin-common/components/Table/Table"
import ModalPrompt from "spotlight/admin-common/components/ModalPrompt/ModalPrompt"
import {MenuContent, MenuItem, StatefulMenu} from "spotlight/admin-common/components/Containers/Menu"
import {Ellipsis} from "spotlight/admin-common/components/Ellipsis"
import {useDispatch, useSelector} from "react-redux"
import {selectFeeds} from "spotlight/admin-common/stores/feeds/selectors"
import {Link} from "spotlight/admin-common/components/Link"
import {ThunkDispatch} from "@reduxjs/toolkit"
import {AnyAction} from "redux"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {Feed} from "spotlight/admin-common/stores/feeds"
import {Wallet} from "spotlight/common/modules/wallets"
import {deleteWallet} from "spotlight/admin-common/stores/wallets/thunks"

interface Props {
    wallets?: Wallet[];
    onDeleteError?: (msg: string) => void;
}

export function WalletList({wallets, onDeleteError}: Props) {
    const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>()
    const feeds = useSelector(selectFeeds)

    wallets = wallets ?? []

    const [isShowingDeletePrompt, setIsShowingDeletePrompt] = React.useState(false)
    const [walletToDelete, setWalletToDelete] = React.useState<Wallet>()
    const [isDeleting, setIsDeleting] = React.useState(false)

    const showDeletePrompt = (wallet) => () => {
        setWalletToDelete(wallet)
        setIsShowingDeletePrompt(true)
    }

    const closeDeletePrompt = () => {
        setIsDeleting(false)
        setWalletToDelete(null)
        setIsShowingDeletePrompt(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            await dispatch(deleteWallet(walletToDelete.address))
        } catch (error) {
            onDeleteError && onDeleteError("An error occurred while trying to delete the wallet.")
        } finally {
            closeDeletePrompt()
        }
    }

    const tableStyleMap = {
        cols: {
            name: css.nameCol,
            address: css.addressCol,
            usages: css.usagesCol,
            actions: css.actionsCol,
        },
        cells: {
            name: css.nameCell,
            address: css.addressCell,
            usages: css.usagesCell,
            actions: css.actionsCell,
        },
    }

    return (
        <div className="wallets-list">
            <Table
                styleMap={tableStyleMap}
                rows={wallets}
                cols={[
                    {
                        id: "name",
                        label: "Name",
                        render: (wallet) => (
                            <div>
                                <span className={css.name}>{wallet.name}</span>
                            </div>
                        ),
                    },
                    {
                        id: "address",
                        label: "Address",
                        render: (wallet) => <span className={css.address}>{wallet.address}</span>,
                    },
                    {
                        id: "usages",
                        label: "Galleries",
                        render: (wallet) => <span className={css.usages}>
                               {feeds.filter(doesFeedUseWallet(wallet)).map((feed, idx) => (
                                   <Link key={idx} to={{screen: "edit", id: feed.id.toString()}}>
                                       {feed.name}
                                   </Link>
                               ))}
                           </span>,
                    },
                    {
                        id: "actions",
                        label: "Actions",
                        render: (wallet) => (
                            <StatefulMenu>
                                {({ref, openMenu}) => (
                                    <Button
                                        ref={ref}
                                        className={css.actionsBtn}
                                        type={ButtonType.PILL}
                                        size={ButtonSize.NORMAL}
                                        onClick={openMenu}>
                                        <Ellipsis />
                                    </Button>
                                )}

                                <MenuContent>
                                    <MenuItem onClick={showDeletePrompt(wallet)} danger>
                                        <Dashicon icon="trash" />
                                        Delete
                                    </MenuItem>
                                </MenuContent>
                            </StatefulMenu>
                        ),
                    },
                ]}
            />

            <ModalPrompt
                isOpen={isShowingDeletePrompt}
                title="Are you sure?"
                buttons={[
                    isDeleting ? "Please wait ..." : "Yes I'm sure",
                    "Cancel",
                ]}
                okDisabled={isDeleting}
                cancelDisabled={isDeleting}
                onAccept={handleDelete}
                onCancel={closeDeletePrompt}>
                <p>
                    Are you sure you want to delete{" "}
                    <span style={{fontWeight: "bold"}}>
                        {walletToDelete ? walletToDelete.name : ""}
                    </span>
                    ?
                </p>
            </ModalPrompt>
        </div>
    )
}

const doesFeedUseWallet = (wallet: Wallet) => (feed: Feed): boolean => {
    return feed && feed.options.wallets.includes(wallet.address)
}
