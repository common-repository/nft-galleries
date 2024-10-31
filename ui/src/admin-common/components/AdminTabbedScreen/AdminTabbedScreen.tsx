import React, {ComponentType, ReactNode, useCallback} from "react";
import classes from "./AdminTabbedScreen.pcss";
import TabNavbar from "spotlight/admin-common/components/TabNavbar/TabNavbar";
import {NavItem, SpotlightNavbarLogo} from "spotlight/admin-common/components/GenericNavbar/GenericNavbar";
import {QueryRoute} from "spotlight/admin-common/components/QueryRoute";
import {useDispatch, useSelector} from "react-redux";
import {selectQueryParam} from "spotlight/admin-common/stores/router/selectors";
import {modifyRoute} from "spotlight/admin-common/stores/router";

export function AdminTabbedScreen({title, tabs}: AdminTabbedScreen.Props) {
    const dispatch = useDispatch();
    const tabParam = useSelector(selectQueryParam("tab"));
    const currTabId = tabParam ?? (tabs.length > 0 ? tabs[0].key : null);

    const changeTab = useCallback(tab => {
        dispatch(modifyRoute({tab}));
    }, [dispatch]);

    return (
        <div className={classes.screen}>
            <div className={classes.navbar}>
                <Navbar title={title} currTabId={currTabId} onChangeTab={changeTab}>
                    {{tabs}}
                </Navbar>
            </div>

            {tabs.map(tab => (
                <QueryRoute key={tab.key}
                            when="tab"
                            is={tab.key}
                            isRoot={tab.key == tabs[0].key}
                            render={() => (
                                <div className={tab.padded ? classes.contentPadded : classes.content}>
                                    <tab.component />
                                </div>
                            )}
                />
            ))}
        </div>
    );
}

export namespace AdminTabbedScreen {
    export type Tab = {
        key: string;
        label: string;
        component: ComponentType;
        padded?: boolean;
    };

    export interface Props {
        title: string;
        tabs: Tab[];
    }
}

type NavbarProps = {
    title: string;
    currTabId: string;
    onChangeTab: (tab: string) => void;
    children?: {
        tabs?: NavItem[];
        right?: ReactNode[];
    }
}

function Navbar({title, currTabId, onChangeTab, children}: NavbarProps) {
    children = children ?? {};

    return (
        <>
            <TabNavbar current={currTabId} onClickTab={onChangeTab}>
                {{
                    path: [
                        <SpotlightNavbarLogo key="logo" />,
                        <span key="screen-title">{title}</span>,
                    ],
                    tabs: children.tabs ?? [],
                    right: children.right ?? [],
                }}
            </TabNavbar>
        </>
    );
}
