import React, {ReactNode} from "react";
import styles from "./HelpTooltip.pcss";
import {Dashicon} from "spotlight/common/components/Dashicon";
import Tooltip from "spotlight/admin-common/components/Tooltip/Tooltip";

interface Props {
    maxWidth?: number;
    children: ReactNode;
}

export default function HelpTooltip({maxWidth, children}: Props) {
    maxWidth = maxWidth ?? 300;

    const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);

    const handleMouseOver = () => setIsTooltipVisible(true);
    const handleMouseOut = () => setIsTooltipVisible(false);

    const tooltipTheme = {
        content: styles.tooltipContent,
        container: styles.tooltipContainer,
    };

    return (
        <div className={styles.root}>
            <Tooltip visible={isTooltipVisible} theme={tooltipTheme}>
                {
                    ({ref}) => (
                        <span ref={ref}
                              className={styles.icon}
                              style={{opacity: isTooltipVisible ? 1 : 0.7}}
                              onMouseEnter={handleMouseOver}
                              onMouseLeave={handleMouseOut}>
                            <Dashicon icon="info" />
                        </span>
                    )
                }

                <div style={{maxWidth: maxWidth + "px"}}>{children}</div>
            </Tooltip>
        </div>
    );
};
