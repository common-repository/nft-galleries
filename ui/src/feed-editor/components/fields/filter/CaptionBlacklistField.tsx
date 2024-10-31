import React from "react";
import {LimitedMultiTextInput} from "spotlight/admin-common/components/fields/LimitedMultiTextInput";
import {useSelector} from "react-redux";
import {selectFeedOption} from "spotlight/feed-editor/store/selectors";
import {useFeedEditorContext} from "spotlight/feed-editor/context";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {IncGlobalFiltersField} from "spotlight/feed-editor/components/fields/filter/IncGlobalFiltersField/IncGlobalFiltersField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function CaptionBlacklistField() {
    const {reload, config} = useFeedEditorContext();

    const feedWhitelist = useSelector(selectFeedOption("captionWhitelist"));
    const settingsWhitelist = useSelector(selectSetting("captionWhitelist")) ?? [];
    const exclude = config.useSettings
        ? settingsWhitelist.concat(feedWhitelist)
        : feedWhitelist;

    return (
        <>
            <FeedEditorField option="captionBlacklist" label="Hide NFTs with these words or phrases" proOnly wide>
                {props => (
                    <LimitedMultiTextInput
                        {...props}
                        exclude={exclude}
                        excludeMsg="%s is already being used in the above option or your global filters"
                    />
                )}
            </FeedEditorField>

            {config.showSettings && (
                <FeedEditorField option="captionBlacklistSettings" proOnly wide>
                    {props => <IncGlobalFiltersField {...props} onSaveGlobals={reload} />}
                </FeedEditorField>
            )}
        </>
    );
}
