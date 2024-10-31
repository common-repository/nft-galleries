import React from "react"
import classes from "./FeedPreviewToolbar.pcss"
import {FeedEditorDeviceSelector} from "spotlight/feed-editor/components/core/FeedEditorDeviceSelector"
import {Button} from "spotlight/admin-common/components/Button"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {ResponsiveContainer} from "spotlight/admin-common/components/ResponsiveContainer/ResponsiveContainer"
import {
  FeedEditorDeviceCycleButton,
} from "spotlight/feed-editor/components/core/FeedEditorDeviceCycleButton/FeedEditorDeviceCycleButton"
import {LoadingSpinner} from "spotlight/admin-common/components/Wp/LoadingSpinner"

export type Props = {
  numShownPosts?: number;
  numTotalPosts?: number;
  showNumPosts?: boolean;
  showReset?: boolean;
  showDevices?: boolean;
  showCloseBtn?: boolean;
  isLoading?: boolean;
  showSpinner?: boolean;
  onReset?: () => void;
  onClose?: () => void;
};

export function FeedPreviewToolbar({
  isLoading = false,
  numShownPosts = 0,
  numTotalPosts = 0,
  showNumPosts = false,
  showReset = false,
  showDevices = false,
  showCloseBtn = false,
  showSpinner = false,
  onReset = undefined,
  onClose = undefined,
}: Props) {
  return (
    <div className={classes.root}>
      <div className={classes.left}>
        {showNumPosts && (
          <span className={classes.postCounter}>
            {isLoading
              ? "Loading ..."
              : <>Showing {numShownPosts} out of {numTotalPosts} NFTs</>
            }
            {showSpinner && <LoadingSpinner className={classes.spinner} size={14} />}
          </span>
        )}

        {showReset && (
          <span className={classes.reset}>
            (<a onClick={onReset}>Reset</a>)
            </span>
        )}
      </div>

      <div className={classes.center}>
        {showDevices && (
          <ResponsiveContainer
            breakpoints={[400]}
            render={breakpoint => breakpoint === 400
              ? <FeedEditorDeviceCycleButton />
              : <FeedEditorDeviceSelector />
            }
          />
        )}
      </div>

      <div className={classes.right}>
        {showCloseBtn && (
          <Button onClick={onClose}>
            <Dashicon icon="hidden" />
            <span>Close Preview</span>
          </Button>
        )}
      </div>
    </div>
  )
}
