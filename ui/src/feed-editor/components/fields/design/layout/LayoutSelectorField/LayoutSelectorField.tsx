import React, {ComponentType} from "react";
import classes from "./LayoutSelectorField.pcss";
import {Common} from "spotlight/common";
import {useEditorSelector, useFeedOption} from "spotlight/feed-editor/store/hooks";
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill";
import {useFeedEditorContext} from "spotlight/feed-editor/context";
import {FEED_LAYOUTS} from "spotlight/feed-editor/feed-layouts";

export function LayoutSelectorField() {
    const isPro = useFeedEditorContext().config.isPro;
    const showPro = useEditorSelector(state => state.showProOptions);
    const [value, setValue] = useFeedOption("layout", state => state.feedOptions.layout);

    return (
        <div className={classes.root}>
            {FEED_LAYOUTS.map(layout => (!layout.isPro || isPro || showPro) && (
                <LayoutButton
                    key={layout.id}
                    value={layout.id}
                    onClick={setValue}
                    name={layout.name}
                    icon={layout.icon}
                    isSelected={layout.id === (value ?? "grid")}
                    isPro={layout.isPro}
                    isComingSoon={layout.isComingSoon}
                />
            ))}
        </div>
    );
}

interface LayoutButtonProps {
    value: string;
    onClick: (layout: string) => void;
    name: string;
    icon: ComponentType;
    isSelected?: boolean;
    isPro?: boolean;
    isComingSoon?: boolean;
}

function LayoutButton({value, onClick, name, icon, isSelected, isPro, isComingSoon}: LayoutButtonProps) {
    const {config} = useFeedEditorContext();
    const needsPro = isPro && !config.isPro;
    const isDisabled = isComingSoon || needsPro;

    const className = isDisabled
        ? classes.layoutDisabled
        : isSelected ? classes.layoutSelected : classes.layout;

    return (
        <div className={className}
             role="button"
             tabIndex={isDisabled ? undefined : 0}
             onClick={isDisabled ? undefined : () => onClick(value)}
             onKeyPress={isDisabled ? undefined : () => onClick(value)}>

            <span>{name}</span>
            {React.createElement(icon)}

            {needsPro && !isComingSoon && (
                <div className={classes.proOverlay}>
                    <ProPill />
                </div>
            )}

            {isComingSoon && (
                <div className={classes.proOverlay}>
                    <div className={classes.comingSoon}>
                        COMING SOON
                        {!Common.isPro && " TO PRO"}
                    </div>
                </div>
            )}
        </div>
    );
}
