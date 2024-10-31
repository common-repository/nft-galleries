import React, {ReactNode} from "react";
import styles from "./ModalPrompt.pcss";
import {Modal} from "spotlight/admin-common/components/Modal/Modal";
import {Button, ButtonType} from "spotlight/admin-common/components/Button";

interface Props {
    isOpen: boolean;
    title: string;
    children?: string | ReactNode;
    buttons?: [string, string];
    okDisabled?: boolean;
    cancelDisabled?: boolean;
    onAccept?: () => void;
    onCancel?: () => void;
}

export default function ModalPrompt({children, title, buttons, onAccept, onCancel, isOpen, okDisabled, cancelDisabled}: Props) {
    buttons = buttons ?? ["OK", "Cancel"];

    const accept = () => onAccept && onAccept();
    const cancel = () => onCancel && onCancel();

    return (
        <Modal isOpen={isOpen} title={title} onClose={cancel} className={styles.root}>
            <Modal.Content>
                {typeof children === "string"
                    ? <p>{children}</p>
                    : children
                }
            </Modal.Content>

            <Modal.Footer>
                <Button className={styles.button}
                        type={ButtonType.SECONDARY}
                        onClick={cancel}
                        disabled={cancelDisabled}>
                    {buttons[1]}
                </Button>
                <Button className={styles.button}
                        type={ButtonType.PRIMARY}
                        onClick={accept}
                        disabled={okDisabled}>
                    {buttons[0]}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
