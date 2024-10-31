import React from "react"
import classes from "./SpotlightLogo.pcss"
import {Common} from "spotlight/common"
import {noDrag} from "spotlight/utils/jsx/noDrag"

export function SpotlightLogo() {
  return (
    <div className={classes.logo}>
      <img
        className={classes.logoImage}
        src={Common.image("icon-128x128.png")}
        alt="Spotlight"
        {...noDrag} />
    </div>
  )
}
