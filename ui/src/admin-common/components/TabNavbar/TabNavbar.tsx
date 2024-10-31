import React, {ReactNode} from "react";
import styles from "./TabNavbar.pcss";
import GenericNavbar, {NavItem} from "spotlight/admin-common/components/GenericNavbar/GenericNavbar";
import {useKeyboardActivate} from "spotlight/utils/react/useKeyboardActivate";

interface Props {
    children: {
        path: Array<ReactNode>,
        tabs: Array<NavItem>,
        right: Array<ReactNode>
    };
    current?: string;
    onClickTab?: (key: string) => void;
}

export default function TabNavbar({children: {path, tabs, right}, current, onClickTab}: Props) {
    const changeTabHandler = (key) => () => onClickTab && onClickTab(key);

    return (
        <GenericNavbar pathStyle="chevron">
            {{
                path,
                right,
                left: tabs.map(tab => (
                    <Tab tab={tab}
                         key={tab.key}
                         isCurrent={tab.key === current}
                         onClick={changeTabHandler(tab.key)} />
                )),
            }}
        </GenericNavbar>
    );
};

interface TabProps {
    tab: NavItem;
    isCurrent: boolean;
    onClick: () => void;
}

function Tab({tab, isCurrent, onClick}: TabProps) {
    return (
        <a key={tab.key}
           role="button"
           tabIndex={0}
           className={tab.disabled ? styles.disabled : isCurrent ? styles.current : styles.tab}
           onClick={onClick}
           onKeyDown={useKeyboardActivate(onClick)}
        >
            <span className={styles.label}>
                {tab.label}
            </span>
        </a>
    );
}
