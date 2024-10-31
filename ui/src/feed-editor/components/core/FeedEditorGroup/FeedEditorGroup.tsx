import React, {ReactNode, useCallback, useContext} from "react"
import {useDispatch} from "react-redux"
import classes from "./FeedEditorGroup.pcss"
import {FeedEditorActions} from "spotlight/feed-editor/store"
import {Spoiler} from "spotlight/admin-common/components/Containers/Spoiler"
import {FeedEditorProContext, FeedEditorProElement} from "spotlight/feed-editor/components/core/FeedEditorProElement"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill"

type Props = {
  id: string;
  label: string;
  proOnly?: boolean;
  children: ReactNode;
  isStatic?: boolean;
}

export const FeedEditorGroup = React.memo(function FeedEditorGroup(props: Props) {
  return props.proOnly
    ? <FeedEditorProElement><Inner {...props} /></FeedEditorProElement>
    : <Inner {...props} />
})

function Inner({id, label, isStatic, children}: Props) {
  const dispatch = useDispatch()
  const openGroups = useEditorSelector(state => state.openGroups)
  const isFakePro = useContext(FeedEditorProContext)

  const isOpen = openGroups.includes(id)
  const toggleOpen = useCallback(() => dispatch(FeedEditorActions.toggleGroup(id)), [dispatch, id])

  const fullLabel = isFakePro
    ? <><ProPill className={classes.proPill} />{label}</>
    : label

  return (
    <Spoiler
      className={classes.spoiler}
      label={fullLabel}
      isOpen={isStatic ? true : isOpen}
      onClick={isStatic ? undefined : toggleOpen}
      defaultOpen={isStatic ? true : isOpen}
      showIcon={!isStatic}
      children={children}
      scrollOnOpen
      fitted
    />
  )
}
