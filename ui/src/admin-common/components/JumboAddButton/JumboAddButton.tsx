import React, {ReactNode, Ref} from "react";
import classes from "./JumboAddButton.pcss";
import {Dashicon, DashiconTy} from "spotlight/common/components/Dashicon";
import {DivButton} from "spotlight/common/components/DivButton";
import {classList} from "spotlight/utils/jsx/classes";

export type Props = {
    className?: string;
    icon?: DashiconTy;
    isFocused?: boolean;
    onClick?: () => void;
    children?: ReactNode;
};

export const JumboAddButton = React.forwardRef(
    function JumboAddButton({
        className,
        isFocused = false,
        icon = "plus-alt",
        onClick,
        children = "",
    }: Props, ref: Ref<HTMLDivElement>) {
        const baseClass = isFocused ? classes.focused : classes.root;
        const fullClass = classList(baseClass, className);

        return (
            <DivButton ref={ref} onClick={onClick} className={fullClass}>
                <div className={classes.container}>
                    <Dashicon icon={icon} />
                    <span className={classes.text}>
                    {children}
                </span>
                </div>
            </DivButton>
        );
    },
);
