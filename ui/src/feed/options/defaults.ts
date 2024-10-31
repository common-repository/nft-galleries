import {FeedOptions, FilterOptions, HoverInfo, LinkBehavior, ModerationMode, ModerationOptions, PopupBoxCtaStyle, PostOrder, ResponsiveDesignOptions, SliderArrowPosition, SourceOptions, TemplateOptions} from "spotlight/feed/types"
import {ButtonDesign, Color, TextDesign} from "spotlight/utils/design"
import {rgba} from "spotlight/utils/colors/rgba"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {Responsive} from "spotlight/utils/responsive"

export const DefaultFeedSourceOptions: SourceOptions = {
    wallets: [],
}

export const DefaultFeedTemplateOptions: TemplateOptions = {
    template: undefined,
}

export const DefaultFeedDesignOptions: ResponsiveDesignOptions = {
    layout: null,
    numPosts: {desktop: 0},
    numColumns: {desktop: 3},
    showCollections: false,
    showNames: false,
    highlightFreq: {desktop: 7},
    sliderNumScrollPosts: {desktop: 1},
    sliderInfinite: true,
    sliderLoop: false,
    sliderArrowPos: {desktop: SliderArrowPosition.INSIDE},
    sliderArrowSize: {desktop: 20},
    sliderArrowColor: {r: 255, b: 255, g: 255, a: 1},
    sliderArrowBgColor: {r: 0, b: 0, g: 0, a: 0.8},
    postOrder: PostOrder.DATE_DESC,
    linkBehavior: {
        desktop: LinkBehavior.LIGHTBOX,
    },
    feedWidth: {desktop: 0},
    feedHeight: {desktop: 0},
    feedPadding: {desktop: 20, tablet: 14, phone: 10},
    imgPadding: {desktop: 14, tablet: 10, phone: 6},
    textSize: Responsive.create(0),
    bgColor: {r: 255, g: 255, b: 255, a: 0},
    hoverInfo: [],
    textColorHover: {r: 255, g: 255, b: 255, a: 1},
    bgColorHover: {r: 0, g: 0, b: 0, a: 0.5},
    lightboxShowSidebar: true,
    lightboxCtaStyle: PopupBoxCtaStyle.LINK,
    lightboxCtaDesign: {
        text: {
            color: Color.BLACK,
            align: TextDesign.Align.CENTER,
        },
        bgColor: rgba(230, 230, 230),
        border: {radius: 3},
    },
    lightboxShowTraits: true,
    showLoadMoreBtn: {desktop: false},
    loadMoreBtnDesign: withPartial(ButtonDesign.DEFAULT, {border: {radius: 3}}),
    loadMoreBtnText: "Load more",
    loadMoreBtnScroll: true,
    autoload: false,
}

export const DefaultFeedFilterOptions: FilterOptions = {
    hashtagWhitelist: [],
    hashtagBlacklist: [],
    captionWhitelist: [],
    captionBlacklist: [],
    hashtagWhitelistSettings: true,
    hashtagBlacklistSettings: true,
    captionWhitelistSettings: true,
    captionBlacklistSettings: true,
}

export const DefaultFeedModerationOptions: ModerationOptions = {
    moderation: [],
    moderationMode: ModerationMode.BLACKLIST,
}

export const DefaultFeedOptions: FeedOptions = {
    ...DefaultFeedSourceOptions,
    ...DefaultFeedTemplateOptions,
    ...DefaultFeedDesignOptions,
    ...DefaultFeedFilterOptions,
    ...DefaultFeedModerationOptions,
}
