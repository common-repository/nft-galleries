import React from "react"
import styles from "./ClearCacheButton.pcss"
import {Button} from "spotlight/admin-common/components/Button"
import {useSafeEffect} from "spotlight/utils/react/useSafeEffect"
import {useDispatch} from "react-redux"
import {removeToast, showToast, ToastType} from "spotlight/admin-common/stores/toasts"
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client"
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api"
import {triggerError} from "spotlight/common/modules/errors/handlers"

const WAIT_TOAST = "admin/clear_cache/please_wait"
const DONE_TOAST = "admin/clear_cache/done"

export default function ClearCacheButton({}) {
  const dispatch = useDispatch()
  const [isWaiting, setIsWaiting] = React.useState(false)

  useSafeEffect(isSafe => {
    if (isSafe && isWaiting) {
      clearCache().then(() => {
        if (isSafe) {
          setIsWaiting(false)
        }
      })
    }
  }, [isWaiting])

  const handleClick = () => {
    setIsWaiting(true)
  }

  const clearCache = async () => {
    dispatch(removeToast(DONE_TOAST))

    dispatch(showToast({
      key: WAIT_TOAST,
      message: "Clearing the cache. This could take a while. Please wait ...",
      type: ToastType.STICKY,
    }))

    try {
      await AdminRestApi.cache.clearAll()

      dispatch(showToast({
        key: DONE_TOAST,
        message: "Cleared cache successfully!",
      }))
    } catch (error) {
      triggerError({
        type: "clear_cache/error",
        message: getErrorResponseMessage(error),
      })
    } finally {
      dispatch(removeToast(WAIT_TOAST))
    }
  }

  return (
    <div className={styles.root}>
      <Button disabled={isWaiting} onClick={handleClick}>
        Clear the cache
      </Button>
    </div>
  )
};
