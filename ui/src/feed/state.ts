import axios, {CancelTokenSource} from "axios"
import {cloneObj} from "spotlight/utils/objects/cloneObj"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {isPlainObject} from "spotlight/utils/objects/isPlainObject"
import {createCustomEvent} from "spotlight/utils/events/custom-event"
import {FetchFailEvent} from "spotlight/feed/events"
import {DesignOptions, FeedDesign, FeedOptions, FeedSources} from "spotlight/feed/types"
import {Device, Responsive} from "spotlight/utils/responsive"
import {DefaultFeedOptions} from "spotlight/feed/options/defaults"
import {debouncePromise} from "spotlight/utils/debounce"
import {FeedLayouts} from "spotlight/feed/registries/layouts"
import {RestApi} from "spotlight/common/modules/rest-api"
import {uniqueValues} from "spotlight/utils/arrays/uniqueValues"
import {Token} from "spotlight/common/modules/tokens"
import {Wallet} from "spotlight/common/modules/wallets"

type TokenFetchData = {
  tokens: Token[];
  total?: number;
}

// The time in milliseconds for the feed's reloading debounce
const DEBOUNCE_TIME = 300

export class FeedState {
  /** How to resolve external entities (example: accounts) */
  protected resolver: FeedEntityResolver = DefaultEntityResolver
  /** The local cache of feed tokens */
  protected tokenCache: Token[] = []
  /** The feed's options */
  protected options: FeedOptions
  /** The feed's sources */
  protected sources: FeedSources
  /** The feed's design */
  protected design: FeedDesign
  /** The current device mode */
  protected device: Device = Device.DESKTOP
  /** The total number of tokens available from the server */
  protected totalTokens: number = 0
  /** Whether the feed has performed its initial load */
  protected _isLoaded: boolean = false
  /** Whether the feed is loading */
  protected _isLoading: boolean = false
  /** Whether the feed is loading more tokens */
  protected _isLoadingMore: boolean = false
  /** The number of items the feed has loaded tokens */
  protected _numTimesLoaded: number = 0
  /** Token to cancel a fetch */
  protected fetchCancel: CancelTokenSource | null = null
  /** The debounce function for reloading the feed */
  protected reloadDebounce: () => Promise<FeedState>
  /** A hash of the options that is used to determine if a reload is required */
  protected reloadHash: string

  constructor(options: Partial<FeedOptions>, device: Device = Device.DESKTOP, resolver: FeedEntityResolver = DefaultEntityResolver) {
    this.device = device
    this.resolver = resolver
    this.setOptions(options)
    this.reloadHash = calculateFeedTokensHash(this.options)
  }

  clone(): FeedState {
    const clone = cloneObj(this)
    clone.fetchCancel = this.fetchCancel

    return clone
  }

  // ========== GETTERS ========== //

  getTokens(): Token[] {
    return this.tokenCache.slice(0, this.getNumTokensToShow())
  }

  getSources(): FeedSources {
    return this.sources
  }

  getDesign(): FeedDesign {
    return this.design
  }

  getOptions(): FeedOptions {
    return this.options
  }

  getDevice(): Device {
    return this.device
  }

  getTotalNumTokens(): number {
    return this.totalTokens
  }

  isLoaded(): boolean {
    return this._isLoaded
  }

  isLoading(): boolean {
    return this._isLoading || this._isLoadingMore
  }

  isDoingInitialLoad(): boolean {
    return !this._isLoaded && this._isLoading && !this._isLoading
  }

  isLoadingMore(): boolean {
    return this._isLoadingMore
  }

  canLoadMore(): boolean {
    return this.tokenCache.length > this.getNumTokensToShow() || this.tokenCache.length < this.totalTokens
  }

  getNumTokensPerLoad(): number {
    if (Responsive.isMap(this.options.numPosts)) {
      return Math.max(
        this.options.numPosts.desktop ?? 0,
        this.options.numPosts.tablet ?? 0,
        this.options.numPosts.phone ?? 0,
      )
    } else {
      return this.design.numPosts
    }
  }

  getNumTimesLoaded(): number {
    return this._numTimesLoaded
  }

  getNumTokensToShow(): number {
    return (this.design.numPosts > 0)
      ? this._numTimesLoaded * this.design.numPosts
      : this.totalTokens
  }

  hasSources(): boolean {
    return this.sources.wallets.length > 0
  }

  isLimitingPosts(): boolean {
    return this.options.moderation.length > 0 ||
      this.options.hashtagBlacklist.length > 0 ||
      this.options.hashtagWhitelist.length > 0 ||
      this.options.captionBlacklist.length > 0 ||
      this.options.captionWhitelist.length > 0
  }

  // ========== SETTERS ========== //

  withOptions(options: Partial<FeedOptions>) {
    const state = this.clone()
    state.setOptions(withPartial(this.options, options))

    return state.reload()
  }

