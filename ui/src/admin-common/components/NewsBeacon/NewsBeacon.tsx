import React from "react";
import classes from "./NewsBeacon.pcss";
import {useDispatch, useSelector} from "react-redux";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {useKeyboardActivate} from "spotlight/utils/react/useKeyboardActivate";
import {Menu, MenuContent} from "spotlight/admin-common/components/Containers/Menu";
import {selectIsNewsHidden, selectIsNewsOpen, selectNewsMessages} from "spotlight/admin-common/stores/news/selectors";
import {closeNews, hideNews, openNews} from "spotlight/admin-common/stores/news";
import {NewsBeaconMessage} from "spotlight/admin-common/components/NewsBeaconMessage/NewsBeaconMessage";

export function NewsBeacon() {
    const dispatch = useDispatch();
    const messages = useSelector(selectNewsMessages);
    const isHidden = useSelector(selectIsNewsHidden);
    const isOpen = useSelector(selectIsNewsOpen);

    const hide = () => dispatch(hideNews());
    const openMenu = () => dispatch(openNews());
    const closeMenu = () => dispatch(closeNews());

    const handleKey = useKeyboardActivate(openMenu);

    const beacon = ({ref}) => (
        <div ref={ref} className={classes.beacon}>
            <button className={classes.button} onClick={openMenu} onKeyPress={handleKey}>
                <Dashicon icon="megaphone" />

                {messages.length > 0 && (
                    <div className={classes.counter}>{messages.length}</div>
                )}
            </button>
        </div>
    );

    return !isHidden && messages.length > 0 && (
        <Menu className={classes.menu} isOpen={isOpen} onBlur={closeMenu} placement="top-end">
            {beacon}
            <MenuContent>
                {messages.map(message => (
                    <NewsBeaconMessage key={message.id} message={message} />
                ))}

                {isOpen && (
                    <a className={classes.hideLink} onClick={hide}>
                        Hide
                    </a>
                )}
            </MenuContent>
        </Menu>
    );
}
