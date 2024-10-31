import React, {ReactNode} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {Feed} from "spotlight/admin-common/stores/feeds";
import {useDispatch} from "react-redux";
import {showToast} from "spotlight/admin-common/stores/toasts";

interface Props {
    feed: Feed;
    onCopy?: Function;
    children?: ReactNode;
}

export const CopyShortcode = ({feed, onCopy, children}: Props) => {
    const dispatch = useDispatch();

    const handleCopy = () => {
        dispatch(showToast({
            key: "feeds/shortcode/copied",
            message: "Copied shortcode to clipboard.",
        }));

        onCopy && onCopy();
    };

    return (
        <CopyToClipboard text={`[nft-gallery gallery="${feed.id}"]`} onCopy={handleCopy}>
            {children}
        </CopyToClipboard>
    );
};
