import React from "react"
import classes from "../styles/TokenTile.pcss"
import {TokenOverlay} from "spotlight/feed/components/TokenOverlay"
import {TokenThumbnail} from "spotlight/feed/components/TokenThumbnail"
import {DivButton} from "spotlight/common/components/DivButton"
import {classList} from "spotlight/utils/jsx/classes"
import {Token} from "spotlight/common/modules/tokens"

interface Props {
    token: Token;
    className?: string;
    forceOverlay?: boolean;
    overlayEnabled?: boolean;
    onClick?: (e: MouseEvent) => void;
}

export function TokenTile({token, className, forceOverlay, overlayEnabled = true, onClick}: Props) {
    const [isHovered, setIsHovered] = React.useState(false)

    const handleClick = (e) => {
        onClick && onClick(e)
    }

    const handleMouseOver = () => setIsHovered(true)
    const handleMouseOut = () => setIsHovered(false)

    return (
        <DivButton
            className={classList(classes.root, className)}
            onClick={handleClick}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}>
            <TokenThumbnail token={token} />

            {(isHovered || forceOverlay) && overlayEnabled && (
                <div className={classes.overlay}>
                    <TokenOverlay token={token} />
                </div>
            )}
        </DivButton>
    )
}
