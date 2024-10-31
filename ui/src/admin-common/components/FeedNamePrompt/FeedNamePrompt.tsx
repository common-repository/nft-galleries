import React, {ChangeEvent} from "react"
import styles from "./FeedNamePrompt.pcss"
import ModalPrompt from "spotlight/admin-common/components/ModalPrompt/ModalPrompt"

interface Props {
  isOpen: boolean;
  onAccept?: (name: string) => void;
  onCancel?: () => void;
}

export function FeedNamePrompt({isOpen, onAccept, onCancel}: Props) {
  const [feedName, setFeedName] = React.useState("")

  function save() {
    onAccept && onAccept(feedName)
  }

  function cancel() {
    onCancel && onCancel()
  }

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedName(e.target.value)
  }

  const handleKeyDownFeedName = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      save()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <ModalPrompt
      title="Gallery name"
      isOpen={isOpen}
      onCancel={cancel}
      onAccept={save}
      buttons={["Save", "Cancel"]}>
      <p className={styles.message}>Give this gallery a memorable name:</p>
      <input
        type="text"
        className={styles.input}
        value={feedName}
        onChange={change}
        onKeyDown={handleKeyDownFeedName}
        autoFocus={true}
      />
    </ModalPrompt>
  )
}
