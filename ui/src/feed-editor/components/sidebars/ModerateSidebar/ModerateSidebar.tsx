import React, {useContext} from "react"
import classes from "spotlight/feed-editor/components/sidebars/ModerateSidebar/ModerateSidebar.pcss"
import {Sidebar} from "spotlight/admin-common/components/Sidebar/Sidebar"
import {SidebarLayout} from "spotlight/admin-common/components/SidebarLayout/SidebarLayout"
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill"
import {RadioGroup} from "spotlight/admin-common/components/fields/RadioGroup/RadioGroup"
import {ModerationMode} from "spotlight/feed"
import {Message, MessageType} from "spotlight/admin-common/components/Message/Message"
import ModalPrompt from "spotlight/admin-common/components/ModalPrompt/ModalPrompt"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {selectFeedOption} from "spotlight/feed-editor/store/selectors"
import {useDispatch, useSelector} from "react-redux"
import {FeedEditorActions} from "spotlight/feed-editor/store"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"

export type Props = {
  onShowContent: () => void;
};

export function ModerateSidebar({onShowContent}: Props) {
  const dispatch = useDispatch()

  const isCollapsed = useContext(SidebarLayout.Context)
  const isPro = useFeedEditorContext().config.isPro

  const moderationMode = useSelector(selectFeedOption("moderationMode"))
  const hasModeration = useEditorSelector(state => state.feedOptions.moderation.length)
  const isWhitelist = moderationMode === ModerationMode.WHITELIST

  const [isResetConfirmOpen, setResetConfirmOpen] = React.useState(false)

  function handleChangeMode(moderationMode) {
    dispatch(FeedEditorActions.changeFeedOptions({moderationMode}))
  }

  function showResetConfirmation() {
    setResetConfirmOpen(true)
  }

  function hideResetConfirmation() {
    setResetConfirmOpen(false)
  }

  function resetModeration() {
    if (isPro) {
      hideResetConfirmation()
      dispatch(FeedEditorActions.changeFeedOptions({
        moderationMode: ModerationMode.BLACKLIST,
        moderation: [],
      }))
    }
  }

  return (
    <>
      {isCollapsed && (
        <SidebarLayout.Navigation onClick={onShowContent} />
      )}

      <Sidebar padded>
        <div>
          <p>You can choose to hide specific NFTs or only show NFTs that you choose.</p>
          <p>
            Choose the type of moderation that you wish to apply, then simply click on the NFTs that{" "}
            you want to show or hide. NFTs that appear in grey will not be shown in the gallery.
          </p>

          <hr />

          <div className={classes.mode}>
            {!isPro && (
              <div className={classes.proPill}>
                <ProPill />
              </div>
            )}
            <RadioGroup
              name="manualFilterMode"
              value={moderationMode}
              onChange={handleChangeMode}
              disabled={!isPro}
              options={[
                {
                  value: ModerationMode.BLACKLIST,
                  label: "Hide the selected NFTs",
                },
                {
                  value: ModerationMode.WHITELIST,
                  label: "Only show the selected NFTs",
                },
              ]}
            />
          </div>

          {(hasModeration || isWhitelist) && (
            <a className={classes.reset} onClick={showResetConfirmation}>
              Reset moderation
            </a>
          )}
        </div>
        {!isPro && (
          <div>
            <hr />
            <Message type={MessageType.PRO_TIP} showIcon={true}>
              <span>
                <strong>Pro tip</strong>:
                {" "}You can navigate the NFTs using arrow keys and select them by pressing Enter.
              </span>
            </Message>
          </div>
        )}
        <ModalPrompt
          isOpen={isResetConfirmOpen}
          title="Are you sure?"
          buttons={["Yes", "No"]}
          onAccept={resetModeration}
          onCancel={hideResetConfirmation}>
          <p>Are you sure you want to reset your moderation settings? This cannot be undone.</p>
        </ModalPrompt>
      </Sidebar>
    </>
  )
}
