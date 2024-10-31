import React from "react";
import {MultiTextInput, Props as InnerProps} from "spotlight/admin-common/components/fields/MultiTextInput";

export interface Props extends InnerProps {
    exclude?: Array<string>;
    excludeMsg?: string;
}

export function LimitedMultiTextInput(props: Props) {
    const [excluded, setExcluded] = React.useState("");

    if (props.exclude && props.exclude.length === 0 && excluded.length > 0) {
        setExcluded("");
    }

    const onChange = (values: Array<string>) => {
        const excludedIdx = props.exclude ?
            values.findIndex((val) => props.exclude.includes(val))
            : -1;

        if (excludedIdx > -1) {
            setExcluded(values[excludedIdx]);
        } else {
            props.onChange(values);
        }
    };

    let message = undefined;
    if (excluded.length > 0) {
        const token = "%s";
        const tokenIdx = props.excludeMsg.indexOf("%s");

        const before = props.excludeMsg.substring(0, tokenIdx);
        const after = props.excludeMsg.substring(tokenIdx + token.length);

        message = <>{before}<code>{excluded}</code>{after}</>;
    }

    const newProps = {
        ...props,
        message,
        onChange,
    };

    return <MultiTextInput {...newProps} />;
}
