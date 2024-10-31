import React from "react";
import {Spoiler} from "spotlight/admin-common/components/Containers/Spoiler";
import {SettingsGroup} from "spotlight/admin-common/components/SettingsGroup/SettingsGroup";
import {OptimizeAgeLimitField} from "spotlight/admin-common/components/settings/config/optimization/OptimizeAgeLimitField";
import {OptimizeIntervalField} from "spotlight/admin-common/components/settings/config/optimization/OptimizeIntervalField";
import {CleanUpMediaButton} from "spotlight/admin-common/components/CleanUpMediaButton/CleanUpMediaButton";

export type Props = {}

const contentBefore = (
    <div>
        <Spoiler label="What is this?" stealth>
            <div>
                <p>
                    Spotlight imports all NFTs that can be displayed in your feed, even those hidden{" "}
                    behind a "Load more" button. The posts furthest down the list may therefore rarely be seen.
                </p>
                <p>
                    To improve your site’s performance, you can choose to delete these unseen posts{" "}
                    after a set period of time. Once a site visitor requests those posts, they will{" "}
                    be re-imported.
                </p>
            </div>
        </Spoiler>
    </div>
);

const contentAfter = (
    <div>
        <CleanUpMediaButton />
    </div>
);

export function SettingsOptimizationGroup({}: Props) {
    return (
        <SettingsGroup title="Optimization" before={contentBefore} after={contentAfter}>
            <OptimizeAgeLimitField />
            <OptimizeIntervalField />
        </SettingsGroup>
    );
}
