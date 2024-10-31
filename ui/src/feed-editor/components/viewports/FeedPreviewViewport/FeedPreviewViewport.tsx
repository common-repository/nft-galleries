import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
import classes from "spotlight/feed-editor/components/viewports/FeedPreviewViewport/FeedPreviewViewport.pcss"
import {useStore} from "react-redux"
import {Device} from "spotlight/utils/responsive"
import {TokenPopupBox} from "spotlight/feed/components/TokenPopupBox"
import {FeedState} from "spotlight/feed"
import {TokenFeed} from "spotlight/feed/components/TokenFeed"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"
import {SidebarLayout} from "spotlight/admin-common/components/SidebarLayout/SidebarLayout"
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener"
import {FeedEditorReloadEvent, useFeedEditorContext} from "spotlight/feed-editor/context"
import {AdminResources} from "spotlight/admin-common/modules/admin-resources"
import {objectsEqual} from "spotlight/utils/objects/objectsEqual"
import {FeedPreviewToolbar} from "spotlight/feed-editor/components/preview/FeedPreviewToolbar/FeedPreviewToolbar"
import {createFakeFeed} from "spotlight/feed-editor/fake-feed"
import {Onboarding} from "spotlight/admin-common/components/Containers/Onboarding"
import {selectWallet} from "spotlight/admin-common/stores/wallets/selectors"

type Props = {
  onClose?: () => void;
};

const entityResolver = (store) => ({
  getWallet: address => selectWallet(address)(store.getState()),
})

export function FeedPreviewViewport({onClose}: Props) {
  const rootRef = useRef<HTMLDivElement>()
  const frameRef = useRef<HTMLDivElement>()

  const isCollapsed = useContext(SidebarLayout.Context)

  // Get the feed options and preview device from the editor state
  const feedOptions = useEditorSelector(state => state.feedOptions)
  const device = useEditorSelector(state => state.previewDevice)

  // Get the fake preview data
  const fakePreview = useFeedEditorContext().config.fakePreview

  // Create a feed state object with the options and device from the store
  const store = useStore()
  const [feedState, setFeedState] = useState(() => new FeedState(feedOptions, device, entityResolver(store)))

  // Check if the store has accounts. If not, we use a fake feed for onboarding
  const showingFakePreview = !feedState.hasSources() && !feedState.isLoading()
  const fakeFeedState = useMemo(() => createFakeFeed(fakePreview, feedOptions, device), [feedOptions, device])

  // Handles a reload
  const doFeedStateLoad = useCallback(async (newState: FeedState, reload: Promise<FeedState>) => {
    setFeedState(newState)
    setFeedState(await reload)
  }, [setFeedState])

  // Handles a reset of the preview
  const handleReset = () => doFeedStateLoad(...feedState.load())

  // Update the feed state's device to match the one in the store
  useEffect(() => {
    if (device !== feedState.getDevice()) {
      setFeedState(feedState.withDevice(device))
    }
  }, [feedState, setFeedState, device])

  // Update the feed state's options to match those in the store
  useEffect(() => {
    if (!objectsEqual(feedOptions, feedState.getOptions())) {
      doFeedStateLoad(...feedState.withOptions(feedOptions))
    }
  }, [feedState, setFeedState, feedOptions, doFeedStateLoad])

  // Listen for reload events and reload the feed
  useDocumentEventListener(FeedEditorReloadEvent, () => doFeedStateLoad(...feedState.reload()))

  const numMediaShown = feedState.getTokens().length
  const numMediaTotal = feedState.getTotalNumTokens()
  const hasPostsToShow = numMediaShown > 0 || feedState.isLoading() || !feedState.isLoaded()
  const numPosts = feedState.getDesign().numPosts
  const isShowingMoreThanNumPost = numMediaShown > numPosts && numPosts > 0

  const isDesktop = device === Device.DESKTOP
  const isTablet = device === Device.TABLET
  const isPhone = device === Device.PHONE

  const className = isDesktop ? classes.root : classes.shrunkRoot
  const sizerClassName = isPhone ? classes.phoneSizer : isTablet ? classes.tabletSizer : classes.sizer

  const popupBoxContext = {
    target: isDesktop
      ? {current: rootRef?.current?.offsetParent.children[0]} // Targets the SidebarLayout__content element
      : frameRef,
  }

  return (
    <div className={className} ref={rootRef}>
      <FeedPreviewToolbar
        numShownPosts={numMediaShown}
        numTotalPosts={numMediaTotal}
        onReset={handleReset}
        onClose={onClose}
        showReset={!showingFakePreview && isShowingMoreThanNumPost}
        showNumPosts={!showingFakePreview}
        showDevices={fakeFeedState !== null || !showingFakePreview}
        isLoading={feedState.isDoingInitialLoad()}
        showCloseBtn={isCollapsed}
      />

      <div className={classes.container}>
        <TokenPopupBox.Context.Provider value={popupBoxContext}>
          {/* Sizer */}
          <div className={sizerClassName}>
            <div className={classes.sizerFrame} ref={frameRef}>
              {showingFakePreview
                ? (
                  fakeFeedState !== null
                    ? <TokenFeed state={fakeFeedState} autoLoad={false} />
                    : <OnboardingMessage />
                )
                : (
                  hasPostsToShow
                    ? <TokenFeed state={feedState} onUpdateState={setFeedState} autoLoad />
                    : <NoPostsMessage />
                )
              }
            </div>
          </div>
        </TokenPopupBox.Context.Provider>
      </div>
    </div>
  )
}

function NoPostsMessage() {
  return (
    <div className={classes.noPostsMsg}>
      <p>There are no NFTs to show. Here are a few things you can try:</p>
      <ol>
        <li>Make sure that your wallet address is correct.</li>
        <li>Check if your "Moderation" options.</li>
      </ol>
      <p>
        If you can't find the cause, please{" "}
        <a target="_blank" href={AdminResources.supportUrl}>contact support</a>.
      </p>
    </div>
  )
}

function OnboardingMessage() {
  return (
    <Onboarding className={classes.onboarding}>
      <div>
        <h1>
          Select a wallet to get{" "}
          <span className={classes.noBreak}>started{" "} →</span>
        </h1>
        <p>
          Your NFTs will be displayed instantly so you can easily design your feed using{" "}
          the live interactive preview.
        </p>
      </div>
    </Onboarding>
  )
}
