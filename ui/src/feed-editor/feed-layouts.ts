import {GridLayoutIcon} from "spotlight/feed-editor/components/icons/GridLayoutIcon"
import {HighlightLayoutIcon} from "spotlight/feed-editor/components/icons/HighlightLayoutIcon"
import {MasonryLayoutIcon} from "spotlight/feed-editor/components/icons/MasonryLayoutIcon"
import {SliderLayoutIcon} from "spotlight/feed-editor/components/icons/SliderLayoutIcon"
import {ComponentType} from "react"

interface Layout {
  id: string;
  name: string;
  isPro?: boolean;
  isComingSoon?: boolean;
  icon: ComponentType;
}

export const FEED_LAYOUTS: readonly Layout[] = [
  {
    id: "grid",
    name: "Grid",
    icon: GridLayoutIcon,
    isPro: false,
    isComingSoon: false,
  },
  {
    id: "highlight",
    name: "Highlight",
    icon: HighlightLayoutIcon,
    isPro: true,
    isComingSoon: false,
  },
  {
    id: "masonry",
    name: "Masonry",
    icon: MasonryLayoutIcon,
    isPro: true,
    isComingSoon: false,
  },
  {
    id: "slider",
    name: "Slider",
    icon: SliderLayoutIcon,
    isPro: true,
    isComingSoon: false,
  },
]
