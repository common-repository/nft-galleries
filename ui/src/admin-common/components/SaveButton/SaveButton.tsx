import styles from "./SaveButton.pcss"
import React, {ReactNode} from "react"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {classList} from "spotlight/utils/jsx/classes"

interface Props {
  className?: string;
  content?: (isSaving: boolean) => ReactNode;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  isSaving?: boolean;
}

export function SaveButton({className, content, tooltip, onClick, disabled, isSaving}: Props) {
  content = content ?? (isSaving => isSaving ? "Saving ..." : "Save")
  tooltip = tooltip ?? "Save"

  const handleClick = () => onClick && onClick()

  return (
    <Button
      className={classList(styles.root, className)}
      type={ButtonType.PRIMARY}
      size={ButtonSize.LARGE}
      tooltip={tooltip}
      onClick={handleClick}
      disabled={disabled}
    >
      {isSaving && <div className={styles.savingOverlay} />}
      {content(isSaving)}
    </Button>
  )
}
