import React, {CSSProperties, useContext, useLayoutEffect} from "react"
import css from "./FeedGridLayout.pcss"
import {TokenTile} from "spotlight/feed/components/TokenTile"
import {FeedLayout, LayoutProps} from "spotlight/feed/components/FeedLayout"
import {classList} from "spotlight/utils/jsx/classes"
import {uniqueNum} from "spotlight/utils/numbers/uniqueNum"
import {FeedContext} from "spotlight/feed/context"
import {Token, Tokens} from "spotlight/common/modules/tokens"
import {Square} from "spotlight/common/components/Square/Square"

type Props = {
  cellClassName?: (token: Token | null, idx: number) => string;
}

export function FeedGridLayout({cellClassName}: Props) {
  return (
    <FeedLayout>
      {({tokens, openToken, loadMoreBtn, loadingTokens}: LayoutProps) => {
        const {state} = useContext(FeedContext)
        const design = state.getDesign()

        cellClassName = cellClassName ?? (() => undefined)

        const gridCss: CSSProperties = {
          gridGap: design.imgPadding,
          gridTemplateColumns: `repeat(${design.numColumns}, 1fr)`,
        }

        return (
          <div className={css.root}>
            {/* Layout content - only when the feed is not doing a full (re)load */}
            {(!state.isLoading() || state.isLoadingMore()) &&
              <div className={css.grid} style={gridCss}>
                {/* Media cells */}
                {tokens.length ? tokens.map((token, idx) => (
                  <Cell
                    key={token.id}
                    className={cellClassName(token, idx)}
                    token={token}
                    openToken={openToken}
                  />
                )) : null}

                {/* Fake media when loading more, but not when doing a full (re)load */}
                {state.isLoadingMore() && loadingTokens.map((className, idx) => (
                  <div
                    key={`fake-media-${uniqueNum()}`}
                    className={classList(css.loadingCell, className, cellClassName(null, idx))} />
                ))}
              </div>
            }

            {/* Fake media only shown for a full (re)load */}
            {state.isLoading() && !state.isLoadingMore() && (
              <div className={css.grid} style={gridCss}>
                {loadingTokens.map((className, idx) => (
                  <div
                    key={`fake-media-${uniqueNum()}`}
                    className={classList(css.loadingCell, className, cellClassName(null, idx))} />
                ))}
              </div>
            )}

            <div className={css.buttonList}>
              {loadMoreBtn}
            </div>
          </div>
        )
      }}
    </FeedLayout>
  )
}

interface CellProps {
  token: Token;
  className: string;
  style?: CSSProperties;
  openToken: (token: Token) => void;
}

function Cell({token, className, style, openToken}: CellProps) {
  const handleClick = React.useCallback(() => openToken(token), [token, openToken])
  const {state} = useContext(FeedContext)
  const {showNames} = state.getDesign()

  return (
    <div className={classList(css.cell, className)} style={style}>
      <Square>
          <TokenTile token={token} onClick={handleClick} />
      </Square>
      {showNames &&
        <div className={css.cellCaption}>
          {Tokens.getName(token)}
        </div>
      }
    </div>
  )
}
