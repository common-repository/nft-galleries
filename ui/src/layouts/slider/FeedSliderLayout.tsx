import React, {CSSProperties, useContext, useEffect, useRef, useState} from "react"
import classes from "./FeedSliderLayout.pcss"
import "react-alice-carousel/lib/alice-carousel.css"
import AliceCarousel from "react-alice-carousel"
import {FeedLayout, LayoutProps} from "spotlight/feed/components/FeedLayout"
import {TokenTile} from "spotlight/feed/components/TokenTile"
import {Responsive} from "spotlight/utils/responsive"
import {FeedDesign, FeedState, SliderArrowPosition} from "spotlight/feed"
import {FeedContext} from "spotlight/feed/context"
import {Color} from "spotlight/utils/design"
import {useSafeEffect} from "spotlight/utils/react/useSafeEffect"
import {CaretLeftIcon} from "spotlight/feed/components/Icons/CaretLeftIcon"
import {CaretRightIcon} from "spotlight/feed/components/Icons/CaretRightIcon"
import {Icon} from "spotlight/feed/components/Icon"
import {Token} from "spotlight/common/modules/tokens"

export function FeedSliderLayout() {
    return (
        <FeedLayout>
            {({tokens, openToken, loadingTokens}: LayoutProps) => {
                const {state, updateState} = useContext(FeedContext)
                const design = state.getDesign()

                const carouselRef = useRef<AliceCarousel>()
                const contentRef = useRef<HTMLDivElement>()
                const [index, setIndex] = useState(0)

                // Resize the carousel when needed
                useEffect(() => {
                    if (carouselRef.current) {
                        setTimeout(() => carouselRef.current._handleResize(null), 100)
                    }
                }, [state.getDevice(), design.sliderArrowSize])

                // Reset index if slider looping is disabled
                useSafeEffect(ifSafe => {
                    if (!design.sliderLoop) {
                        ifSafe().then(() => setIndex(0))
                    }
                }, [design.sliderLoop])

                // Triggered when the slider scrolls
                const onSlideChanged = (e) => {
                    const newIdx = e.item
                    const lastIdx = getLastIdx(tokens, state)

                    // Load more posts if scrolled to the end and infinite scrolling is enabled
                    if (design.sliderInfinite && state.canLoadMore() && !state.isLoading() && newIdx >= lastIdx) {
                        updateState(...state.loadMore())
                    }

                    setIndex(newIdx)
                }

                // Function to programmatically slide to a new index
                const changeIndex = (newIdx) => carouselRef.current.slideTo(newIdx)
                // Functions to programmatically slide left and right
                const scrollLeft = () => changeIndex(index - design.sliderNumScrollPosts)
                const scrollRight = () => changeIndex(index + design.sliderNumScrollPosts)

                const lastIdx = getLastIdx(tokens, state)
                const canLoadMore = design.sliderInfinite && state.canLoadMore()
                const isSinglePage = !canLoadMore && (tokens.length <= design.numColumns)
                const arrowsInside = (design.sliderArrowPos === SliderArrowPosition.INSIDE)

                // Show the left arrow when not on the first image or looping is enabled
                const showLeftArrow = !isSinglePage && (index > 0 || design.sliderLoop)
                // Show the right arrow when not on the last image or looping is enabled or more posts can be loaded in
                const showRightArrow = !isSinglePage && (index < lastIdx || design.sliderLoop || canLoadMore)

                // Image padding styles
                const imgPadding = Responsive.get(state.getOptions().imgPadding, state.getDevice())
                const sizerCss: CSSProperties = {
                    top: (imgPadding / 2) + "px",
                    bottom: (imgPadding / 2) + "px",
                    left: (imgPadding / 2) + "px",
                    right: (imgPadding / 2) + "px",
                }

                const contentArrowPadding = !arrowsInside
                    ? (design.sliderArrowSize * 1.8) + "px"
                    : undefined

                const contentStyle: CSSProperties = {
                    margin: `-${imgPadding / 2}px 0`,
                    paddingLeft: contentArrowPadding,
                    paddingRight: contentArrowPadding,
                }

                const tokenTiles = tokens.map(t => <TokenTile token={t} onClick={() => openToken(t)} />)
                const loadingTiles = loadingTokens.map(c => <div className={c} />)

                const items = tokenTiles.concat(loadingTiles).map(tile =>
                    <div className={classes.itemSquare}>
                        <div className={classes.itemSizer} style={sizerCss}>
                            {tile}
                        </div>
                    </div>,
                )

                return (
                    <div className={classes.root}>
                        <div
                            ref={contentRef}
                            className={arrowsInside ? classes.content : classes.contentArrowsOutside}
                            style={contentStyle}
                        >
                            <AliceCarousel
                                ref={carouselRef}
                                items={items}
                                activeIndex={index}
                                onSlideChanged={onSlideChanged}
                                infinite={design.sliderLoop}
                                responsive={{0: {items: design.numColumns}}}
                                animationType="slide"
                                animationDuration={200}
                                touchTracking
                                disableDotsControls
                                preservePosition
                                renderPrevButton={() =>
                                    <NavBtn
                                        side="left"
                                        enabled={showLeftArrow}
                                        design={design}
                                        onClick={scrollLeft}
                                    />
                                }
                                renderNextButton={() =>
                                    <NavBtn
                                        side="right"
                                        enabled={showRightArrow}
                                        loading={design.sliderInfinite && state.isLoadingMore()}
                                        design={design}
                                        onClick={scrollRight}
                                    />
                                }
                            />
                        </div>
                    </div>
                )
            }}
        </FeedLayout>
    )
}

