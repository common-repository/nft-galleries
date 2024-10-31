import React, {useContext} from "react"
import styles from "./FeedMasonryLayout.pcss"
import {FeedLayout, LayoutProps} from "spotlight/feed/components/FeedLayout"
import {TokenTile} from "spotlight/feed/components/TokenTile"
import {classList} from "spotlight/utils/jsx/classes"
import {FeedContext} from "spotlight/feed/context"
import {MasonryLayout} from "spotlight/common/components/MasonryLayout/MasonryLayout"

export function FeedMasonryLayout() {
    return (
        <FeedLayout>
            {({tokens, openToken, loadMoreBtn, loadingTokens}: LayoutProps) => {
                const {state} = useContext(FeedContext)
                const design = state.getDesign()

                const items = [].concat(tokens).concat(loadingTokens)

                return (
                    <div className={styles.root}>
                        <MasonryLayout columns={design.numColumns} gap={design.imgPadding}>
                            {items.map((item, idx) =>
                                (typeof item === "string")
                                    ? /* Loading tile */
                                    <div key={idx} className={classList(styles.cell, item)} />
                                    : /* Token tile */
                                    <div key={item.id + idx} className={styles.cell}>
                                        <div className={styles.token}>
                                            <TokenTile token={item} onClick={() => openToken(item)} />
                                        </div>
                                    </div>,
                            )}
                        </MasonryLayout>

                        <div className={styles.buttonList}>
                            {loadMoreBtn}
                        </div>
                    </div>
                )
            }}
        </FeedLayout>
    )
}
