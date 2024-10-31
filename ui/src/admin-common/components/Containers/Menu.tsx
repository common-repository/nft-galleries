import React, {CSSProperties, ReactNode, Ref, useCallback, useState} from "react";
import {Manager, Popper, Reference} from "react-popper";
import {DualPopperChildren, Placement} from "popper";
import {useDetectTabOut} from "spotlight/utils/react/useDetectTabOut";
import {useDetectOutsideClick} from "spotlight/utils/react/useDetectOutsideClick";
import AdminCommon from "spotlight/admin-common/AdminCommon";
import "spotlight/admin-common/styles/menu.scss";
import {bemClass, classList} from "spotlight/utils/jsx/classes";

interface Props {
    children: DualPopperChildren;
    className?: string;
    refClassName?: string;
    isOpen: boolean;
    onBlur: () => void;
    placement?: Placement;
    modifiers?: { [k: string]: any };
    useVisibility?: boolean;
}

export const Menu = ({children, className, refClassName, isOpen, onBlur, placement, modifiers, useVisibility}: Props) => {
    placement = placement ?? "bottom-end";
    useVisibility = useVisibility ?? false;

    const ref = React.useRef<HTMLDivElement>();
    const renderMenu = isOpen || useVisibility;
    const hidden = !isOpen && useVisibility;
    const fullModifiers = {
        preventOverflow: {
            boundariesElement: document.getElementById(AdminCommon.config.rootId),
            padding: 5
        },
        ...modifiers
    };
    const closeMenu = useCallback(() => {
        if (isOpen) {
            onBlur();
        }
    }, [isOpen, onBlur]);

    const handlePopperKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case "ArrowDown":
                break;
            case "Escape":
                closeMenu();
                break;
            default:
                return;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    useDetectOutsideClick(ref, closeMenu, [ref], [isOpen]);
    useDetectTabOut([ref], closeMenu);

    return (
        <div ref={ref} className={classList("menu__ref", refClassName)}>
            <Manager>
                <Reference>
                    {(props) => children[0](props)}
                </Reference>
                <Popper placement={placement}
                        positionFixed={true}
                        modifiers={fullModifiers}>
                    {
                        ({ref, style, placement}) => !renderMenu ? null : (
                            <div ref={ref}
                                 className="menu"
                                 style={menuStyles(style, hidden)}
                                 data-placement={placement}
                                 onKeyDown={handlePopperKey}>
                                <div className={"menu__container" + (className ? " " + className : "")}>
                                    {children[1]}
                                </div>
                            </div>
                        )
                    }
                </Popper>
            </Manager>
        </div>
    );
};

interface StatefulMenuProps {
    children: [(props: { ref: Ref<any>, openMenu: () => void }) => ReactNode, ReactNode];
    className?: string;
    refClassName?: string;
    placement?: Placement;
    modifiers?: { [k: string]: any };
    useVisibility?: boolean;
}

export function StatefulMenu({children, ...props}: StatefulMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openMenu = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);
    const context = {openMenu, closeMenu};

    return (
        <StatefulMenu.Context.Provider value={context}>
            <Menu isOpen={isOpen} onBlur={closeMenu} {...props}>
                {({ref}) => children[0]({ref, openMenu})}

                {children[1]}
            </Menu>
        </StatefulMenu.Context.Provider>
    );
}

export namespace StatefulMenu {
    export const Context = React.createContext({
        openMenu: null,
        closeMenu: null,
    });
}

function menuStyles(style: CSSProperties, hidden: boolean): CSSProperties {
    return {
        ...style,
        opacity: 1,
        pointerEvents: "all",
        visibility: hidden ? "hidden" : "visible",
    };
}

interface ItemProps {
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    danger?: boolean;
}

export const MenuItem = ({children, onClick, disabled, active, danger}: ItemProps) => {
    const className = bemClass("menu__item", {
        "--disabled": disabled,
        "--active": active,
        "--danger": !disabled && danger,
    });

    return (
        <StatefulMenu.Context.Consumer>
            {({closeMenu}) => {
                const handleClick = () => {
                    closeMenu && closeMenu();
                    !active && !disabled && onClick && onClick();
                };

                return (
                    <div className={className}>
                        <button onClick={handleClick}>{children}</button>
                    </div>
                );
            }}
        </StatefulMenu.Context.Consumer>
    );
};

export const MenuContent = ({children}) => children;
export const MenuSeparator = () => <div className="menu__separator" />;
export const MenuStatic = ({children}: { children: ReactNode }) => <div className="menu__static">{children}</div>;
export const MenuHeading = ({children}: { children: ReactNode }) => <div className="menu__heading">{children}</div>;
