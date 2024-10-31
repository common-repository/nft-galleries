import React from "react";
import {LimitedMultiTextInput, Props} from "spotlight/admin-common/components/fields/LimitedMultiTextInput";
import {prefix} from "spotlight/utils/strings/prefix";
import {sanitizeHashtag} from "spotlight/utils/hashtags/sanitizeHashtag";

export function MultiHashtagInput(props: Props) {
    const value = (typeof props.value === "string") ? [props.value] : (props.value ?? []);

    const newProps = {
        ...props,
        value: value.map(h => prefix(h, "#")),
        sanitize: sanitizeHashtag,
    };

    return <LimitedMultiTextInput {...newProps} />;
}
