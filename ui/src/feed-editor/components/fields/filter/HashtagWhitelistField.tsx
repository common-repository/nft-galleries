import React from "react";
import {MultiHashtagInput} from "spotlight/admin-common/components/fields/MultiHashtagInput";
import {useSelector} from "react-redux";
import {selectFeedOption} from "spotlight/feed-editor/store/selectors";
import {useFeedEditorContext} from "spotlight/feed-editor/context";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {IncGlobalFiltersField} from "spotlight/feed-editor/components/fields/filter/IncGlobalFiltersField/IncGlobalFiltersField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function HashtagWhitelistField() {
    const {reload, config} = useFeedEditorContext();

    const feedBlacklist = useSelector(selectFeedOption("hashtagBlacklist"));
    const settingsBlacklist = useSelector(selectSetting("hashtagBlacklist")) ?? [];
    const exclude = config.useSettings
        ? settingsBlacklist.concat(feedBlacklist)
        : feedBlacklist;

    return (
        <>
            <FeedEditorField option="hashtagWhitelist" label="Only show NFTs with these hashtags" proOnly wide>
                {props => (
                    <MultiHashtagInput
                        {...props}
                        exclude={exclude}
                        excludeMsg="The %s hashtag is already being used in the below option or your global filters"
                    />
                )}
            </FeedEditorField>

            {config.showSettings && (
                <FeedEditorField option="hashtagWhitelistSettings" proOnly wide>
                    {props => <IncGlobalFiltersField {...props} onSaveGlobals={reload} />}
                </FeedEditorField>
            )}
        </>
    );
}
