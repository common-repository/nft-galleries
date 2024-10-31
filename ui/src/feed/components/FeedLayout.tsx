import React, {CSSProperties, FunctionComponent, ReactNode, useContext} from "react"
import classes from "../styles/FeedLayout.pcss"
import {TokenPopupBox} from "spotlight/feed/components/TokenPopupBox"
import {LinkBehavior} from "spotlight/feed"
import {FeedContext} from "spotlight/feed/context"
import {LoadMoreButton} from "spotlight/feed/components/LoadMoreButton"
import {Color} from "spotlight/utils/design"
import {Token, Tokens} from "spotlight/common/modules/tokens"

export type LayoutProps = {
  tokens: Token[];
  openToken: (token: Token) => void;
  loadMoreBtn: ReactNode;
  loadingTokens: string[];
}

export type LayoutComponent = FunctionComponent<LayoutProps>;

type Props = {
  children: LayoutComponent;
}

export function FeedLayout({children}: Props) {
  const [lightboxMediaIdx, setLightboxMediaIdx] = React.useState<number | null>(null)
  const {state} = useContext(FeedContext)
  const design = state.getDesign()
  const tokens = state.getTokens()

  const openToken = React.useCallback((token: Token) => {
    const idx = state.getTokens().findIndex(t => t.id === token.id)
    const url = Tokens.getOpenSeaUrl(token)

    switch (design.linkBehavior) {
      case LinkBehavior.LIGHTBOX:
        setLightboxMediaIdx(idx)
        return
      case LinkBehavior.NEW_TAB:
        window.open(url, "_blank")
        return
      case LinkBehavior.SELF:
        window.open(url, "_self")
        return
    }
  }, [design, state, setLightboxMediaIdx])

  //=== INLINE CSS ==============================

  const rootCss: CSSProperties = {
    width: design.feedWidth,
    height: design.feedHeight,
    fontSize: design.textSize,
    overflowX: design.feedOverflowX,
    overflowY: design.feedOverflowY,
  }

  const wrapperCss: CSSProperties = {
    backgroundColor: Color.toCss(design.bgColor),
    padding: design.feedPadding,
  }

  const buttonCss: CSSProperties = {
    marginTop: design.imgPadding,
  }

  //=== COMPONENTS ==============================

  const loadMoreBtn = design.showLoadMoreBtn && state.canLoadMore() && (
    <div className={classes.loadMoreBtn} style={buttonCss}>
      <LoadMoreButton />
    </div>
  )

  let loadingTokens = []
  if (state.isLoading()) {
    const numPosts = state.getDesign().numPosts
    const numLoading = numPosts <= 0 ? 12 : numPosts
    loadingTokens = Array.from({length: numLoading}).fill(classes.fakeTokens)

    if (!state.isLoadingMore()) {
      tokens.splice(tokens.length - loadingTokens.length - 1, loadingTokens.length)
    }
  }

  return (
    <div className={classes.root} style={rootCss}>
      <div className={classes.wrapper} style={wrapperCss}>
        {
          React.createElement(children, {tokens, openToken, loadMoreBtn, loadingTokens})
        }
      </div>

      {lightboxMediaIdx !== null && (
        <TokenPopupBox
          current={lightboxMediaIdx}
          onRequestClose={() => setLightboxMediaIdx(null)}
        />
      )}
    </div>
  )
}
