import React from "react"
import classes from "./EmbedSidebar.pcss"
import {selectFeedName} from "spotlight/feed-editor/store/selectors"
import {useSelector} from "react-redux"
import {selectQueryParam} from "spotlight/admin-common/stores/router/selectors"
import AdminCommon from "spotlight/admin-common/AdminCommon"
import {Message, MessageType} from "spotlight/admin-common/components/Message/Message"
import {Spoiler} from "spotlight/admin-common/components/Containers/Spoiler"
import {CopyShortcode} from "spotlight/admin-common/components/Feeds/CopyShortcode"
import {Button, ButtonType} from "spotlight/admin-common/components/Button"
import {SpoilerProLabel} from "spotlight/admin-common/components/SpoilerProLabel/SpoilerProLabel"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {selectFeedById, selectFeeds} from "spotlight/admin-common/stores/feeds/selectors"

export function EmbedSidebar() {
  const feedId = useSelector(selectQueryParam("id"))
  const feed = useSelector(selectFeedById(feedId))
  const feedName = useSelector(selectFeedName)
  const numFeeds = useSelector(selectFeeds).length
  const showProOptions = useEditorSelector(state => state.showProOptions)
  const isPro = useFeedEditorContext().config.isPro
  const showPro = isPro || showProOptions

  if (!feedId) {
    return (
      <div className={classes.embedSidebar}>
        <div className={classes.saveMessage}>
          <Message type={MessageType.INFO} showIcon>
            You're almost there... Click the <strong>Save</strong> button at the top-right to be{" "}
            able to embed this gallery on your site!
          </Message>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.embedSidebar}>
      {feed.usages.length > 0 && (
        <Spoiler label="Instances" defaultOpen fitted scrollOnOpen>
          <div className={classes.instances}>
            <p>This gallery is currently being shown in these pages:</p>
            <ul>
              {feed.usages.map((usage, idx) => (
                <li key={idx}>
                  <a
                    href={`${AdminCommon.config.adminUrl}/post.php?action=edit&post=${usage.id}`}
                    target="_blank">
                    {usage.name}
                  </a>
                  <span>({usage.type})</span>
                </li>
              ))}
            </ul>
          </div>
        </Spoiler>
      )}

      <Spoiler label="Shortcode" defaultOpen fitted scrollOnOpen>
        <div>
          <p>Copy the shortcode below and paste it in any page or post to embed this gallery:</p>

          <div className={classes.shortcode}>
            <code>[nft-gallery gallery="{feedId}"]</code>

            <CopyShortcode feed={feed}>
              <Button type={ButtonType.SECONDARY}>
                Copy
              </Button>
            </CopyShortcode>
          </div>
        </div>
      </Spoiler>

      {AdminCommon.config.hasElementor && showPro && (
        <Spoiler
          className={!isPro ? classes.pro : undefined}
          label={isPro ? "Elementor Widget" : <SpoilerProLabel>Elementor widget</SpoilerProLabel>}
          defaultOpen
          fitted={true}
          scrollOnOpen={true}>
          <div>
            <p>To embed this gallery in Elementor:</p>

            <ol>
              <li>
                <span>
                  Search for the <b>NFT Gallery</b> widget
                </span>
              </li>
              <li>Add it to your post or page</li>
              <li>Then choose <strong>{feedName}</strong> from the list of galleries.</li>
            </ol>
          </div>
        </Spoiler>
      )}

      <Spoiler label="WordPress Block" defaultOpen={!AdminCommon.config.hasElementor} fitted scrollOnOpen>
        <div>
          <p>To embed this gallery in the WordPress block editor:</p>

          <ol>
            <li>Search for the <b>NFT Gallery</b> block</li>
            <li>Add it to your post or page.</li>

            {(numFeeds > 1)
              ? <li>Next, choose <strong>{feedName}</strong> from the list of galleries.</li>
              : <li>Since this is your only gallery, is will be automatically selected.</li>
            }
          </ol>
        </div>
      </Spoiler>
    </div>
  )
}
