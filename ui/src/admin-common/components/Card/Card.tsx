import React, {ReactNode} from "react";
import classes from "./Card.pcss";

interface Props {
    imageUrl?: string;
    image?: ReactNode;
    title?: string;
    subtitle?: string;
    children?: ReactNode;
}

export function Card({imageUrl, image, title, subtitle, children}: Props) {
    return (
        <div className={classes.card}>
            {(imageUrl || title || subtitle) && (
                <div className={classes.side}>
                    {image !== undefined
                        ? <div className={classes.image}>{image}</div>
                        : imageUrl
                            ? <div className={classes.image} style={{backgroundImage: `url(${imageUrl})`}} />
                            : null
                    }

                    <div className={classes.titles}>
                        {title && <span className={classes.title}>{title}</span>}
                        {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
                    </div>
                </div>
            )}

            {children && (
                <div className={classes.side}>
                    {children}
                </div>
            )}
        </div>
    );
}
