import styles from "./FeedNameField.pcss";
import React, {ChangeEvent, KeyboardEvent} from "react";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {Menu, MenuContent, MenuStatic} from "spotlight/admin-common/components/Containers/Menu";
import {mergeRefs} from "spotlight/utils/jsx/mergeRefs";

interface Props {
    name: string;
    label: string;
    onDone?: (value: string) => void;
}

export function FeedNameField({name, label, onDone}: Props) {
    const labelRef = React.useRef<HTMLDivElement>();

    const [value, setValue] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);

    const startEditing = () => {
        setValue(name);
        setIsEditing(true);
    };

    const submitEdit = () => {
        setIsEditing(false);
        onDone && onDone(value);

        labelRef.current && labelRef.current.focus();
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleStaticKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "Enter":
            case " ":
                startEditing();
                break;
        }
    };

    const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case "Enter":
                submitEdit();
                break;
            case "Escape":
                cancelEdit();
                break;
            default:
                return;
        }

        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={styles.root}>
            <Menu isOpen={isEditing} onBlur={() => setIsEditing(false)} placement="bottom">
                {
                    ({ref}) => (
                        <div ref={mergeRefs(ref, labelRef)}
                             className={styles.staticContainer}
                             onClick={startEditing}
                             onKeyPress={handleStaticKeyPress}
                             tabIndex={0}
                             role="button">
                            <span className={styles.label}>{label}</span>
                            <Dashicon icon="edit" className={styles.editIcon} />
                        </div>
                    )
                }
                <MenuContent>
                    <MenuStatic>
                        <div className={styles.editContainer}>
                            <input type="text"
                                   value={value}
                                   onChange={handleChange}
                                   onKeyDown={handleEditKeyDown}
                                   autoFocus={true}
                                   placeholder="Feed name" />

                            <Button className={styles.doneBtn}
                                    type={ButtonType.PRIMARY}
                                    size={ButtonSize.NORMAL}
                                    onClick={submitEdit}>
                                <Dashicon icon="yes" />
                            </Button>
                        </div>
                    </MenuStatic>
                </MenuContent>
            </Menu>
        </div>
    );
}
