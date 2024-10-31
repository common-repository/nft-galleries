import React from "react";
import {useSelector} from "react-redux";
import {LinkBehavior, PopupBoxCtaStyle} from "spotlight/feed";
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup";
import {PopupBoxShowSidebarField} from "spotlight/feed-editor/components/fields/design/popupbox/PopupBoxShowSidebarField";
import {PopupBoxShowTraitsField} from "spotlight/feed-editor/components/fields/design/popupbox/PopupBoxShowTraitsField";
import {PopupBoxLinkStyleField} from "spotlight/feed-editor/components/fields/design/popupbox/PopupBoxLinkStyleField";
import {PopupBoxCtaDesignField} from "spotlight/feed-editor/components/fields/design/popupbox/PopupBoxCtaDesignField";
import {selectResponsiveFeedOption} from "spotlight/feed-editor/store/selectors";
import {FieldSet} from "spotlight/admin-common/components/fields/FieldSet/FieldSet";

export function PopupBoxGroup() {
    const linkBehavior = useSelector(selectResponsiveFeedOption("linkBehavior"));
    const disabled = linkBehavior !== LinkBehavior.LIGHTBOX;

    const ctaStyle = useSelector(selectResponsiveFeedOption("lightboxCtaStyle"));
    const showDesign = (ctaStyle === PopupBoxCtaStyle.BUTTON);

    return (
        <FeedEditorGroup id="lightbox" label="Popup box" proOnly>
            <PopupBoxShowSidebarField disabled={disabled} />
            <PopupBoxShowTraitsField disabled={disabled} />
            <PopupBoxLinkStyleField disabled={disabled} />

            {showDesign && (
                <FieldSet>
                    <PopupBoxCtaDesignField disabled={disabled} />
                </FieldSet>
            )}
        </FeedEditorGroup>
    );
}
