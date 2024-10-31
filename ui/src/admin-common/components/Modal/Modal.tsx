import React, {CSSProperties, HTMLAttributes, MouseEventHandler, MutableRefObject, ReactNode, useEffect} from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.pcss";
import {classList} from "spotlight/utils/jsx/classes";
import {useDelayedFlag} from "spotlight/utils/react/useDelayedFlag";
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener";
import {Dashicon, DashiconTy} from "spotlight/common/components/Dashicon";
import {DivButton} from "spotlight/common/components/DivButton";
import Tooltip from "spotlight/admin-common/components/Tooltip/Tooltip";

interface Props {
    children?: ReactNode;
    className?: string;
    isOpen?: boolean;
    title?: string;
    icon?: DashiconTy;
    width?: number;
    height?: number;
    onClose?: () => void;
    allowShadeClose?: boolean;
    focusChild?: MutableRefObject<HTMLElement>;
    portalTo?: HTMLElement;
    rootRef?: MutableRefObject<HTMLDivElement>
}

export function Modal({rootRef, children, className, isOpen, icon, title, width, height, onClose, allowShadeClose, focusChild, portalTo}: Props) {
    const containerRef = React.useRef<HTMLDivElement>();
    const [shouldRender] = useDelayedFlag(isOpen, false, Modal.ANIMATION_DELAY);

    useDocumentEventListener<KeyboardEvent>("keydown", (e) => {
        if (isOpen && e.key === "Escape") {
            onClose && onClose();
            e.preventDefault();
            e.stopPropagation();
        }
    }, [], [isOpen, onClose]);

    useEffect(() => {
        if (!containerRef || !containerRef.current) return;
        if (isOpen) (focusChild ?? containerRef).current.focus();
    }, []);

    if (!shouldRender) {
        return null;
    }

    width = width ?? 600;
    const style: CSSProperties = {width, height};

    const fullClassName = classList(
        classes.modal,
        isOpen ? classes.opening : classes.closing,
        className,
        "wp-core-ui-override",
    );

    allowShadeClose = allowShadeClose ?? true;
    const onClickShade = () => {
        if (allowShadeClose) {
            onClose && onClose();
        }
    };

    const modal = (
        <div className={fullClassName} ref={rootRef}>
            <div className={classes.shade} tabIndex={-1} onClick={onClickShade} />

            <div ref={containerRef} className={classes.container} style={style} tabIndex={-1}>
                {!title ? null : (
                    <Modal.Header>
                        <h1>
                            <Modal.Icon icon={icon} />
                            {title}
                        </h1>
                        <Modal.CloseBtn onClick={onClose} />
                    </Modal.Header>
                )}

                {children}
            </div>
        </div>
    );

    let target: Element = portalTo;
    if (target === undefined) {
        const modalTarget = document.getElementsByClassName("spotlight-modal-target");

        target = modalTarget.length === 0
            ? document.body
            : modalTarget.item(0);
    }

    return ReactDOM.createPortal(modal, target);
}

export namespace Modal {
    export const ANIMATION_DELAY = 120;

    interface CloseBtnProps {
        onClick: MouseEventHandler;
    }

    export function CloseBtn({onClick}: CloseBtnProps) {
        const [hover, setHover] = React.useState(false);
        const handleMouseEnter = () => setHover(true);
        const handleMouseLeave = () => setHover(false);

        return (
            <Tooltip visible={hover}>
                {({ref}) => (
                    <DivButton
                        ref={ref}
                        className={classes.closeBtn}
                        onClick={onClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        children={<Dashicon icon="no-alt" />}
                    />
                )}
                Close
            </Tooltip>
        );
    }

    interface IconProps {
        icon?: DashiconTy;
    }

    export function Icon({icon}: IconProps) {
        return !icon ? null : <Dashicon icon={icon} className={classes.icon} />;
    }

    interface ChildrenProp {
        children?: ReactNode;
    }

    export function Header({children}: ChildrenProp) {
        return <div className={classes.header}>
            {children}
        </div>;
    }

    export function Content({children, ...props}: ChildrenProp & HTMLAttributes<HTMLDivElement>) {
        return <div className={classes.scroller}>
            <div className={classes.content} {...props}>
                {children}
            </div>
        </div>;
    }

    type FooterProps = ChildrenProp & {
        style?: "left" | "right" | "space-between";
    };

    export function Footer({children, style = "right"}: FooterProps) {
        return <div className={getFooterClassName(style)}>
            {children}
        </div>;
    }

    function getFooterClassName(style: string) {
        switch (style) {
            case "left":
                return classes.footerLeft;
            case "space-between":
                return classes.footerSpaceBetween;
            default:
                return classes.footerRight;
        }
    }
}
