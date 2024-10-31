import React, {useCallback, useRef, useState} from "react"
import classes from "./FeedImportButton.pcss"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {Modal} from "spotlight/admin-common/components/Modal/Modal"
import styles from "spotlight/admin-common/components/ModalPrompt/ModalPrompt.pcss"
import {isPlainObject} from "spotlight/utils/objects/isPlainObject"

export type Props = {
  onImport: (data: any) => void;
};

export function FeedImportButton({onImport}: Props) {
  const button = useRef<HTMLButtonElement>()
  const textarea = useRef<HTMLTextAreaElement>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [value, setValue] = useState("")

  const openModal = useCallback(() => {
    setValue("")
    setIsModalOpen(true)
  }, [textarea, setIsModalOpen])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    button.current?.focus()
  }, [button, setIsModalOpen])

  const handleChangeValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }, [setValue])

  const handleImport = useCallback(() => {
    let parsed
    try {
      parsed = JSON.parse(value)
    } catch (e) {
      parsed = null
    }

    if (!isPlainObject(parsed) || !parsed?.hasOwnProperty("name") || !parsed?.hasOwnProperty("options")) {
      alert("The imported code is not valid")
    } else {
      onImport(parsed)
      closeModal()
    }
  }, [value, onImport, closeModal])

  return (
    <>
      <Button
        ref={button}
        type={ButtonType.SECONDARY}
        size={ButtonSize.LARGE}
        onClick={openModal}>
        <Dashicon icon="upload" />
        <span>Import a gallery</span>
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Import feed">
        <Modal.Content>
          <p className={classes.message}>Paste your exported gallery code:</p>
          <textarea
            ref={textarea}
            className={classes.field}
            value={value}
            onChange={handleChangeValue}
            autoFocus
            rows={4}
          />
        </Modal.Content>
        <Modal.Footer>
          <Button
            className={styles.button}
            type={ButtonType.SECONDARY}
            onClick={closeModal}
            children="Cancel"
          />

          <Button
            className={styles.button}
            type={ButtonType.PRIMARY}
            onClick={handleImport}
            children="Import"
          />
        </Modal.Footer>
      </Modal>
    </>
  )
}
