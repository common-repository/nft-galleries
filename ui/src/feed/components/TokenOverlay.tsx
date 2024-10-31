import React, {CSSProperties, useContext, useEffect} from "react"
import classes from "../styles/TokenOverlay.pcss"
import {HoverInfo} from "spotlight/feed"
import {FeedContext} from "spotlight/feed/context"
import {Color} from "spotlight/utils/design"
import {Token, Tokens} from "spotlight/common/modules/tokens"

interface Props {
  token: Token;
}

export function TokenOverlay({token}: Props) {
  const {state} = useContext(FeedContext)
  const design = state.getDesign()

  const ref = React.useRef<HTMLDivElement>()
  const [width, setWidth] = React.useState<number | null>(null)

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
  }, [])

  const showName = design.hoverInfo.has(HoverInfo.NAME)
  const showDesc = design.hoverInfo.has(HoverInfo.DESCRIPTION)

  const css: CSSProperties = {
    color: Color.toCss(design.textColorHover),
    backgroundColor: Color.toCss(design.bgColorHover),
  }

  // Create the overlay content only if the width has already been calculated
  let content = null
  if (width !== null) {
    content = (
      <div className={classes.rows}>
        {/* --- TOP --- */}
        <div className={classes.topRow}>
        </div>

        {/* --- MIDDLE --- */}
        <div className={classes.middleRow}>
          {showName && (
            <div className={classes.name}>
              {Tokens.getName(token)}
            </div>
          )}
        </div>

        {/* --- BOTTOM --- */}
        <div className={classes.bottomRow}>
          {showDesc && token.description && (
            <div className={classes.desc}>
              {token.description}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={classes.root} style={css}>
      {content}
    </div>
  )
}
