import React from "react"
import classes from "../styles/TokenThumbnail.pcss"
import {TokenLoading} from "spotlight/feed/components/TokenLoading"
import {classList} from "spotlight/utils/jsx/classes"
import {noDrag} from "spotlight/utils/jsx/noDrag"
import {Token, Tokens} from "spotlight/common/modules/tokens"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  token: Token;
  className?: string;
  onLoadImage?: () => void;
  width?: number;
  height?: number;
}

export function TokenThumbnail({token, className, onLoadImage, width, height, ...attrs}: Props) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isError, setIsError] = React.useState(false)

  function onImageLoad() {
    finishLoading()
  }

  function onImageError() {
    setIsError(true)
    finishLoading()
  }

  function finishLoading() {
    setIsLoading(false)
    onLoadImage && onLoadImage()
  }

  if (isError || token.ogImageUrl.length === 0 || token.imageUrl === "0") {
    return (
      <div className={classes.notAvailable}>
        <div className={classes.notAvailableText}>
          <span>{Tokens.getName(token)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={classList(classes.root, className)} {...attrs}>
      {token.type === "VIDEO" ? (
        <video
          className={classes.video}
          src={token.imageUrl}
          onCanPlay={finishLoading}
          controls={false}
          playsInline
          autoPlay
          loop
          muted
        >
          <source src={token.imageUrl} />
          Your browser does not support videos
        </video>
      ) : (
        <img
          className={classes.image}
          loading="lazy"
          width={width}
          height={height}
          src={token.imageUrl}
          alt={token.description}
          aria-label={token.description}
          onLoad={onImageLoad}
          onError={onImageError}
          {...noDrag}
        />
      )}
      {isLoading && <TokenLoading />}
    </div>
  )
}
