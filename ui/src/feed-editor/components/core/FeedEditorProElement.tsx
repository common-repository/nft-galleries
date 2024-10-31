import React, {ReactNode} from "react";
import {useEditorSelector} from "spotlight/feed-editor/store/hooks";
import {useFeedEditorContext} from "spotlight/feed-editor/context";

type Props = {
    children: ReactNode;
}

export const FeedEditorProContext = React.createContext(false);

export const FeedEditorProElement = React.memo(function FeedEditorProElement({children}: Props) {
    const showProOptions = useEditorSelector(state => state.showProOptions);
    const {config} = useFeedEditorContext();
    const isFake = !config.isPro;
    const canShow = config.isPro || showProOptions;

    return (
        <>
            {canShow && (
                <FeedEditorProContext.Provider value={isFake}>
                    {children}
                </FeedEditorProContext.Provider>
            )}
        </>
    );
});
