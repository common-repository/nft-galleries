import {registerBlockType} from "@wordpress/blocks"
import {WpBlockConfig} from "spotlight/wp-block/config"
import {WpBlockStore} from "spotlight/wp-block/store"
import {loadWpBlock} from "spotlight/wp-block/store/wp-block/thunks"

registerBlockType("spotlight/nft", WpBlockConfig);

WpBlockStore.dispatch(loadWpBlock());

// Reload feeds when tab/window is re-focused
window.addEventListener("focus", function () {
    if (WpBlockStore.getState().wpBlock.isLoaded) {
        WpBlockStore.dispatch(loadWpBlock());
    }
});
