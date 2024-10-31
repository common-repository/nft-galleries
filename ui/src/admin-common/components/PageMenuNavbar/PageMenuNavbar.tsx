import React, {ReactNode} from "react";
import styles from "./PageMenuNavbar.pcss";
import GenericNavbar, {NavItem} from "spotlight/admin-common/components/GenericNavbar/GenericNavbar";
import {Button, ButtonType} from "spotlight/admin-common/components/Button";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {Menu, MenuContent, MenuItem} from "spotlight/admin-common/components/Containers/Menu";

interface Props {
    pages: Array<NavItem>,
    current: string;
    onChangePage?: (string) => void;
    showNavArrows?: boolean;
    hideMenuArrow?: boolean;
    children: {
        path: Array<ReactNode>;
        right: Array<ReactNode>;
    };
}

export default function PageMenuNavbar({pages, current, onChangePage, showNavArrows, hideMenuArrow, children}: Props) {
    const {path, right} = children;

    const currIdx = pages.findIndex(page => page.key === current) ?? 0;
    const currPage = pages[currIdx];
    const label = currPage.label ?? "";

    const isFirstPage = currIdx <= 0;
    const isLastPage = currIdx >= (pages.length - 1);

    const prevPage = isFirstPage ? null : pages[currIdx - 1];
    const nextPage = isLastPage ? null : pages[currIdx + 1];

    const gotoPrevPage = () => !isFirstPage && onChangePage && onChangePage(pages[currIdx - 1].key);
    const gotoNextPage = () => !isLastPage && onChangePage && onChangePage(pages[currIdx + 1].key);
    const changePage = (page) => onChangePage && onChangePage(page);

    let left = [];
    if (showNavArrows) {
        left.push(
            <Button key={"page-menu-left"}
                    type={ButtonType.PILL}
                    onClick={gotoPrevPage}
                    disabled={isFirstPage || prevPage.disabled}>
                <Dashicon icon="arrow-left-alt2" />
            </Button>,
        );
    }

    left.push(
        <PagesMenu key={"page-menu"} pages={pages} current={current} onClickPage={changePage}>
            <span>{label}</span>
            {!hideMenuArrow && (
                <Dashicon icon="arrow-down-alt2" className={styles.arrowDown} />
            )}
        </PagesMenu>,
    );

    if (showNavArrows) {
        left.push(
            <Button key={"page-menu-left"}
                    type={ButtonType.PILL}
                    onClick={gotoNextPage}
                    disabled={isLastPage || nextPage.disabled}>
                <Dashicon icon="arrow-right-alt2" />
            </Button>,
        );
    }

    return (
        <GenericNavbar pathStyle={(path.length > 1) ? "line" : "none"}>
            {{
                path,
                right,
                center: left,
            }}
        </GenericNavbar>
    );
};

interface PagesMenuProps {
    current: string;
    onClickPage?: (key) => void;
    pages: Array<NavItem>;
    children: ReactNode;
}

function PagesMenu({pages, current, onClickPage, children}: PagesMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const itemClickHandler = (key) => () => {
        onClickPage && onClickPage(key);
        close();
    };

    return (
        <Menu isOpen={isOpen} onBlur={close} placement="bottom-start" refClassName={styles.menuRef}>
            {
                ({ref}) => (
                    <a ref={ref} className={styles.menuLink} onClick={open}>
                        {children}
                    </a>
                )
            }
            <MenuContent>
                {pages.map(item => (
                    <MenuItem key={item.key}
                              disabled={item.disabled}
                              active={item.key === current}
                              onClick={itemClickHandler(item.key)}>
                        {item.label}
                    </MenuItem>
                ))}
            </MenuContent>
        </Menu>
    );
}