  withDevice(device: Device): FeedState {
    if (device === this.device) {
      return this
    }

    const state = this.clone()
    state.device = device
    state.updateDesign()

    return state
  }

  // ========== ACTIONS ========== //

  reset(): FeedState {
    const newState = this.clone()
    newState._numTimesLoaded = 1

    return newState
  }

  load(data?: TokenFetchData): [FeedState, Promise<FeedState>] {
    let newState: FeedState, promise: Promise<FeedState>

    if (data) {
      newState = this.clone()
      newState.processData(data)
      newState._isLoading = false
      newState._isLoaded = true
      newState._numTimesLoaded = 1

      return [newState, Promise.resolve(newState)]
    } else {
      [newState, promise] = this.fetchTokens(0, this.getNumTokensPerLoad(), true)

      promise = promise.then(newerState => {
        newerState._isLoaded = true
        newerState._numTimesLoaded = 1

        return newerState
      })

      return [newState, promise]
    }
  }

  loadMore(): [FeedState, Promise<FeedState>] {
    const numTokensToLoad = this.getNumTokensPerLoad()
    const newNumToken = this.getNumTokensToShow() + numTokensToLoad
    const numToFetch = newNumToken - this.tokenCache.length

    let newState: FeedState, promise: Promise<FeedState>

    if (numToFetch <= 0) {
      newState = this.clone()
      promise = Promise.resolve(this)
    } else {
      [newState, promise] = this.fetchTokens(this.tokenCache.length, numTokensToLoad)
      newState._isLoadingMore = true
    }

    promise = promise.then(newerState => {
      newerState._isLoadingMore = false
      newerState._numTimesLoaded++

      return newerState
    })

    return [newState, promise]
  }

  reload(force: boolean = false): [FeedState, Promise<FeedState>] {
    if (!force) {
      const newReloadHash = calculateFeedTokensHash(this.options)
      const sameReloadHash = this.reloadHash === newReloadHash
      const numToShow = this.getNumTokensToShow()
      const hasSufficientCache = numToShow <= this.tokenCache.length
      const isShowingAllPosts = hasSufficientCache && this.tokenCache.length >= this.totalTokens

      // If the options didn't change such that a reload is required, do not reload
      if (sameReloadHash && (hasSufficientCache || isShowingAllPosts)) {
        return [this, Promise.resolve(this)]
      }
    }

    this.reloadDebounce = debouncePromise<FeedState>(DEBOUNCE_TIME)

    const [newState, promise] = this.load()
    promise.then(state => {
      state.reloadHash = calculateFeedTokensHash(this.options)

      return state
    })

    return [newState, promise]
  }

  cancelLoad() {
    if (this.fetchCancel) {
      this.fetchCancel.cancel()
    }
  }

  protected fetchTokens(from: number, num: number, replace?: boolean): [FeedState, Promise<FeedState>] {
    this.cancelLoad()
    this.fetchCancel = axios.CancelToken.source()

    const newState = this.clone()

    if (!this.hasSources()) {
      newState.tokenCache = []
      newState.totalTokens = 0

      return [newState, Promise.resolve(newState)]
    }

    newState._isLoading = true

    const promise = new Promise<FeedState>((resolve, reject) => {
      const newerState = newState.clone()

      RestApi.tokens.get(this.options, from, num, this.fetchCancel)
        .finally(() => newerState._isLoading = false)
        .then(response => {
          if (isPlainObject(response?.data) && Array.isArray(response.data?.tokens)) {
            newerState.processData(response.data, !!replace)
            resolve(newerState)

            return newerState
          } else {
            throw {message: "The tokens response is malformed or corrupt", response}
          }
        })
        .catch((error) => {
          if (axios.isCancel(error) || error.response === undefined) {
            return null
          }

          document.dispatchEvent(createCustomEvent<FetchFailEvent.Data>(FetchFailEvent.Type, {
            state: newerState,
            message: (error.response ? error.response.data.message : undefined) ?? error.message,
            response: error.response,
          }))

          reject(error)

          return error
        })
    })

    return [newState, promise]
  }

  /* Processes fetch data and sets the appropriate information to the state */
  protected processData(data: TokenFetchData, reset?: boolean) {
    if (reset) {
      this.tokenCache = []
    }

    this.addToCache(data.tokens)
    this.totalTokens = data.total ?? data.tokens.length
  }

  /** Adds tokens to the cache, ensuring the cache doesn't contain duplicates  */
  protected addToCache(tokens: Token[]) {
    tokens.forEach(m => {
      if (!this.tokenCache.some(cached => cached.id == m.id)) {
        this.tokenCache.push(m)
      }
    })
  }

  protected setOptions(options: Partial<FeedOptions>) {
    this.options = withPartial(DefaultFeedOptions, options)
    this.sources = FeedState.getSources(this.options, this.resolver)
    this.updateDesign()
  }

