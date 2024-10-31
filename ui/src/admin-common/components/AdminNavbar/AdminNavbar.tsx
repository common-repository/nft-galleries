import React, {ComponentType, CSSProperties, ReactNode} from "react"
import {useSelector} from "react-redux"
import {Navbar} from "spotlight/admin-common/components/Navbar/Navbar"
import {Screens} from "spotlight/admin-common/stores/ScreensStore"
import {selectScreen} from "spotlight/admin-common/stores/router/selectors"
import {AdminResources} from "spotlight/admin-common/modules/admin-resources"

interface Props {
    right?: ComponentType;
    children?: ReactNode;
    chevron?: boolean;
}

const helpContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginRight: 25,
};

const helpLinkStyle: CSSProperties = {
    textDecoration: "none",
};

export default function AdminNavbar({right, chevron, children}: Props) {
    const currScreenId = useSelector(selectScreen);
    const link = <Navbar.Item>{Screens.getScreen(currScreenId)?.title ?? ""}</Navbar.Item>;

    return (
        <Navbar>
            <>
                {link}

                {chevron && <Navbar.Chevron />}

                {children}
            </>
            {right
                ? React.createElement(right)
                : <>
                    <div style={helpContainerStyle}>
                        <a href={AdminResources.supportUrl} target="_blank" style={helpLinkStyle}>
                            <span>Need help?</span>
                        </a>
                    </div>
                </>
            }
        </Navbar>
    );
}
