import React, {useEffect} from "react"
import classes from "./SnftWpBlockEdit.pcss"
import {BlockEditProps} from "@wordpress/blocks"
import {BlockControls} from "@wordpress/block-editor"
import {SelectControl, Toolbar} from "@wordpress/components"
import {BlockAttributes} from "spotlight/wp-block/config"
import {Device} from "spotlight/utils/responsive"
import {Common} from "spotlight/common"
import {classList} from "spotlight/utils/jsx/classes"
import AdminCommon from "spotlight/admin-common/AdminCommon"
import {FeedState} from "spotlight/feed"
import {TokenFeed} from "spotlight/feed/components/TokenFeed"
import {Provider, useSelector} from "react-redux"
import {selectIsWpBlockLoaded} from "spotlight/wp-block/store/wp-block/selectors"
import {WpBlockStore} from "spotlight/wp-block/store"
import {selectFeedById, selectFeeds} from "spotlight/admin-common/stores/feeds/selectors"
import {LoadingSpinner} from "spotlight/admin-common/components/Wp/LoadingSpinner"
import {selectWallet} from "spotlight/admin-common/stores/wallets/selectors"

type Props = BlockEditProps<BlockAttributes>;

const FEED_SELECTOR_DEFAULT = {
  label: "- Choose a gallery -",
  value: "",
}

const NEW_FEED_PAGE = AdminCommon.config.adminUrl + "admin.php?page=snft&screen=new"

/**
 * The outer component. WordPress does not like this component being an observer, so this simply renders <Inner> inside
 * the store <Provider>.
 */
export function SnftWpBlockEdit(props: Props) {
  return (
    <Provider store={WpBlockStore}>
      <Inner {...props} />
    </Provider>
  )
}

/**
 * The inner component. This performs the actual rendering.
 */
function Inner({attributes, setAttributes, className}: Props) {
  const isLoaded = useSelector(selectIsWpBlockLoaded)
  const feeds = useSelector(selectFeeds)
  // The ID of the currently loaded gallery, used to prevent unnecessary re-loads of the same feed
  const loadedGalleryId = React.useRef<number>(null)
  // The feed state that is used to render the preview
  const [feedState, setFeedState] = React.useState<FeedState>(null)
  // Whether the block is prompting the user to select a feed
  const [isFeedSelectMode, setIsFeedSelectMode] = React.useState<boolean>(false)
  // Whether the block is set to show a feed that doesn't exist
  const [isMissingFeed, setIsMissingFeed] = React.useState<boolean>(false)

  useEffect(() => {
    // Load the feed only if the block store is loaded, the feed ID attribute was changed or no feed is loaded yet
    if (isLoaded) {
      loadFeed(attributes.galleryId)
    }
  }, [isLoaded, attributes.galleryId])

  /**
   * Loads a feed.
   *
   * @param galleryId The ID of the gallery to load.
   */
  function loadFeed(galleryId: number) {
    if (!galleryId) {
      // If no feed ID is set and the user only has 1 feed, load that feed
      // Otherwise, switch to feed select mode
      if (feeds.length === 1 && feeds[0]?.id) {
        loadFeed(feeds[0].id)
      } else {
        setIsFeedSelectMode(true)
      }

      return
    }

    const savedFeed = selectFeedById(galleryId)(WpBlockStore.getState())

    // Check if the current feed exists
    // If not, switch to feed select mode and missing feed mode.
    if (!savedFeed) {
      setFeedState(null)
      setIsFeedSelectMode(true)
      setIsMissingFeed(true)

      return
    }

    loadedGalleryId.current = galleryId
    setAttributes({galleryId})
    setIsFeedSelectMode(false)
    setIsMissingFeed(false)

    setFeedState(new FeedState(savedFeed.options, Device.DESKTOP, {
      getWallet: address => selectWallet(address)(WpBlockStore.getState()),
    }))
  }

  /**
   * Callback for when the feed is selected through the UI.
   */
  function onSelectFeed(galleryId: string) {
    setAttributes({galleryId: parseInt(galleryId)})
    setIsFeedSelectMode(false)
  }

  if (!isLoaded) {
    return (
      <div className={classes.loading}>
        <LoadingSpinner size={50} />
      </div>
    )
  }

  const feedId = attributes.galleryId ? attributes.galleryId.toString() : ""
  const feed = feeds.find(f => f.id === attributes.galleryId)
  const feedOptions = feeds.map(feed => (
    {
      label: feed.name ? feed.name : "(no name)",
      value: `${feed.id}`,
    }
  ))

  return (
    <div>
      {!isFeedSelectMode && (
        <BlockControls>
          {feeds.length > 1 && (
            <Toolbar>
              <div className={classes.selector}>
                <label className={classes.selectorLabel}>
                  <span>Feed:</span>
                </label>
                <div className={classes.selectorListContainer}>
                  <SelectControl value={feedId} onChange={onSelectFeed} options={feedOptions} />
                </div>
              </div>
            </Toolbar>
          )}
        </BlockControls>
      )}

      <div>
        {isFeedSelectMode && (
          <EditModeBox>
            {isMissingFeed && (
              <MissingFeedMessage feedId={feedId} />
            )}

            {feeds.length > 0
              ? <FeedSelector value={feedId} onChange={onSelectFeed} options={feedOptions} />
              : <Onboarding />
            }
          </EditModeBox>
        )}

        {!isFeedSelectMode && (feedState && !feedState.hasSources()) && (
          <EditModeBox>
            <NoSourcesMessage feed={feed} />
          </EditModeBox>
        )}

        {!isFeedSelectMode && feedState && feedState.hasSources() && (
          <div className={classList(className, classes.feedContainer)}>
            <TokenFeed state={feedState} onUpdateState={setFeedState} autoDevice />
          </div>
        )}
      </div>
    </div>
  )
}

function EditModeBox({children}) {
  return (
    <div className={classes.root}>
      <img className={classes.logo} src={Common.image("icon-128x128.png")} alt="" />

      {children}
    </div>
  )
}

function FeedSelector({value, onChange, options}) {
  return (
    <>
      <div className={classes.label}>
        Choose which NFT feed to show:
      </div>

      <SelectControl
        value={value}
        onChange={onChange}
        options={[FEED_SELECTOR_DEFAULT].concat(options)}
        style={{padding: 5}}
      />
    </>
  )
}

function MissingFeedMessage({feedId}) {
  return (
    <div className={classes.missingFeedMsg}>
      This block is hidden because the selected gallery (with ID #{feedId}) does not exist or has been deleted.
    </div>
  )
}

function NoSourcesMessage({feed}) {
  const editUrl = "admin.php?page=snft&screen=edit&id=" + feed.id.toString()

  return (
    <div className={classes.noSourcesMsg}>
      <span>The gallery "<b>{feed.name}</b>" does not have any NFTs to show.</span>
      <br />
      <a href={editUrl} target="_blank">Click here</a>{" "}
      <span>to edit the gallery and select a wallet with NFTs.</span>
    </div>
  )
}

function Onboarding() {
  return (
    <>
      <div className={classes.label}>
        You do not have any NFT feeds.
      </div>
      <div className={classes.label}>
        Go to the
        {" "}
        <a href={NEW_FEED_PAGE} target="_blank">
          NFT Gallery
        </a>
        {" "}
        page to begin designing your first gallery.
      </div>
      <div className={classes.label}>
        You can keep this tab open and the block will automatically detect when you create your new gallery.
      </div>
    </>
  )
}
