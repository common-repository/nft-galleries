import React, {ReactNode, useContext} from "react"
import classes from "./FeedEditorNavbar.pcss"
import {FeedEditorActions} from "spotlight/feed-editor/store"
import {useDispatch, useSelector} from "react-redux"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import {useEditorSelector} from "spotlight/feed-editor/store/hooks"
import {selectFeedName, selectFeedOptions} from "spotlight/feed-editor/store/selectors"
import {SaveButton} from "spotlight/admin-common/components/SaveButton/SaveButton"
import {FeedNameField} from "spotlight/admin-common/components/FeedNameField/FeedNameField"
import {FeedNamePrompt} from "spotlight/admin-common/components/FeedNamePrompt/FeedNamePrompt"
import {useFeedEditorContext} from "spotlight/feed-editor/context"
import {ProPill} from "spotlight/admin-common/components/ProPill/ProPill"
import {
  ResponsiveContainer,
  ResponsiveContext,
} from "spotlight/admin-common/components/ResponsiveContainer/ResponsiveContainer"
import {Screen} from "spotlight/admin-common/modules/screen-sizes"
import WizardNavbar from "spotlight/admin-common/components/WizardNavbar/WizardNavbar"
import PageMenuNavbar from "spotlight/admin-common/components/PageMenuNavbar/PageMenuNavbar"
import TabNavbar from "spotlight/admin-common/components/TabNavbar/TabNavbar"
import {SpotlightNavbarLogo} from "spotlight/admin-common/components/GenericNavbar/GenericNavbar"
import {FeedState} from "spotlight/feed"
import {ProUpgradeBtn} from "spotlight/admin-common/components/ProUpgradeBtn/ProUpgradeBtn"
import {selectWallets} from "spotlight/admin-common/stores/wallets/selectors"

export function FeedEditorNavbar() {
  return (
    <ResponsiveContainer breakpoints={Screen.Sizes.ALL}>
      <ResponsiveNavbar />
    </ResponsiveContainer>
  )
}

function ResponsiveNavbar() {
  const dispatch = useDispatch()
  const feedLabel = useSelector(selectFeedName)
  const feedName = useEditorSelector(state => state.feedName)
  const showPro = useEditorSelector(state => state.showProOptions)
  const isSaving = useEditorSelector(state => state.isSaving)
  const isDirty = useEditorSelector(state => state.isDirty)
  const isPromptingName = useEditorSelector(state => state.isPromptingName)
  const {config} = useFeedEditorContext()
  const breakpoint = useContext(ResponsiveContext)

  const wallets = useSelector(selectWallets)
  const options = useSelector(selectFeedOptions)
  const sources = FeedState.getSources(options, {
    getWallet: address => wallets.find(wallet => wallet.address === address),
  })

  const hasSources = sources.wallets.length > 0

  // Default current tab to first tab if its empty in the store
  let currentTab = useEditorSelector(state => state.currentTab)
  currentTab = currentTab ? currentTab : config.tabs[0].id

  const setTab = (tabId: string) => dispatch(FeedEditorActions.changeTab(tabId))
  const rename = (name: string) => dispatch(FeedEditorActions.renameFeed(name))

  function save() {
    dispatch(FeedEditorActions.saveFeed(config.onSave))
  }

  function cancel() {
    return config.onCancel && config.onCancel()
  }

  function submitNamePrompt(name: string) {
    rename(name)
    save()
  }

  function cancelNamePrompt() {
    dispatch(FeedEditorActions.hideNamePrompt())
  }

  const tabs = (config.isPro || showPro)
    ? config.tabs
    : config.tabs.filter(tab => !tab.isPro)

  const navItems = tabs.map(tab => ({
    key: tab.id,
    label: <NavItem label={tab.label} isFakePro={tab.isPro && !config.isPro} />,
    disabled: tab.requireSources && !hasSources,
  }))

  const nameField = config.showNameField
    ? <FeedNameField key="name-field" name={feedName} label={feedLabel} onDone={rename} />
    : undefined

  const saveBtn = config.showSaveBtn
    ? <SaveButton
      key="save-button"
      className={classes.button}
      disabled={!isDirty}
      isSaving={isSaving}
      onClick={save}
      content={isSaving => isSaving ? "Saving ..." : config.saveBtnText}
    />
    : undefined

  const cancelBtn = config.showCancelBtn
    ? <Button
      key="cancel-button"
      className={classes.button}
      type={ButtonType.DANGER_PILL}
      size={ButtonSize.LARGE}
      onClick={cancel}
      disabled={!config.canAlwaysCancel && (isSaving || !isDirty)}
      children={config.cancelBtnText}
    />
    : undefined

  const upgradeBtn = config.isDemo
    ? <ProUpgradeBtn key="upgrade-button">Get PRO</ProUpgradeBtn>
    : undefined

  let navbar
  if (breakpoint <= Screen.Sizes.SMALL) {
    navbar = (
      <WizardNavbar
        steps={navItems}
        current={currentTab}
        onChangeStep={setTab}
        firstStep={cancelBtn}
        lastStep={upgradeBtn ?? saveBtn}
        children={nameField}
      />
    )
  } else if (breakpoint <= Screen.Sizes.MEDIUM) {
    navbar = (
      <PageMenuNavbar
        pages={navItems}
        current={currentTab}
        onChangePage={setTab}
        hideMenuArrow={true}
        showNavArrows={true}
        children={{
          path: nameField ? [nameField] : [],
          right: [cancelBtn, saveBtn, upgradeBtn],
        }}
      />
    )
  } else {
    const path: Array<ReactNode> = [<SpotlightNavbarLogo key="logo" />]
    if (nameField) {
      path.push(nameField)
    }

    navbar = (
      <TabNavbar current={currentTab} onClickTab={setTab}>
        {{
          path,
          tabs: navItems,
          right: [cancelBtn, saveBtn, upgradeBtn],
        }}
      </TabNavbar>
    )
  }

  return (
    <>
      {navbar}
      <FeedNamePrompt
        isOpen={isPromptingName}
        onAccept={submitNamePrompt}
        onCancel={cancelNamePrompt}
      />
    </>
  )
}

function NavItem({label, isFakePro}) {
  return isFakePro
    ? <FakeProNavItem>{label}</FakeProNavItem>
    : <span>{label}</span>
}

function FakeProNavItem({children}) {
  return (
    <span className={classes.fakeProItem}>
      <ProPill className={classes.proPill} />
      <span>{children}</span>
    </span>
  )
}
