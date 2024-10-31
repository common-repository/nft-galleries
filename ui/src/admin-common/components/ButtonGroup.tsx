import React, {ReactNode} from "react";
import "spotlight/admin-common/styles/button.scss";
import {classList} from "spotlight/utils/jsx/classes";

interface Props {
    wide?: boolean;
    children: ReactNode;
}

export const ButtonGroup = ({wide, children}: Props) => {
    return (
        <div className={classList("button-group", wide && "button-group-wide")}>
            {children}
        </div>
    );
};
