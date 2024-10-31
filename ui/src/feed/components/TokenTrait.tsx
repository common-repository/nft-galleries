import React from "react"
import css from "../styles/TokenTrait.pcss"
import {Token} from "spotlight/common/modules/tokens"

export type Props = {
    trait?: Token.Trait,
}

export function TokenTrait({trait}: Props) {
    return (
        <div className={trait ? css.trait : css.skeleton}>
            <div className={css.type}>{trait?.type ?? ''}</div>
            <div className={css.value}>{trait?.value ?? ''}</div>
        </div>
    )
}
