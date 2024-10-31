import React from "react"
import {useSelector} from "react-redux"
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup"
import {WalletSelector} from "spotlight/feed-editor/components/fields/connect/WalletSelector/WalletSelector"
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"
import {selectWallets} from "spotlight/admin-common/stores/wallets/selectors"

export type Props = {
    disabled?: boolean;
}

export function WalletsFieldGroup({disabled}: Props) {
    const wallets = useSelector(selectWallets)

    return (
        <FeedEditorGroup id="wallets" label="Show NFTs from these wallets" isStatic>
            <FeedEditorField option="wallets" wide noContainer>
                {props => <WalletSelector wallets={wallets} disabled={disabled} {...props} />}
            </FeedEditorField>
        </FeedEditorGroup>
    )
}