  public static getSources(options: FeedOptions, resolver: FeedEntityResolver): FeedSources {
    return {
      wallets: uniqueValues(options.wallets).map(resolver.getWallet).filter(a => !!a),
    }
  }

  protected updateDesign() {
    // @ts-ignore
    const design: DesignOptions = {}
    Object.keys(this.options).forEach(key => {
      design[key] = Responsive.get(this.options[key], this.device, key !== "textSize")
    })

    const isDesktop = this.device === Device.DESKTOP

    // Normalize responsive options so that empty tablet and phone values default to the desktop value
    if (!isDesktop) {
      design.numPosts = design.numPosts <= 0 && Responsive.isMap(this.options.numPosts)
        ? this.options.numPosts.desktop
        : design.numPosts

      design.numColumns = design.numColumns <= 0 && Responsive.isMap(this.options.numColumns)
        ? this.options.numColumns.desktop
        : design.numColumns
    }

    const numPosts = Math.max(0, design.numPosts)
    const numColumns = Math.max(1, design.numColumns)

    const feedWidth = !!design.feedWidth ? design.feedWidth + "px" : "100%"
    const feedHeight = !!design.feedHeight ? design.feedHeight + "px" : "100%"
    const feedOverflowX = !!design.feedWidth ? "auto" : undefined
    const feedOverflowY = !!design.feedHeight ? "auto" : undefined
    const feedPadding = this.normalizeCssSize(this.options.feedPadding, "0")
    const imgPadding = this.normalizeCssSize(this.options.imgPadding, "0")
    const textSize = this.normalizeCssSize(this.options.textSize, "inherit", true)

    this.design = {
      // LAYOUT
      layout: FeedLayouts.get(design.layout ?? "grid"),
      numPosts,
      numColumns,
      showCollections: design.showCollections,
      showNames: design.showNames,
      highlightFreq: design.highlightFreq,
      sliderNumScrollPosts: design.sliderNumScrollPosts,
      sliderInfinite: design.sliderInfinite,
      sliderLoop: design.sliderLoop,
      sliderArrowPos: design.sliderArrowPos,
      sliderArrowSize: design.sliderArrowSize,
      sliderArrowColor: design.sliderArrowColor,
      sliderArrowBgColor: design.sliderArrowBgColor,
      // BEHAVIOR
      linkBehavior: design.linkBehavior,
      // APPEARANCE
      feedWidth,
      feedHeight,
      feedOverflowX,
      feedOverflowY,
      imgPadding,
      textSize,
      feedPadding,
      bgColor: design.bgColor,
      textColorHover: design.textColorHover,
      bgColorHover: design.bgColorHover,
      hoverInfo: new Set(design.hoverInfo),
      lightboxShowSidebar: design.lightboxShowSidebar,
      lightboxCtaStyle: design.lightboxCtaStyle,
      lightboxShowTraits: design.lightboxShowTraits,
      lightboxCtaDesign: design.lightboxCtaDesign,
      showLoadMoreBtn: design.showLoadMoreBtn,
      loadMoreBtnDesign: design.loadMoreBtnDesign,
      loadMoreBtnText: design.loadMoreBtnText,
      loadMoreBtnScroll: design.loadMoreBtnScroll,
      autoload: design.autoload,
    }
  }

  protected normalizeCssSize(value: Responsive<number>, def: string = null, defDesktop: boolean = false): string | null {
    const size = Responsive.get(value, this.device, defDesktop)

    return size ? size + "px" : def
  }
}

export type FeedEntityResolver = {
  getWallet: (address: string) => Wallet | undefined;
};

export namespace FeedEntityResolver {
  export function forFrontApp(wallets: Wallet[]): FeedEntityResolver {
    return {
      getWallet(address: string) {
        return wallets.find(wallet => wallet.address === address)
      },
    }
  }
}

const DefaultEntityResolver: FeedEntityResolver = {
  getWallet: () => undefined,
}

/* Generates a hash for the feed options that affect which tokens are shown in a feed */
export function calculateFeedTokensHash(feedOptions: FeedOptions) {
  return JSON.stringify({
    wallets: feedOptions.wallets,
    // numPosts: feedOptions.numPosts,
    postOrder: feedOptions.postOrder,
    moderation: feedOptions.moderation,
    moderationMode: feedOptions.moderationMode,
    hashtagBlacklist: feedOptions.hashtagBlacklist,
    hashtagWhitelist: feedOptions.hashtagWhitelist,
    captionBlacklist: feedOptions.captionBlacklist,
    captionWhitelist: feedOptions.captionWhitelist,
    hashtagBlacklistSettings: feedOptions.hashtagBlacklistSettings,
    hashtagWhitelistSettings: feedOptions.hashtagWhitelistSettings,
    captionBlacklistSettings: feedOptions.captionBlacklistSettings,
    captionWhitelistSettings: feedOptions.captionWhitelistSettings,
  })
}
