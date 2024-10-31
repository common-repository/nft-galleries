import React, {ReactNode} from "react"
import styles from "./WizardNavbar.pcss"
import GenericNavbar, {NavItem} from "spotlight/admin-common/components/GenericNavbar/GenericNavbar"
import {Button, ButtonType} from "spotlight/admin-common/components/Button"
import {Dashicon} from "spotlight/common/components/Dashicon"

interface Props {
  steps: Array<NavItem>;
  current: string;
  onChangeStep?: (page: string) => void;
  children: ReactNode;
  firstStep?: ReactNode;
  lastStep?: ReactNode;
}

export default function WizardNavbar({children, steps, current, onChangeStep, firstStep, lastStep}: Props) {
  firstStep = firstStep ?? []
  lastStep = lastStep ?? []

  const currIdx = steps.findIndex(page => page.key === current) ?? 0

  const isFirstPage = currIdx <= 0
  const isLastPage = currIdx >= (steps.length - 1)

  const prevPage = isFirstPage ? null : steps[currIdx - 1]
  const nextPage = isLastPage ? null : steps[currIdx + 1]

  const gotoPrevPage = () => !isFirstPage && onChangeStep && onChangeStep(steps[currIdx - 1].key)
  const gotoNextPage = () => !isLastPage && onChangeStep && onChangeStep(steps[currIdx + 1].key)

  const left = isFirstPage ? firstStep : (
    <Button type={ButtonType.LINK} onClick={gotoPrevPage} className={styles.prevLink} disabled={prevPage.disabled}>
      <Dashicon icon="arrow-left-alt2" />
      <span>{prevPage.label}</span>
    </Button>
  )

  const right = isLastPage ? lastStep : (
    <Button type={ButtonType.LINK} onClick={gotoNextPage} className={styles.nextLink} disabled={nextPage.disabled}>
      <span>{nextPage.label}</span>
      <Dashicon icon="arrow-right-alt2" style={{marginRight: 0}} />
    </Button>
  )

  return (
    <GenericNavbar>
      {{
        path: [],
        left,
        right,
        center: children,
      }}
    </GenericNavbar>
  )
};
