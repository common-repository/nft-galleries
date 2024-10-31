import React, {ReactElement, useCallback} from "react";
import {FeedEditorProElement} from "spotlight/feed-editor/components/core/FeedEditorProElement";
import {useEditorSelector} from "spotlight/feed-editor/store/hooks";
import {useFeedEditorContext} from "spotlight/feed-editor/context";

export type Props = {
    onChange: (val) => void;
    children: (props: { disabled: boolean, onChange: (val) => void }) => ReactElement;
};

export function FeedEditorProField(props: Props) {
    const showProOptions = useEditorSelector(state => state.showProOptions);
    const isPro = useFeedEditorContext().config.isPro;
    const canShow = isPro || showProOptions;

    const onChange = useCallback((val) => {
        if (isPro) {
            onChange(val);
        }
    }, [isPro, props.onChange]);

    return canShow && (
        <FeedEditorProElement>
            {props.children({onChange, disabled: !isPro})}
        </FeedEditorProElement>
    );
}
