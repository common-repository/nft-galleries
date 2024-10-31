import React from "react";
import classes from "./WpMediaField.pcss";
import {WpUploadMedia} from "spotlight/admin-common/components/Wp/WpUploadMedia";
import {Button, ButtonType} from "spotlight/admin-common/components/Button";
import wp from "spotlight/admin-common/libs/wp";

interface Props {
    value: string;
    onChange: (url: string) => void;
    id?: string;
    title?: string;
    mediaType?: string;
    button?: string;
    buttonSet?: string;
    buttonChange?: string;
}

export const WpMediaField = ({id, title, mediaType, button, buttonSet, buttonChange, value, onChange}: Props) => {
    // If `button` prop is given, ignore `buttonSet` and `buttonChange`
    buttonSet = button === undefined ? buttonSet : button;
    buttonChange = button === undefined ? buttonChange : button;

    const hasValue = !!value;
    const buttonText = hasValue ? buttonChange : buttonSet;

    const handleSelect = (attachments: wp.media.Attachment[]) => {
        onChange && onChange(attachments[0].attributes.url);
    };

    const handleRemove = () => {
        onChange && onChange("");
    };

    return (
        <WpUploadMedia
            id={id}
            title={title}
            mediaType={mediaType}
            button={buttonText}
            value={value}
            onSelect={handleSelect}>
            {
                ({open}) => (
                    <div className={classes.wpMediaField}>
                        {hasValue && (
                            <div className={classes.preview} tabIndex={0} onClick={open} role="button">
                                <img src={value} alt="Custom profile picture" />
                            </div>
                        )}

                        <Button className={classes.selectBtn} type={ButtonType.SECONDARY} onClick={open}>
                            {buttonText}
                        </Button>

                        {hasValue && (
                            <Button className={classes.removeBtn} type={ButtonType.DANGER_LINK} onClick={handleRemove}>
                                Remove custom photo
                            </Button>
                        )}
                    </div>
                )
            }
        </WpUploadMedia>
    );
};
