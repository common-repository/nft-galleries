import React from "react";
import {Spoiler} from "spotlight/admin-common/components/Containers/Spoiler";
import {SettingsGroup} from "spotlight/admin-common/components/SettingsGroup/SettingsGroup";
import {PreloadPostsField} from "spotlight/admin-common/components/settings/config/tweaks/PreloadPostsField";

const contentBefore = (
    <div>
        <Spoiler label="What is this?" stealth>
            <div>
                <p>
                    With this option enabled, Spotlight will pre-load the first set of posts into the page. This{" "}
                    makes the feed load faster, but can make the page slightly slower.
                </p>
                <p>
                    By default, this option is disabled. The feed will show grey loading boxes while the posts are{" "}
                    being loaded in the background. This makes the feed slower, but won't impact the rest of the page.
                </p>
                <p>
                    We recommend turning this option on when your feed is immediately visible when the page loads.{" "}
                    If your feed is further down the page, it will probably have enough time to load before your{" "}
                    visitors can see it, so you can leave this turned off for faster page loading.
                </p>
            </div>
        </Spoiler>
    </div>
);

export function SettingsTweaksGroup() {
    return (
        <SettingsGroup title="Performance Tweaks" before={contentBefore}>
            <PreloadPostsField />
        </SettingsGroup>
    );
}
