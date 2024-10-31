import React, {CSSProperties, SyntheticEvent, useEffect, useLayoutEffect} from "react"
import ReactDOM from "react-dom"
import css from "../styles/TokenPopupBox.pcss"
import ResizeObserver from "resize-observer-polyfill"
import {useEventListener, useWindowEventListener} from "spotlight/utils/react/useEventListener"
import {TokenViewer} from "spotlight/feed/components/TokenViewer"
import {TokenViewerSidebar} from "spotlight/feed/components/TokenViewerSidebar"
import {DesignedButton} from "spotlight/common/components/DesignedButton/DesignedButton"
import {Color} from "spotlight/utils/design/color"
import {TextDesign} from "spotlight/utils/design/text"
import {PopupBoxCtaStyle} from "spotlight/feed"
import {linkProps} from "spotlight/utils/jsx/linkProps"
import {useForceUpdate} from "spotlight/utils/react/useForceUpdate"
import {getAbsoluteRect} from "spotlight/utils/dom"
import {FeedContext} from "spotlight/feed/context"
import {CaretLeftIcon} from "spotlight/feed/components/Icons/CaretLeftIcon"
import {CaretRightIcon} from "spotlight/feed/components/Icons/CaretRightIcon"
import {CloseIcon} from "spotlight/feed/components/Icons/CloseIcon"
import {Icon} from "spotlight/feed/components/Icon"
import {ExternalIcon} from "spotlight/feed/components/Icons/ExternalIcon"
import Align = TextDesign.Align

interface Props {
  current: number;
  onRequestClose?: () => void;
}

export function TokenPopupBox({current, onRequestClose}: Props) {
  const {state} = React.useContext(FeedContext)
  const design = state.getDesign()
  const showSidebar = design.lightboxShowSidebar
  const tokenList = state.getTokens()

  const modalLayer = React.useRef()
  const forceUpdate = useForceUpdate()
  const [isVertical, setIsVertical] = React.useState(shouldBeVertical(null, showSidebar))
  const [currIdx, setCurrIdx] = React.useState<number>(current)
  const ctx = React.useContext(TokenPopupBox.Context)

  const canGotoPrev = (currIdx > 0)
  const canGotoNext = (currIdx < (tokenList.length - 1) || state.canLoadMore())

  // Get the target parent element
  const target = ctx.target?.current ?? document.body

  // Update current index state when `current` prop changes
  useEffect(() => setCurrIdx(current), [current])

  // Updates the horizontal/vertical state based on the parent's width and presence of the sidebar
  const updateVerticalState = () => setIsVertical(shouldBeVertical(modalLayer.current, showSidebar))

  // Add no-scroll class to body on mount and remove it on unmount
  useEffect(() => {
    updateVerticalState()
    setParentOverflow(target, false)

    return () => setParentOverflow(target, true)
  }, [target])

  // Check if need to change to vertical mode on window size change
  useWindowEventListener("resize", () => {
    updateVerticalState()
    forceUpdate()
  }, [], [showSidebar])

  // Detect when the target element resizes
  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateVerticalState()
      forceUpdate()
    })

    if (ctx.target.current) {
      resizeObserver.observe(ctx.target.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [ctx.target.current, showSidebar])

  const requestClose = (e: SyntheticEvent | Event) => {
    onRequestClose && onRequestClose()
    e.preventDefault()
    e.stopPropagation()
  }

  const gotoPrev = (e: SyntheticEvent | Event) => {
    setCurrIdx(idx => Math.max(idx - 1, 0))
    e.preventDefault()
    e.stopPropagation()
  }

  const gotoNext = async (e: SyntheticEvent | Event) => {
    setCurrIdx(idx => Math.min(idx + 1, state.getTokens().length - 1))

    e.preventDefault()
    e.stopPropagation()
  }

  /**
   * Stop propagation of click events from the modal to the root div element, as this would cause any click inside
   * the modal to result in the modal being closed, since the root element calls {@link requestClose} on click.
   */
  const stopModalClick = (e: SyntheticEvent) => {
    e.stopPropagation()
  }

  // Keyboard events
  useEventListener(document.body, "keydown", (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight": {
        gotoNext(e)
        break
      }
      case "ArrowLeft": {
        gotoPrev(e)
        break
      }
      case "Escape": {
        requestClose(e)
        break
      }
      default: {
        return
      }
    }
  }, [], [])

  const currToken = tokenList[currIdx] ?? null

  const ctaLink = {
    url: currToken?.permalink ?? "",
    text: "View on OpenSea",
    newTab: true,
  }

  const ctaIsBtn = (design.lightboxCtaStyle === PopupBoxCtaStyle.BUTTON)
  const ctaDesign = ctaIsBtn
    ? design.lightboxCtaDesign
    : {
      text: {
        color: Color.BLACK,
        align: Align.LEFT,
      },
      bgColor: Color.TRANSPARENT,
      onHover: {
        text: {underline: true},
      },
    }

  const rect = getAbsoluteRect(target)
  const style: CSSProperties = (target === document.body) ? {} : {
    top: rect.top,
    left: rect.left,
    bottom: window.innerHeight - rect.bottom,
    right: window.innerWidth - rect.right,
  }

  const newElement = (
    <div className={isVertical ? css.vertical : css.horizontal} style={style} onClick={requestClose}>
      {/* First layer - Navigation buttons */}
      <div className={css.navLayer}>
        <div className={css.navBoundary}>
          <div className={showSidebar ? css.navAlignerSidebar : css.modalAlignerNoSidebar}>
            {canGotoPrev && <PrevButton onClick={gotoPrev} />}
            {canGotoNext && <NextButton onClick={gotoNext} />}
          </div>
        </div>
      </div>

      {/* Second layer - Modal */}
      <div ref={modalLayer} className={css.modalLayer} role="dialog" onClick={stopModalClick}>
        <div className={showSidebar ? css.modalAlignerSidebar : css.modalAlignerNoSidebar}>
          <TokenViewer token={currToken} vertical={isVertical}>
            {showSidebar && false && (
              <PopupBoxSidebar token={currToken} link={ctaLink} design={ctaDesign} isBtn={ctaIsBtn} />
            )}
          </TokenViewer>
        </div>
      </div>

      {/* Close button */}
      <CloseButton onClick={requestClose} />
    </div>
  )

  return ReactDOM.createPortal(newElement, target)
}

