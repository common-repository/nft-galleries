import React, {ReactNode, useState} from "react";
import classes from "./SidebarLayout.pcss";
import {Dashicon, DashiconTy} from "spotlight/common/components/Dashicon";
import {ResponsiveContainer, ResponsiveContext} from "spotlight/admin-common/components/ResponsiveContainer/ResponsiveContainer";

export function SidebarLayout(props: SidebarLayout.Props) {
    return (
        <ResponsiveContainer breakpoints={[SidebarLayout.BREAKPOINT]}>
            <SidebarLayoutInner {...props} />
        </ResponsiveContainer>
    );
}

function SidebarLayoutInner({content, sidebar, primary, current, useDefaults}: SidebarLayout.Props) {
    const [state, setState] = useState<"sidebar" | "content">(primary);
    const breakpoint = React.useContext(ResponsiveContext);
    const isCollapsed = breakpoint <= SidebarLayout.BREAKPOINT;

    primary = primary ?? "content";
    current = useDefaults ? state : current;

    const gotoPrimary = () => setState(isContentPrimary ? "content" : "sidebar");
    const gotoSecondary = () => setState(isContentPrimary ? "sidebar" : "content");

    const isContentPrimary = (primary === "content");
    const isSidebarPrimary = (primary === "sidebar");
    const isShowingContent = (current === "content");
    const isShowingSidebar = (current === "sidebar");

    const className = isContentPrimary
        ? classes.layoutPrimaryContent
        : classes.layoutPrimarySidebar;

    return (
        <div className={className}>
            <SidebarLayout.Context.Provider value={isCollapsed}>
                {content && (isShowingContent || !isCollapsed) && (
                    <div className={classes.content}>
                        {useDefaults && (
                            <SidebarLayout.Navigation
                                align={isContentPrimary ? "right" : "left"}
                                text={!isContentPrimary && <span>Go back</span>}
                                icon={isContentPrimary ? "admin-generic" : "arrow-left"}
                                onClick={isContentPrimary ? gotoSecondary : gotoPrimary}
                            />
                        )}

                        {content ?? null}
                    </div>
                )}

                {sidebar && (isShowingSidebar || !isCollapsed) && (
                    <div className={classes.sidebar}>
                        {useDefaults && (
                            <SidebarLayout.Navigation
                                align={isSidebarPrimary ? "right" : "left"}
                                text={!isSidebarPrimary && <span>Go back</span>}
                                icon={isSidebarPrimary ? "admin-generic" : "arrow-left"}
                                onClick={isSidebarPrimary ? gotoSecondary : gotoPrimary}
                            />
                        )}

                        {sidebar ?? null}
                    </div>
                )}
            </SidebarLayout.Context.Provider>
        </div>
    );
}

export namespace SidebarLayout {
    export const BREAKPOINT = 968;

    export const Context = React.createContext(false);

    export type Props = {
        content?: ReactNode;
        sidebar?: ReactNode;
        current?: "sidebar" | "content";
        primary?: "sidebar" | "content";
        useDefaults?: boolean;
    };

    export type NavigationProps = {
        icon?: DashiconTy;
        text?: ReactNode;
        align?: "left" | "right";
        onClick?: () => void;
    };

    export function Navigation({icon, text, align, onClick}: NavigationProps) {
        text = text ?? "Go back";
        icon = icon ?? "arrow-left-alt";
        align = align ?? "left";

        return (
            <div className={align === "right" ? classes.navigationRight : classes.navigationLeft}>
                <a className={classes.navLink} onClick={onClick}>
                    {icon && <Dashicon icon={icon} />}
                    <span>{text ?? ""}</span>
                </a>
            </div>
        );
    }
}
