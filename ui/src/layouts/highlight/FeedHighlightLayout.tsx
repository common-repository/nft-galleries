import React, {useContext} from "react"
import styles from "./FeedHighlightLayout.pcss"
import {FeedGridLayout} from "spotlight/layouts/grid/FeedGridLayout"
import {FeedContext} from "spotlight/feed/context"
import {Token} from "spotlight/common/modules/tokens"

export function FeedHighlightLayout() {
    const {state} = useContext(FeedContext);
    const design = state.getDesign();

    return (
        <FeedGridLayout cellClassName={(t, idx) => getCellClass(t, idx, design.highlightFreq)} />
    );
}

/**
 * Computes the HTML class for a grid cell.
 *
 * @param token The media object, or null if its a fake loading media.
 * @param idx The index of the item in the list.
 * @param freq The highlight frequency.
 */
function getCellClass(token: Token | null, idx: number, freq: number) {
    return (idx % freq === 0)
        ? styles.highlight
        : (token ? styles.cell : undefined);
}