export namespace TokenPopupBox {
  type ContextType = {
    target: {
      current: Element,
    },
  };

  export const Context = React.createContext<ContextType>({
    target: {
      current: document.body,
    },
  })
}

function PopupBoxSidebar({token = null, design = null, link = null, isBtn = false}) {
  const btnLinkProps = token ? linkProps(link) : {}

  return (
    <TokenViewerSidebar token={token}>
      {token
        ? <DesignedButton
          design={design}
          rel="nofollow noreferrer noopener"
          aria-label={link.text}
          {...btnLinkProps}
        >
          <Icon icon={ExternalIcon} className={css.ctaIcon} />
          <span>{link.text}</span>
        </DesignedButton>
        : <div className={isBtn ? css.skeletonCtaButton : css.skeletonCtaLink} />
      }
    </TokenViewerSidebar>
  )
}

function PrevButton({onClick}) {
  return (
    <a
      className={css.prevBtn}
      onClick={onClick}
      role="button"
      aria-label="Previous NFT"
      tabIndex={0}>
      <Icon icon={CaretLeftIcon} className={css.controlIcon} />
      <span className={css.controlLabel}>Previous</span>
    </a>
  )
}

function NextButton({onClick}) {
  return (
    <a
      className={css.nextBtn}
      onClick={onClick}
      role="button"
      aria-label="Next NFT"
      tabIndex={0}>
      <Icon icon={CaretRightIcon} className={css.controlIcon} />
      <span className={css.controlLabel}>Next</span>
    </a>
  )
}

function CloseButton({onClick}) {
  return (
    <a
      className={css.closeButton}
      onClick={onClick}
      role="button"
      aria-label="Close popup"
      tabIndex={0}>
      <Icon icon={CloseIcon} className={css.controlIcon} />
      <span className={css.controlLabel}>Close</span>
    </a>
  )
}

function shouldBeVertical(parent: Element, showSidebar) {
  return showSidebar && (parent ?? document.body).getBoundingClientRect().width < 876
}

function setParentOverflow(parent: Element, canScroll: boolean) {
  if (canScroll) {
    parent.classList.remove(css.noScroll)
  } else {
    parent.classList.add(css.noScroll)
  }
}