interface NavBtnProps {
    side: "left" | "right";
    enabled?: boolean;
    loading?: boolean;
    design: FeedDesign;
    onClick?: () => void;
}

function NavBtn({side, enabled, loading, design, onClick}: NavBtnProps) {
    if (!enabled) {
        return null
    }

    const isLeftBtn = (side === "left")
    const buttonClass = isLeftBtn ? classes.leftNavBtn : classes.rightNavBtn
    const isInside = design.sliderArrowPos === SliderArrowPosition.INSIDE
    const arrowSizeSmaller = design.sliderArrowSize * 0.1
    const arrowSizeLarger = design.sliderArrowSize * 1.05
    const arrowMargin = design.imgPadding + (design.sliderArrowSize * 0.4)
    const arrowOffset = Math.pow(design.sliderArrowSize * 0.2, 2) * 0.2

    const buttonStyle = {
        left: (!isLeftBtn && !isInside) ? arrowOffset + "px" : undefined,
        right: (isLeftBtn && !isInside) ? arrowOffset + "px" : undefined,
        width: arrowSizeLarger + "px",
        height: arrowSizeLarger + "px",
        padding: arrowSizeSmaller + "px",
        backgroundColor: Color.toCss(design.sliderArrowBgColor),
        cursor: loading ? "not-allowed" : "pointer",
        marginLeft: (isLeftBtn && isInside) ? arrowMargin + "px" : undefined,
        marginRight: (!isLeftBtn && isInside) ? arrowMargin + "px" : undefined,
    }

    const icon = isLeftBtn ? CaretLeftIcon : CaretRightIcon
    const iconStyle = {
        color: Color.toCss(design.sliderArrowColor),
        fontSize: design.sliderArrowSize,
        width: arrowSizeLarger + "px",
        height: arrowSizeLarger + "px",
        lineHeight: arrowSizeLarger + "px",
    }

    return (
        <div
            className={buttonClass}
            style={buttonStyle}
            onClick={!loading ? onClick : undefined}
            tabIndex={0}
            role="button">
            <Icon icon={icon} style={iconStyle} />
        </div>
    )
}

function getLastIdx(tokens: Token[], state: FeedState) {
    const design = state.getDesign()
    const numPosts = design.numPosts
    const numMedia = Math.min(tokens.length + (state.isLoading() ? numPosts : 0), state.getTotalNumTokens())

    return Math.max(0, numMedia - design.numColumns)
}
