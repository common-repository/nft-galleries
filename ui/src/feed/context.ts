import React from "react";
import {FeedState} from "spotlight/feed/state";
import {fn} from "spotlight/utils/functions";

export type FeedContextTy = {
    state: FeedState;
    updateState: (newState: FeedState, promise?: Promise<FeedState>) => Promise<FeedState>;
};

export const FeedContext = React.createContext<FeedContextTy>({
    state: new FeedState({}),
    updateState: fn.noop,
});
