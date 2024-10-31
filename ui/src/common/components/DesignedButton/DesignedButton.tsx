import React, {HTMLAttributes, HTMLProps, useState} from "react";
import classes from "./DesignedButton.pcss";
import {ButtonDesign} from "spotlight/utils/design/button";

export namespace DesignedButton {
    export interface Props extends HTMLAttributes<HTMLButtonElement> {
        design: ButtonDesign;
        href?: string;
        target?: HTMLProps<HTMLLinkElement>["target"]
        rel?: string;
    }
}

function DesignedButtonInner({design, href, target, rel, className, ...props}: DesignedButton.Props, ref) {
    const [isHovered, setIsHovered] = useState(false);

    const onMouseEnter = (e) => {
        props.onMouseEnter && props.onMouseEnter(e);
        setIsHovered(true);
    };
    const onMouseLeave = (e) => {
        props.onMouseLeave && props.onMouseLeave(e);
        setIsHovered(false);
    };

    const button = (
        <button
            {...props}
            ref={ref}
            className={classes.button + " " + (className ?? "")}
            style={ButtonDesign.toCss(design, isHovered)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );

    return href !== undefined
        ? <a href={href} target={target} rel={rel} className={classes.link}>{button}</a>
        : button;
}

export const DesignedButton = React.forwardRef(DesignedButtonInner);
