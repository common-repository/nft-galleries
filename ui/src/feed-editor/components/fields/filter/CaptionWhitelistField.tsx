import React from "react";
import {LimitedMultiTextInput} from "spotlight/admin-common/components/fields/LimitedMultiTextInput";
import {useSelector} from "react-redux";
import {selectFeedOption} from "spotlight/feed-editor/store/selectors";
import {useFeedEditorContext} from "spotlight/feed-editor/context";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {IncGlobalFiltersField} from "spotlight/feed-editor/components/fields/filter/IncGlobalFiltersField/IncGlobalFiltersField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function CaptionWhitelistField() {
    const {reload, config} = useFeedEditorContext();

    const feedBlacklist = useSelector(selectFeedOption("captionBlacklist"));
    const settingsBlacklist = useSelector(selectSetting("captionBlacklist")) ?? [];
    const exclude = config.useSettings
        ? settingsBlacklist.concat(feedBlacklist)
        : feedBlacklist;

    return (
        <>
            <FeedEditorField option="captionWhitelist" label="Only show NFTs with these words or phrases" proOnly wide>
                {props => (
                    <LimitedMultiTextInput
                        {...props}
                        exclude={exclude}
                        excludeMsg="%s is already being used in the below option or your global filters"
                    />
                )}
            </FeedEditorField>

            {config.showSettings && (
                <FeedEditorField option="captionWhitelistSettings" proOnly wide>
                    {props => <IncGlobalFiltersField{...props} onSaveGlobals={reload} />}
                </FeedEditorField>
            )}
        </>
    );
}
