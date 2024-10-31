import React, {useEffect} from "react"
import {AdminEditor} from "spotlight/admin-common/components/AdminEditor/AdminEditor"
import {DefaultFeedOptions} from "spotlight/feed"
import {setIsEditingNewFeed} from "spotlight/admin/store/app"
import {useDispatch} from "react-redux"

export function NewFeedScreen() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Mark as editing a new feed when the screen mounts
    dispatch(setIsEditingNewFeed(true))
  }, [])

  return (
    <AdminEditor
      feed={{
        id: null,
        name: "",
        options: DefaultFeedOptions,
        usages: [],
      }}
    />
  )
}
