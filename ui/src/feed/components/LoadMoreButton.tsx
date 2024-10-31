import React, {useContext} from "react";
import {DesignedButton} from "spotlight/common/components/DesignedButton/DesignedButton";
import {FeedContext} from "spotlight/feed/context";
import {scrollIntoView} from "spotlight/utils/dom";

export function LoadMoreButton() {
    const button = React.useRef<HTMLButtonElement>();
    const {state, updateState} = useContext(FeedContext);
    const design = state.getDesign();

    const handleClick = () => {
        if (!state.isLoading()) {
            // Apply scroll BEFORE the button is moved down the page due to a state update
            if (design.loadMoreBtnScroll) {
                scrollIntoView(button.current, {behavior: "smooth"});
            }

            updateState(...state.loadMore());
        }
    };

    return (
        <DesignedButton ref={button} design={design.loadMoreBtnDesign} onClick={handleClick} aria-label="Load more NFTs">
            {
                state.isLoading()
                    ? <span>Loading ...</span>
                    : <span>{design.loadMoreBtnText}</span>
            }
        </DesignedButton>
    );
}
