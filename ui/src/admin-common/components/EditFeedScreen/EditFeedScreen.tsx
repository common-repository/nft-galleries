import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {Message, MessageType} from "spotlight/admin-common/components/Message/Message"
import {AdminEditor} from "spotlight/admin-common/components/AdminEditor/AdminEditor"
import {useDispatch, useSelector, useStore} from "react-redux"
import {selectFeedById} from "spotlight/admin-common/stores/feeds/selectors"
import {setIsEditingNewFeed} from "spotlight/admin/store/app"
import {selectRoute} from "spotlight/admin-common/stores/router/selectors"

export function EditFeedScreen() {
  const dispatch = useDispatch()

  // Get the feed using the ID in the URL
  const route = useSelector(selectRoute)
  const idParam = route.getParam("id")
  const id = idParam ? parseInt(idParam) : 0
  const feed = useSelector(selectFeedById(id))

  // Get whether the app is now editing a new feed that was just saved. This controls whether the editor will
  // reset its state when mounted, resulting in a seamless transition between the "new" and "edit" screens.
  // We need to save the value in state to allow it to persist between renders. Since the below `useEffect` will
  // change the flag in the store to false, this component would render a second time with keepState = false,
  // which defeats the purpose of this flag.
  const store = useStore()
  const [keepState] = useState(() => store.getState().app.isEditingNewFeed)

  useEffect(() => {
    // Reset the "isEditingNewFeed" flag when the edit screen mounts
    dispatch(setIsEditingNewFeed(false))
  }, [])

  if (!id) {
    return null
  }

  if (!feed) {
    return <FeedNotFound />
  }

  return <AdminEditor feed={feed} keepState={keepState} />
}

function FeedNotFound() {
  const route = useSelector(selectRoute)

  return (
    <div>
      <Message type={MessageType.ERROR} showIcon={true}>
        Gallery does not exist.
        <Link to={route.withQuery({screen: "galleries"})}>
          Go back
        </Link>
      </Message>
    </div>
  )
}
