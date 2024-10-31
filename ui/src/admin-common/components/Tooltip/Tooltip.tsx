import React, {useEffect} from "react";
import styles from "./Tooltip.pcss";
import {Manager, Popper, Reference} from "react-popper";
import {DualPopperChildren, Placement} from "popper";
import AdminCommon from "spotlight/admin-common/AdminCommon";
import {classList} from "spotlight/utils/jsx/classes";

interface Props {
    visible: boolean;
    delay?: number;
    children: DualPopperChildren;
    placement?: Placement;
    theme?: {
        root?: string,
        content?: string,
        container?: string,
        containerTop?: string,
        containerBottom?: string,
        containerLeft?: string,
        containerRight?: string;
        arrow?: string,
        arrowTop?: string,
        arrowBottom?: string,
        arrowLeft?: string,
        arrowRight?: string,
    };
}

export default function Tooltip({visible, delay, placement, theme, children}: Props) {
    theme = theme ?? {};
    placement = !placement ? "bottom" : placement;

    const [showTooltip, setShowTooltip] = React.useState(false);
    const modifiers = {
        preventOverflow: {
            boundariesElement: document.getElementById(AdminCommon?.config?.rootId ?? "wpbody"),
            padding: 5,
        },
    };

    useEffect(() => {
        const ms = visible ? delay : 1;
        const timeout = setTimeout(() => setShowTooltip(visible), ms);

        return () => clearTimeout(timeout);
    }, [visible]);

    const containerClassKey = getAlignedClass("container", placement);
    const arrowClassKey = getAlignedClass("arrow", placement);

    const containerClass = classList(
        styles[containerClassKey],
        theme.container,
        theme[containerClassKey],
    );
    const arrowClass = classList(
        styles[arrowClassKey],
        theme.arrow,
        theme[arrowClassKey],
    );

    return (
        <Manager>
            <Reference>
                {(props) => children[0](props)}
            </Reference>
            <Popper placement={placement} modifiers={modifiers} positionFixed={true}>
                {
                    ({ref, style, placement, arrowProps}) => !showTooltip ? null : (
                        <div ref={ref}
                             className={classList(styles.root, theme.root)}
                             style={style}
                             tabIndex={-1}>
                            <div className={containerClass} data-placement={placement}>
                                <div className={classList(styles.content, theme.content)}>
                                    {children[1]}
                                </div>
                                <div className={arrowClass}
                                     ref={arrowProps.ref}
                                     style={arrowProps.style}
                                     data-placement={placement} />
                            </div>
                        </div>
                    )
                }
            </Popper>
        </Manager>
    );
};

function getAlignedClass(className: string, placement: Placement) {
    switch (placement) {
        case "top":
        case "top-start":
        case "top-end":
            return className + "Top";
        case "bottom":
        case "bottom-start":
        case "bottom-end":
            return className + "Bottom";
        case "left":
        case "left-start":
        case "left-end":
            return className + "Left";
        case "right":
        case "right-start":
        case "right-end":
            return className + "Right";
        default:
            return className;
    }
}
