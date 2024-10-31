import React, {CSSProperties, ReactNode} from "react"
import classes from "../styles/TokenViewer.pcss"
import {Size} from "spotlight/utils/size"
import {Token} from "spotlight/common/modules/tokens"
import {TokenPopupBoxImage} from "spotlight/feed/components/TokenPopupBoxImage"
import {TokenLoading} from "spotlight/feed/components/TokenLoading"

interface Props {
    token?: Token;
    vertical?: boolean;
    children?: ReactNode;
}

export function TokenViewer({token, children, vertical}: Props) {
    const [sizeState, setSizeState] = React.useState<Size | null>(null)

    const size = sizeState ?? {width: 600, height: 600}

    const aspectRatio = (size && size.height > 0)
        ? size.width / size.height : null

    const bottomPadding = aspectRatio
        ? (100 / aspectRatio)
        : 100

    const sizerCss: CSSProperties = {
        paddingBottom: vertical ? undefined : bottomPadding + "%",
    }

    return (
        <div className={vertical ? classes.vertical : classes.horizontal}>
            <div className={children ? classes.wrapperSidebar : classes.wrapper}>
                <div className={classes.tokenContainer}>
                    <div className={classes.tokenSizer} style={sizerCss}>
                        <div className={classes.token}>
                            {token && <TokenPopupBoxImage key={token.id} token={token} onGetSize={setSizeState} />}
                            {!token && <TokenLoading />}
                        </div>
                    </div>
                </div>
            </div>

            {children && (
                <div className={classes.sidebar}>
                    {children}
                </div>
            )}
        </div>
    )
}
