import React from "react"
import classes from "./FeedsScreen.pcss"
import {AdminScreen} from "spotlight/admin-common/components/AdminScreen/AdminScreen"
import {SCREENS} from "spotlight/admin-common/stores/ScreensStore"
import {FeedsList} from "spotlight/admin-common/components/FeedsList/FeedsList"
import AdminNavbar from "spotlight/admin-common/components/AdminNavbar/AdminNavbar"
import {useDispatch, useSelector} from "react-redux"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {gotoRoute} from "spotlight/admin-common/stores/router"
import {Feed, saveFeed} from "spotlight/admin-common/stores/feeds"
import {FeedImportButton} from "spotlight/admin-common/components/FeedImportButton/FeedImportButton"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {selectFeeds} from "spotlight/admin-common/stores/feeds/selectors"

export function FeedsScreen() {
  const dispatch = useDispatch()
  const feeds = useSelector(selectFeeds)

  function createFeed() {
    dispatch(gotoRoute({screen: SCREENS.NEW_FEED}))
  }

  if (feeds.length === 0) {
    setTimeout(() => createFeed(), 10)
  }

  function handleImport(data) {
    const feed: Feed = {
      id: null,
      name: data.name,
      options: data.options,
      usages: [],
    }

    dispatch(saveFeed(feed))
  }

  return (
    <AdminScreen navbar={AdminNavbar}>
      {feeds.length > 0 &&
        <div className={classes.root}>
          <div className={classes.toolbar}>
            <Button
              type={ButtonType.PRIMARY}
              size={ButtonSize.LARGE}
              onClick={createFeed}>
              <Dashicon icon="plus-alt2" />
              <span>Create a new gallery</span>
            </Button>
            &nbsp;
            &nbsp;
            <FeedImportButton onImport={handleImport} />
          </div>

          <FeedsList />
        </div>
      }
    </AdminScreen>
  )
}
