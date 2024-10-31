import React from "react"
import {FeedEditorGroup} from "spotlight/feed-editor/components/core/FeedEditorGroup/FeedEditorGroup"
import {PostOrderField} from "spotlight/feed-editor/components/fields/design/feed/PostOrderField"
import {LinkBehaviorField} from "spotlight/feed-editor/components/fields/design/feed/LinkBehaviorField"

export function FeedGroup() {
    return (
        <FeedEditorGroup id="feed" label="Feed">
            {/*<PostOrderField />*/}
            <LinkBehaviorField />
        </FeedEditorGroup>
    );
}
