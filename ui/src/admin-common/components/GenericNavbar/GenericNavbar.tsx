import React, {ReactNode} from "react"
import styles from "./GenericNavbar.pcss"
import {SpotlightLogo} from "spotlight/admin-common/components/SpotlightLogo/SpotlightLogo"

type PathStyle = "none" | "line" | "chevron";

export interface NavItem {
  key: string;
  label: string | ReactNode;
  disabled?: boolean;
}

interface Props {
  children: {
    path?: Array<ReactNode>,
    left?: ReactNode,
    right?: ReactNode,
    center?: ReactNode,
  };
  pathStyle?: PathStyle;
}

export default function GenericNavbar({children, pathStyle}: Props) {
  let {path, left, right, center} = children

  path = path ?? []
  left = left ?? []
  right = right ?? []
  center = center ?? []

  return (
    <div className={styles.root}>
      <div className={styles.leftList}>
        <div className={styles.pathList}>
          {path.map((el, idx) => (
            <PathSegment key={idx} style={pathStyle}>
              <div className={styles.item}>{el}</div>
            </PathSegment>
          ))}
        </div>

        <div className={styles.leftList}>
          <ItemList>{left}</ItemList>
        </div>
      </div>

      <div className={styles.centerList}>
        <ItemList>{center}</ItemList>
      </div>

      <div className={styles.rightList}>
        <ItemList>{right}</ItemList>
      </div>
    </div>
  )
};

export function SpotlightNavbarLogo() {
  return <SpotlightLogo />
}

function ItemList({children}) {
  const childEls = Array.isArray(children) ? children : [children]

  return (
    <>
      {childEls.map((el, idx) => <Item key={idx}>{el}</Item>)}
    </>
  )
}

function Item({children}) {
  return (
    <div className={styles.item}>
      {children}
    </div>
  )
}

interface PathSegmentProps {
  style: PathStyle;
  children: React.ReactElement;
}

function PathSegment({children, style}: PathSegmentProps) {
  return (
    <div className={styles.pathSegment}>
      {children}
      <Separator style={style} />
    </div>
  )
}

const LINE_SVG_PATH = "M50 0 L50 100"
const CHEVRON_SVG_PATH = "M0 0 L100 50 L0 100"

function Separator({style}: { style: PathStyle }) {
  if (style === "none") {
    return null
  }

  const path = (style === "chevron")
    ? CHEVRON_SVG_PATH
    : LINE_SVG_PATH

  return (
    <div className={styles.separator}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="currentcolor" strokeLinejoin="bevel" />
      </svg>
    </div>
  )
}
