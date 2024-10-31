import {BlockConfiguration} from "@wordpress/blocks"
import {SnftWpBlockEdit} from "spotlight/wp-block/components/SnftWpBlockEdit/SnftWpBlockEdit"

export interface BlockAttributes {
    galleryId: number;
}

export const WpBlockConfig = {
    title: "NFT Gallery",
    description: "Embed an NFT Gallery",
    category: "widgets",
    icon: "format-gallery",
    keywords: [
        "nft",
        "gallery",
        "erc721",
        "token",
        "crypto",
    ],
    attributes: {
        galleryId: {
            type: "number",
        },
    },
    supports: {
        // Removes support for an HTML mode.
        html: false,
    },
    edit: SnftWpBlockEdit,
} as BlockConfiguration<BlockAttributes>
