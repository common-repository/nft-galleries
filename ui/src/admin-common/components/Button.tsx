import React, {ComponentType, MouseEvent, MouseEventHandler, MutableRefObject, ReactNode} from "react";
import {classList} from "spotlight/utils/jsx/classes";
import {mergeRefs} from "spotlight/utils/jsx/mergeRefs";
import Tooltip from "spotlight/admin-common/components/Tooltip/Tooltip";
import {Placement} from "popper";
import "spotlight/admin-common/styles/button.scss";
import {uniqueNum} from "spotlight/utils/numbers/uniqueNum";

export enum ButtonType {
    PRIMARY,
    SECONDARY,
    TOGGLE,
    LINK,
    PILL,
    DANGER,
    DANGER_LINK,
    DANGER_PILL,
    NONE,
}

export enum ButtonSize {
    SMALL,
    NORMAL,
    LARGE,
    HERO
}

// @ts-ignore
export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    type?: ButtonType;
    size?: ButtonSize;
    onClick?: MouseEventHandler;
    active?: boolean;
    tooltip?: string | ComponentType;
    tooltipPlacement?: Placement;
    linkTo?: string;

    [k: string]: any;
}

declare type ElemProps = React.HTMLProps<HTMLButtonElement> | React.HTMLProps<HTMLLinkElement>;

export const Button = React.forwardRef(
    function Button(props: ButtonProps, outerRef: MutableRefObject<HTMLButtonElement>) {
        let {children, className, type, size, active, tooltip, tooltipPlacement, onClick, linkTo, ...rest} = props;

        type = type ?? ButtonType.SECONDARY;
        size = size ?? ButtonSize.NORMAL;
        tooltipPlacement = tooltipPlacement ?? "bottom";

        const [hover, setHover] = React.useState(false);
        const handleMouseEnter = () => setHover(true);
        const handleMouseLeave = () => setHover(false);

        const fullClassName = classList(
            className,
            type !== ButtonType.NONE ? "button" : null,
            type === ButtonType.PRIMARY ? "button-primary" : null,
            type === ButtonType.SECONDARY ? "button-secondary" : null,
            type === ButtonType.LINK ? "button-secondary button-tertiary" : null,
            type === ButtonType.PILL ? "button-secondary button-tertiary button-pill" : null,
            type === ButtonType.TOGGLE ? "button-toggle" : null,
            type === ButtonType.TOGGLE && active ? "button-secondary button-active" : null,
            type === ButtonType.TOGGLE && !active ? "button-secondary" : null,
            type === ButtonType.DANGER ? "button-secondary button-danger" : null,
            type === ButtonType.DANGER_LINK ? "button-tertiary button-danger" : null,
            type === ButtonType.DANGER_PILL ? "button-tertiary button-danger button-danger-pill" : null,
            size === ButtonSize.SMALL ? "button-small" : null,
            size === ButtonSize.LARGE ? "button-large" : null,
            size === ButtonSize.HERO ? "button-hero" : null,
        );

        const handleClick = (e: MouseEvent) => {
            onClick && onClick(e);
        };

        let elem = "button";
        if (typeof linkTo === "string") {
            elem = "a";
            rest.href = linkTo;
        } else {
            rest.type = "button";
        }

        // Make sure the button is focusable
        rest.tabIndex = 0;

        if (!tooltip) {
            return React.createElement<ElemProps>(elem, {
                ref: outerRef,
                className: fullClassName,
                onClick: handleClick,
                ...rest,
            }, children);
        }

        const tooltipIsStr = typeof tooltip === "string";
        const tooltipId = "btn-tooltip-" + uniqueNum();
        // @ts-ignore
        const tooltipRender = !tooltipIsStr ? React.createElement(tooltip, {id: tooltipId}) : tooltip;

        return (
            <Tooltip visible={hover && !props.disabled} placement={tooltipPlacement} delay={300}>
                {
                    ({ref}) => React.createElement(elem, {
                        ref: outerRef ? mergeRefs(ref, outerRef) : ref,
                        className: fullClassName,
                        onClick: handleClick,
                        onMouseEnter: handleMouseEnter,
                        onMouseLeave: handleMouseLeave,
                        ...rest,
                    }, children)
                }
                {tooltipRender}
            </Tooltip>
        );
    },
);
