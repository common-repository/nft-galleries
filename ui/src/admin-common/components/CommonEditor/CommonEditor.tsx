import React, {useEffect, useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {FeedOptions} from "spotlight/feed"
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener"
import {FeedEditorConfig} from "spotlight/feed-editor/config"
import {FeedEditor} from "spotlight/feed-editor/components/core/FeedEditor/FeedEditor"
import {FeedEditorActions, FeedEditorState} from "spotlight/feed-editor/store"
import {Feed} from "spotlight/admin-common/stores/feeds"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {WpMediaField} from "spotlight/admin-common/components/fields/WpMediaField/WpMediaField"
import {Common} from "spotlight/common"
import {useUnload} from "spotlight/admin-common/stores/router"
import AdminCommon from "spotlight/admin-common/AdminCommon"

type Props = Partial<Omit<FeedEditorConfig, "onSave">> & {
  feed: Feed;
  useCtrlS?: boolean;
  confirmOnCancel?: boolean;
  onSave?: (feed: Feed) => Promise<any>;
  keepState?: boolean;
}

// The message when to show in the prompt when the user has changes in the editor and is navigating away
export const LEAVE_MESSAGE = "You have unsaved changes. If you leave now, your changes will be lost."

/**
 * An editor that is mostly pre-configured to behave how most of the editors in Spotlight _should_ behave.
 *
 * It detects page route changes and shows a confirmation prompt, add some key bindings and as well as decorate
 * the editor's `onSave()` to pass a {@link Feed} object instead of separate name and options values.
 */
export function CommonEditor({feed, confirmOnCancel, keepState, useCtrlS, onSave, onCancel, ...configProps}: Props) {
  const dispatch = useDispatch()
  const isSaving = useSelector<FeedEditorState, boolean>(state => state.editor.isSaving)
  const isDirty = useSelector<FeedEditorState, boolean>(state => state.editor.isDirty)
  const [isCancelling, setIsCancelling] = React.useState(false)

  // Dispatch the feed that needs to be edited to the store
  useEffect(() => {
    dispatch(FeedEditorActions.editFeed({
      feedName: feed.name,
      feedOptions: feed.options,
      reset: !keepState,
    }))
  }, [dispatch, feed.id, keepState])

  // Show confirmation when navigating away
  useUnload(
    LEAVE_MESSAGE,
    () => confirmOnCancel && isDirty && !isSaving && !isCancelling,
    [confirmOnCancel, isDirty, isSaving, isCancelling],
  )

  // Run the cancel callback if needed
  useEffect(() => {
    if (isCancelling) {
      onCancel && onCancel()
    }
  }, [isCancelling])

  // Ctrl+S shortcut to save
  useDocumentEventListener<KeyboardEvent>("keydown", (e) => {
    if (useCtrlS && e.key && e.key.toLowerCase() === "s" && e.ctrlKey) {
      dispatch(FeedEditorActions.saveFeed(handleEditorSave))
      e.preventDefault()
      e.stopPropagation()
    }
  }, [], [isDirty])

  /*
   * Handles saving from the editor.
   * Transforms the feed name and options from the editor into a {@link Feed} object and passes it on to the
   * `onSave()` callback prop.
   */
  const handleEditorSave = React.useCallback((name: string, options: FeedOptions) => {
    const newFeed = withPartial(feed, {name, options})

    return onSave
      ? onSave(newFeed)
      : Promise.reject()
  }, [feed, onSave])

  // Cancels the editor's changes
  const handleCancel = React.useCallback(() => {
    if (!isDirty || (!isCancelling && confirmOnCancel && confirm(LEAVE_MESSAGE))) {
      // The cancel event will be triggered on the next render (caused by updating the `isCancelling` state)
      // The onCancel callback needs to be run on the next render in order to give the unload prompt a chance to
      // re-render, updating its `when` condition before letting the parent component perform and cancel actions,
      // which may involve navigation.
      // So all we need to do on THIS render is simply update the `isCancelling` state.
      setIsCancelling(true)
    }
  }, [onCancel, confirmOnCancel])

  return (
    <FeedEditor
      {...configProps}
      isPro={Common.isPro}
      selectMediaField={selectMediaField}
      onSave={handleEditorSave}
      onCancel={handleCancel}
      fakePreview={AdminCommon.editor.preview}
    />
  )
}

function selectMediaField(props) {
  return (
    <WpMediaField
      {...props}
      title="Select custom profile photo"
      buttonSet="Choose custom photo"
      buttonChange="Change custom photo"
      mediaType="image"
    />
  )
}
