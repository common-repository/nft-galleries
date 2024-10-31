import React, {ReactNode} from "react";
import classes from "./Message.pcss";
import {classList} from "spotlight/utils/jsx/classes";
import {Dashicon, DashiconTy} from "spotlight/common/components/Dashicon";

export enum MessageType {
    SUCCESS = "success",
    INFO = "info",
    PRO_TIP = "pro-tip",
    WARNING = "warning",
    ERROR = "error",
    GREY = "grey"
}

interface Props {
    children?: ReactNode;
    type: MessageType;
    showIcon?: boolean;
    shake?: boolean;
    isDismissible?: boolean;
    onDismiss?: () => void;
}

export const Message = ({children, type, showIcon, shake, isDismissible, onDismiss}: Props) => {
    const [dismissed, setDismissed] = React.useState(false);

    const handleClick = () => {
        if (isDismissible) {
            setDismissed(true);
            onDismiss && onDismiss();
        }
    };

    const className = classList(
        classes[type],
        shake ? classes.shaking : null
    );

    return dismissed ? null : (
        <div className={className}>
            {!showIcon ? null : (
                <div>
                    <Dashicon className={classes.icon} icon={getIconFor(type)} />
                </div>
            )}

            <div className={classes.content}>
                {children}
            </div>

            {!isDismissible ? null : (
                <button className={classes.dismissBtn} onClick={handleClick}>
                    <Dashicon icon="no" />
                </button>
            )}
        </div>
    );
};

/**
 * Retrieves the appropriate dashicon for a given message type.
 *
 * @param type
 */
function getIconFor(type: MessageType): DashiconTy {
    switch (type) {
        case MessageType.SUCCESS:
            return "yes-alt";
        case MessageType.PRO_TIP:
            return "lightbulb";
        case MessageType.ERROR:
        case MessageType.WARNING:
            return "warning";
        case MessageType.INFO:
        default:
            return "info";
    }
}
