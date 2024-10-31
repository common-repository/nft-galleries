import React, {useCallback, useEffect, useRef} from "react"
import classes from "../styles/TokenFeed.pcss"
import {FeedState} from "spotlight/feed/state"
import {Responsive} from "spotlight/utils/responsive"
import {FeedContext} from "spotlight/feed/context"
import {useWindowSize} from "spotlight/utils/react/useWindowSize"

interface FeedProps {
    state: FeedState;
    autoDevice?: boolean;
    autoLoad?: boolean;
    onUpdateState?: (state: FeedState) => void;
}

export function TokenFeed({
    state,
    autoDevice = true,
    autoLoad = true,
    onUpdateState = () => null,
}: FeedProps) {
    // This ref (not a state to prevent re-rendering) is used to store whether this component has already requested for
    // feed to be auto-loaded. When the feed is loaded, it returns the new state and a promise for the newer state.
    // The first new state is dispatched to the parent via the `onUpdateState` prop; the second newer state will be
    // dispatched once the promise resolves. However, before the promise resolves, the first state update may cause the
    // parent to re-render this component, triggering another autoload (under certain conditions). This can result
    // in an infinite loop, so auto-loading is locked while an auto-load is in progress.
    const lockedAutoLoading = useRef(false)

    const updateState = useCallback(async (newState: FeedState, promise?: Promise<FeedState>) => {
        lockedAutoLoading.current = true

        onUpdateState(newState)
        const newerState = await promise
        onUpdateState(newerState)

        lockedAutoLoading.current = false

        return newerState
    }, [onUpdateState])

    const updateDevice = useCallback(windowSize => {
        const newState = state.withDevice(Responsive.getDevice(windowSize))
        if (state !== newState) {
            onUpdateState(newState)
        }
    }, [state, onUpdateState])

    // Load the feed if `autoLoad` is true
    useEffect(() => {
        if (autoLoad && !lockedAutoLoading.current && !state.isLoaded() && !state.isLoading()) {
            updateState(...state.load())
        }
    }, [state, autoLoad, updateState])

    // Update the feed's device is `autoDevice` is true
    useWindowSize(size => {
        if (autoDevice) {
            updateDevice(size)
        }
    }, [updateDevice])

    return (
        <FeedContext.Provider value={{state, updateState}}>
            <div className={classes.feed}>
                {React.createElement(state.getDesign().layout)}
            </div>
        </FeedContext.Provider>
    )
}
