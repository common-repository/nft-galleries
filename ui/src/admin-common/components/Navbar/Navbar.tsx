import React, {KeyboardEvent, ReactElement, ReactNode} from "react";
import styles from "./Navbar.pcss";
import {Link as RouterLink} from "spotlight/admin-common/components/Link";
import {classMap} from "spotlight/utils/jsx/classes";
import {ProPill as OgProPill} from "spotlight/admin-common/components/ProPill/ProPill";
import {SpotlightLogo} from "spotlight/admin-common/components/SpotlightLogo/SpotlightLogo";
import {ParsedQuery} from "query-string";

interface Props {
    children: [ReactElement, ReactElement | null];
}

export function Navbar({children}: Props) {
    return (
        <div className={styles.root}>
            <Navbar.LogoItem />

            <div className={styles.leftContainer}>
                {children[0]}
            </div>

            {children[1] && (
                <div className={styles.rightContainer}>
                    {children[1]}
                </div>
            )}
        </div>
    );
}

export namespace Navbar {
    interface ItemProps {
        children?: ReactNode;
    }

    export const LogoItem = () => (
        <>
            <div className={styles.item}>
                <SpotlightLogo />
            </div>

            <Chevron />
        </>
    );

    export const Item = ({children}: ItemProps) => (
        <div className={styles.item}>
            {children}
        </div>
    );

    export const Section = ({children}: ItemProps) => (
        <div className={styles.section}>
            {children}
        </div>
    );

    interface LinkProps {
        linkTo?: ParsedQuery;
        onClick?: () => void;
        isCurrent?: boolean;
        isDisabled?: boolean;
        children: ReactNode;
    }

    export const Link = ({linkTo, onClick, isCurrent, isDisabled, children}: LinkProps) => {
        const className = classMap({
            [styles.link]: true,
            [styles.current]: isCurrent,
            [styles.disabled]: isDisabled,
        });

        const handleClick = () => !isDisabled && onClick && onClick();
        const handleKey = (e: KeyboardEvent<HTMLDivElement | HTMLLinkElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.currentTarget.click();
            }
        };

        const tabIndex = isDisabled ? -1 : 0;

        return (
            <Item>
                {linkTo ? (
                    <RouterLink to={linkTo}
                                className={className}
                                role="button"
                                onKeyPress={handleKey}
                                tabIndex={tabIndex}>
                        {children}
                    </RouterLink>
                ) : (
                    <div className={className}
                         role="button"
                         onClick={handleClick}
                         onKeyPress={handleKey}
                         tabIndex={tabIndex}>
                        {children}
                    </div>
                )}
            </Item>
        );
    };

    export const ProPill = () => (
        <div className={styles.proPill}>
            <OgProPill />
        </div>
    );

    export const Chevron = () => (
        <div className={styles.chevron}>
            <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
                <path d="M0 0 L100 50 L0 100" fill="none" stroke="currentcolor" strokeLinejoin="bevel" />
            </svg>
        </div>
    );
}
