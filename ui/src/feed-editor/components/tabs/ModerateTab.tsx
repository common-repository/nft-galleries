import React, {useCallback, useState} from "react";
import {SidebarLayout} from "spotlight/admin-common/components/SidebarLayout/SidebarLayout";
import {ModerateSidebar} from "spotlight/feed-editor/components/sidebars/ModerateSidebar/ModerateSidebar";
import {ModerateViewport} from "spotlight/feed-editor/components/viewports/ModerateViewport/ModerateViewport";

export function ModerateTab() {
    const [view, setView] = useState<"content" | "sidebar">("content");
    const showSidebar = useCallback(() => setView("sidebar"), [setView]);
    const showContent = useCallback(() => setView("content"), [setView]);

    return (
        <SidebarLayout
            primary="content"
            current={view}
            content={<ModerateViewport onShowSidebar={showSidebar} />}
            sidebar={<ModerateSidebar onShowContent={showContent} />}
        />
    );
}
