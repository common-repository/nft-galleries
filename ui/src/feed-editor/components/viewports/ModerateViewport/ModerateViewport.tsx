import React, {useContext} from "react"
import classes from "./ModerateViewport.pcss"
import {Button} from "spotlight/admin-common/components/Button"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {TokenSelectionGrid} from "spotlight/admin-common/components/MediaSelectionGrid/TokenSelectionGrid"
import {SidebarLayout} from "spotlight/admin-common/components/SidebarLayout/SidebarLayout"
import {TokenThumbnail} from "spotlight/feed/components/TokenThumbnail"
import {useDispatch, useSelector, useStore} from "react-redux"
import {FeedEditorActions, FeedEditorState} from "spotlight/feed-editor/store"
import {ModerationMode} from "spotlight/feed"
import {arrayToggleValue} from "spotlight/utils/arrays/arrayToggleValue"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {Token} from "spotlight/common/modules/tokens"
import {Square} from "spotlight/common/components/Square/Square"

export type Props = {
  onShowSidebar: () => void;
};

const ModerationMediaGridCache: TokenSelectionGrid.CacheStrategy = {
  value: null,
  update: (newValue) => ModerationMediaGridCache.value = newValue,
}

export function ModerateViewport({onShowSidebar}: Props) {
  const dispatch = useDispatch()
  const isPro = useFeedEditorContext().config.isPro
  const isCollapsed = useContext(SidebarLayout.Context)
  const moderation = useSelector<FeedEditorState, string[]>(state => state.editor.feedOptions.moderation)
  const mode = useSelector<FeedEditorState, ModerationMode>(state => state.editor.feedOptions.moderationMode)
  const store = useStore<FeedEditorState>()

  function handleClick(token: Token) {
    let newModeration = arrayToggleValue(moderation, token.id)
    dispatch(FeedEditorActions.changeFeedOptions({moderation: newModeration}))
  }

  function getIsTileGrey(token: Token) {
    const isModerated = moderation.includes(token.id)
    const isBlacklist = mode === ModerationMode.BLACKLIST

    return isBlacklist === isModerated
  }

  return (
    <div className={isPro ? classes.content : classes.contentDisabled}>
      {isCollapsed && (
        <div className={classes.mobileContentHeader}>
          <Button onClick={onShowSidebar}>
            <Dashicon icon="admin-generic" />
            <span>Moderation options</span>
          </Button>
        </div>
      )}

      <TokenSelectionGrid
        cache={ModerationMediaGridCache}
        options={store.getState().editor.feedOptions}
        onClick={isPro ? handleClick : undefined}
        useFilters>
        {props =>
          <ModerationTile
            token={props.item}
            isGrey={getIsTileGrey(props.item)}
          />
        }
      </TokenSelectionGrid>
    </div>
  )
}

function ModerationTile({token, isGrey}) {
  return (
    <div className={isGrey ? classes.tileGrey : classes.tileNormal}>
      <Square>
        <TokenThumbnail className={classes.tileThumbnail} token={token} />
      </Square>
    </div>
  )
}
