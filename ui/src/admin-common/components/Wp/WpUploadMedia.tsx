import React, {ReactElement} from "react";
import wp from "spotlight/admin-common/libs/wp";
import {uniqueNum} from "spotlight/utils/numbers/uniqueNum";

interface ChildProps {
    open: () => void;
}

interface Props {
    id: string;
    value?: number | string | wp.media.Attachment;
    title: string;
    mediaType?: string;
    button?: string;
    multiple?: boolean;
    children: (props: ChildProps) => ReactElement;
    onOpen?: () => void;
    onClose?: () => void;
    onSelect?: (selected: wp.media.Attachment[]) => void;
}

export const WpUploadMedia = ({id, value, title, button, mediaType, multiple, children, onOpen, onClose, onSelect}: Props) => {
    id = id ?? "wp-media-" + uniqueNum();
    mediaType = mediaType ?? "";
    button = button ?? "Select";

    const frame = React.useRef<wp.media.Frame>();
    if (!frame.current) {
        frame.current = wp.media({
            id,
            title,
            library: {type: mediaType},
            button: {text: button},
            multiple,
        });
    }

    const handleOpen = () => {
        if (value) {
            const attachment = (typeof value === "object") ? value : wp.media.attachment(value);
            attachment.fetch();
            frame.current.state().get("selection").add(attachment ? [attachment] : []);
        }

        onOpen && onOpen();
    };

    const handleSelect = () => {
        const attachment = frame.current.state().get("selection");

        onSelect && onSelect(attachment.models);
    };

    const open = () => frame.current.open();

    onClose && frame.current.on("close", onClose);

    frame.current.on("open", handleOpen);
    frame.current.on("insert", handleSelect);
    frame.current.on("select", handleSelect);

    return <Children children={children} open={open} />
};

function Children({children, open}) {
    return children({open});
}
