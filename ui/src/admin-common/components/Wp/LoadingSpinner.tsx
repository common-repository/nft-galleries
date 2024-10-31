import React, {CSSProperties} from "react"
import "spotlight/admin-common/styles/loading-spinner.scss"
import {classList} from "spotlight/utils/jsx/classes"

interface Props {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({size, className}: Props) => {
  size = size ?? 24

  const sizePx = size + "px"
  const shadowX = (size * 0.25) + "px"
  const shadowSize = (size * 0.375) + "px"

  const style: CSSProperties = {
    width: sizePx,
    height: sizePx,
    boxShadow: `${shadowX} 0 0 ${shadowSize} #999 inset`,
  }

  return (<span className={classList("loading-spinner", className)} style={style} />)
}
