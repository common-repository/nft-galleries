import React, {useLayoutEffect, useState} from "react"
import classes from "../styles/TokenPopupBoxImage.pcss"
import {Token, Tokens} from "spotlight/common/modules/tokens"
import {Size} from "spotlight/utils/size"

interface Props {
  token: Token;
  onGetSize?: (size: Size) => void;
}

export function TokenPopupBoxImage({token, onGetSize}: Props) {
  const img = React.useRef<HTMLImageElement>()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useLayoutEffect(() => {
    // Trigger the onLoaded event if the image was already loaded in the browser before this component
    // rendered the <img> tag, as this would cause the `onLoaded` event to not trigger naturally
    if (isLoading && img.current && img.current.complete) {
      onLoaded()
    }
  }, [])

  const onLoaded = () => {
    setIsLoading(false)

    if (img.current) {
      const naturalSize = {
        width: img.current.naturalWidth,
        height: img.current.naturalHeight,
      }

      onGetSize && onGetSize(naturalSize)
    }
  }

  const onError = () => {
    setIsError(true)
    setIsLoading(false)
  }

  if (isError) {
    return (
      <div className={classes.error}>
                <span className={classes.errorMessage}>
                    Image is not available
                </span>
      </div>
    )
  } else {
    const name = Tokens.getName(token)

    return (
      <img
        ref={img}
        className={isLoading ? classes.loading : classes.image}
        src={token.imageUrl}
        onLoad={onLoaded}
        onError={onError}
        aria-label={name}
        alt={name}
        loading="eager"
      />
    )
  }
}
