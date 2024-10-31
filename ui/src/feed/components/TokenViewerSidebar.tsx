import React, {ReactNode} from "react"
import {TokenInfo} from "spotlight/feed/components/TokenInfo"
import {Token} from "spotlight/common/modules/tokens"

interface Props {
    token?: Token;
    children?: ReactNode;
}

export function TokenViewerSidebar({token, children}: Props) {
    return (
        <TokenInfo token={token}>
            {children}
        </TokenInfo>
    )
}
