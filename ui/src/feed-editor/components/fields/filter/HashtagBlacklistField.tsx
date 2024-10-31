import React from "react";
import {MultiHashtagInput} from "spotlight/admin-common/components/fields/MultiHashtagInput";
import {useSelector} from "react-redux";
import {selectFeedOption} from "spotlight/feed-editor/store/selectors";
import {useFeedEditorContext} from "spotlight/feed-editor/context";
import {selectSetting} from "spotlight/admin-common/stores/settings/selectors";
import {IncGlobalFiltersField} from "spotlight/feed-editor/components/fields/filter/IncGlobalFiltersField/IncGlobalFiltersField";
import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField";

export function HashtagBlacklistField() {
    const {reload, config} = useFeedEditorContext();

    const feedWhitelist = useSelector(selectFeedOption("hashtagWhitelist"));
    const settingsWhitelist = useSelector(selectSetting("hashtagWhitelist")) ?? [];
    const exclude = config.useSettings
        ? settingsWhitelist.concat(feedWhitelist)
        : [];

    return (
        <>
            <FeedEditorField option="hashtagBlacklist" label="Hide NFTs with these hashtags" proOnly wide>
                {props => (
                    <MultiHashtagInput
                        {...props}
                        exclude={exclude}
                        excludeMsg="The %s hashtag is already being used by the above option or your global filters"
                    />
                )}
            </FeedEditorField>

            {config.showSettings && (
                <FeedEditorField option="hashtagBlacklistSettings" proOnly wide>
                    {props => <IncGlobalFiltersField {...props} onSaveGlobals={reload} />}
                </FeedEditorField>
            )}
        </>
    );
}
