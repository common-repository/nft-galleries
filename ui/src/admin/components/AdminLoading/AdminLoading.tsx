import React from "react"
import "spotlight/admin-common/styles/loading.scss"
import classes from "./AdminLoading.pcss"
import {LoadingSpinner} from "spotlight/admin-common/components/Wp/LoadingSpinner"

export function AdminLoading() {
  return (
    <div className={classes.root}>
      <div className={classes.sizer}>
        <LoadingSpinner size={100} />
      </div>
    </div>
  )
}
