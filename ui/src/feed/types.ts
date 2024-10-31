import {ComponentType} from "react"
import {ButtonDesign, Color} from "spotlight/utils/design"
import {ResponsiveProps} from "spotlight/utils/responsive"
import {Wallet} from "spotlight/common/modules/wallets"

// ------------------------------------------------------------------------------------------------------------------ //
// FEED STATE (the data used internally by the feed)
// ------------------------------------------------------------------------------------------------------------------ //

/**
 * The sources that are used in the feed.
 */
export type FeedSources = {
  wallets: Wallet[];
}

export type FeedDesign = {
  // LAYOUT
  layout: FeedLayout;
  numPosts: number;
  numColumns: number;
  showCollections: boolean;
  showNames: boolean;
  highlightFreq: number;
  sliderNumScrollPosts: number;
  sliderInfinite: boolean;
  sliderLoop: boolean;
  sliderArrowPos: SliderArrowPosition;
  sliderArrowSize: number;
  sliderArrowColor: Color;
  sliderArrowBgColor: Color;
  // BEHAVIOR
  linkBehavior: LinkBehavior;
  // APPEARANCE
  feedWidth: string;
  feedHeight: string;
  feedOverflowX: "auto" | undefined;
  feedOverflowY: "auto" | undefined;
  feedPadding: string;
  imgPadding: string;
  textSize: string;
  bgColor: Color;
  textColorHover: Color;
  bgColorHover: Color;
  hoverInfo: Set<HoverInfo>;
  // LOAD MORE BUTTON
  showLoadMoreBtn: boolean;
  loadMoreBtnText: string;
  loadMoreBtnDesign: ButtonDesign;
  loadMoreBtnScroll: boolean;
  autoload: boolean;
  // POPUP BOX
  lightboxShowSidebar: boolean;
  lightboxCtaStyle: PopupBoxCtaStyle;
  lightboxCtaDesign: ButtonDesign;
  lightboxShowTraits: boolean;
}

// ------------------------------------------------------------------------------------------------------------------ //
// FEED OPTIONS (the data provided by the consumer)
// ------------------------------------------------------------------------------------------------------------------ //

export type FeedOptions =
  SourceOptions &
  TemplateOptions &
  ResponsiveDesignOptions &
  ModerationOptions &
  FilterOptions &
  Partial<DeprecatedOptions>;

/**
 * The sources that are used in the feed.
 */
export type SourceOptions = {
  wallets: string[];
}

/** The template options for a feed */
export type TemplateOptions = {
  template?: string;
};

/** Responsive version of {@link DesignOptions} */
export type ResponsiveDesignOptions = ResponsiveProps<DesignOptions>;

/** The design of a feed. */
export type DesignOptions = {
  // LAYOUT
  postOrder: PostOrder;
  layout: string;
  numPosts: number;
  showCollections: boolean;
  showNames: boolean;
  numColumns: number;
  highlightFreq: number;
  sliderNumScrollPosts: number;
  sliderInfinite: boolean;
  sliderLoop: boolean;
  sliderArrowPos: SliderArrowPosition;
  sliderArrowSize: number;
  sliderArrowColor: Color;
  sliderArrowBgColor: Color;
  // BEHAVIOR
  linkBehavior: LinkBehavior;
  // APPEARANCE
  feedWidth: number;
  feedHeight: number;
  feedPadding: number;
  imgPadding: number;
  textSize: number;
  bgColor: Color;
  textColorHover: Color;
  bgColorHover: Color;
  hoverInfo: HoverInfo[];
  // LOAD MORE BUTTON
  showLoadMoreBtn: boolean;
  loadMoreBtnText: string;
  loadMoreBtnDesign: ButtonDesign;
  loadMoreBtnScroll: boolean;
  autoload: boolean;
  // POPUP BOX
  lightboxShowSidebar: boolean;
  lightboxCtaStyle: PopupBoxCtaStyle;
  lightboxCtaDesign: ButtonDesign;
  lightboxShowTraits: boolean;
};

/**
 * Options for the feed's moderation.
 * These are unused in the feed - moderation is a server-side operation.
 */
export type ModerationOptions = {
  moderation: string[];
  moderationMode: ModerationMode;
}

/**
 * Options for the feed's filtering.
 * These are unused in the feed - filtering is a server-side operation.
 */
export type FilterOptions = {
  hashtagWhitelist: string[];
  hashtagBlacklist: string[];
  captionWhitelist: string[];
  captionBlacklist: string[];
  hashtagWhitelistSettings: boolean;
  hashtagBlacklistSettings: boolean;
  captionWhitelistSettings: boolean;
  captionBlacklistSettings: boolean;
}

/**
 * These feed options are deprecated. This type exists so that the compiler can acknowledge that they exist
 * when we perform checks and JIT migrations for these options.
 */
export type DeprecatedOptions = {
  /** @deprecated Superseded by followBtnDesign */
  followBtnTextColor: Color;

  /** @deprecated Superseded by followBtnDesign */
  followBtnBgColor: Color;

  /** @deprecated Superseded by loadMoreBtnDesign */
  loadMoreBtnTextColor: Color;

  /** @deprecated Superseded by loadMoreBtnDesign */
  loadMoreBtnBgColor: Color;
};

// ------------------------------------------------------------------------------------------------------------------ //
// DATA TYPES
// ------------------------------------------------------------------------------------------------------------------ //

export type FeedLayout = ComponentType<any>;

export type FeedTemplate = Partial<ResponsiveDesignOptions>;

/**
 * The available arrow positions for the slider layout.
 */
export enum SliderArrowPosition {
  INSIDE = "inside",
  OUTSIDE = "outside",
}

/**
 * The available looping modes for the slider layout.
 */
export enum SliderLoopMode {
  NONE = "none",
  LOOP = "loop",
  INFINITE = "infinite",
}

/**
 * The available post order options.
 */
export enum PostOrder {
  DATE_ASC = "date_asc",
  DATE_DESC = "date_desc",
  POPULARITY_ASC = "popularity_asc",
  POPULARITY_DESC = "popularity_desc",
  RANDOM = "random",
}

/**
 * The available link behavior options
 */
export enum LinkBehavior {
  NOTHING = "nothing",
  SELF = "self",
  NEW_TAB = "new_tab",
  LIGHTBOX = "lightbox",
}

/**
 * The available hover info options.
 */
export enum HoverInfo {
  NAME = "name",
  DESCRIPTION = "desc"
}

/**
 * The available styles for the popup box CTA
 */
export enum PopupBoxCtaStyle {
  LINK = "link",
  BUTTON = "button",
}

/**
 * The available moderation mode options.
 */
export enum ModerationMode {
  WHITELIST = "whitelist",
  BLACKLIST = "blacklist",
}
