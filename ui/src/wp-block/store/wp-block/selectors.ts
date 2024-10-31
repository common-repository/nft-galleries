import {StateWithWpBlock} from "spotlight/wp-block/store/wp-block/index";

export const selectIsWpBlockLoaded = (state: StateWithWpBlock) => state.wpBlock.isLoaded;
