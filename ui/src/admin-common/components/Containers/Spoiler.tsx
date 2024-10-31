import React, {ReactNode} from "react";
import {bemClass, classList} from "spotlight/utils/jsx/classes";
import {mergeRefs} from "spotlight/utils/jsx/mergeRefs";
import "spotlight/admin-common/styles/spoiler.scss";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {scrollIntoView} from "spotlight/utils/dom";

interface Props {
    className?: string;
    label: ReactNode;
    isOpen?: boolean;
    defaultOpen?: boolean;
    showIcon?: boolean;
    disabled?: boolean;
    stealth?: boolean;
    fitted?: boolean;
    scrollOnOpen?: boolean;
    hideOnly?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

export const Spoiler = React.forwardRef<HTMLDivElement, Props>(
    function Spoiler({label, className, isOpen, defaultOpen, showIcon, disabled, stealth, fitted, scrollOnOpen, hideOnly, onClick, children}, ref) {
        hideOnly = hideOnly ?? false;
        showIcon = showIcon ?? true;
        disabled = disabled ?? false;
        scrollOnOpen = scrollOnOpen ?? false;

        const [isOpenState, setIsOpenState] = React.useState(!!defaultOpen);

        const controlled = (isOpen !== undefined);
        if (!controlled) {
            isOpen = isOpenState;
        }

        const divRef = React.useRef<HTMLDivElement>();

        const handleClick = () => {
            if (disabled) {
                return;
            }

            if (!isOpen && scrollOnOpen) {
                scrollIntoView(divRef.current, {behavior: "smooth"});
            }

            if (!controlled) {
                setIsOpenState(!isOpen);
            }

            onClick && onClick();
        };

        const handleKey = (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
                handleClick();
            }
        };

        const isStatic = (isOpen && onClick === undefined && !showIcon);
        const tabIndex = isStatic ? undefined : 0;
        const role = isStatic ? undefined : "button";

        const spoilerClassName = bemClass("spoiler", {
            "--open": isOpen,
            "--disabled": disabled,
            "--fitted": fitted,
            "--stealth": stealth,
            "--static": isStatic,
        });
        const fullClassName = classList(spoilerClassName, className);
        const icon = isOpen ? "arrow-up-alt2" : "arrow-down-alt2";

        const labelElem = Array.isArray(label)
            ? label.map((l, idx) => <React.Fragment key={idx}>{l}</React.Fragment>)
            : (typeof label === "string" ? <span>{label}</span> : label);

        return (
            <div ref={mergeRefs(divRef, ref)} className={fullClassName}>
                <div className="spoiler__header"
                     onClick={handleClick}
                     onKeyDown={handleKey}
                     role={role}
                     tabIndex={tabIndex}>

                    <div className="spoiler__label">
                        {labelElem}
                    </div>

                    {showIcon && <Dashicon icon={icon} className="spoiler__icon" />}
                </div>

                {(isOpen || hideOnly) && (
                    <div className="spoiler__content">
                        {children}
                    </div>
                )}
            </div>
        );
    },
);
