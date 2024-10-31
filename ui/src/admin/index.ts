import "react-hot-loader"
import "spotlight/admin/styles/wp-admin.pcss"
import "spotlight/admin-common/styles/admin.scss"
import "spotlight/admin-common/styles/wp-notices.scss"
import React from "react"
import ReactDOM from "react-dom"
import {runWhenDomReady} from "spotlight/utils/dom"
import AdminCommon from "spotlight/admin-common/AdminCommon"
import {AdminAppStore} from "spotlight/admin/store"
import {showToast, ToastType} from "spotlight/admin-common/stores/toasts"
import {addErrorHandler, triggerError} from "spotlight/common/modules/errors/handlers"
import {loadAdminApp} from "spotlight/admin/store/app/thunks"
import {Screens} from "spotlight/admin-common/stores/ScreensStore"
import {gotoScreen} from "spotlight/admin-common/stores/router"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {selectScreen} from "spotlight/admin-common/stores/router/selectors"
import {getRouteAbsUrl} from "spotlight/admin-common/stores/router/functions"
import {SettingsScreen} from "spotlight/admin-common/components/SettingsScreen/SettingsScreen"
import {FeedsScreen} from "spotlight/admin-common/components/FeedsScreen/FeedsScreen"
import {NewFeedScreen} from "spotlight/admin-common/components/NewFeedScreen/NewFeedScreen"
import {EditFeedScreen} from "spotlight/admin-common/components/EditFeedScreen/EditFeedScreen"
import {
  SETTINGS_SAVE_FAILED,
  SETTINGS_SAVE_SUCCESS,
  SettingsSavedEvent,
} from "spotlight/admin-common/stores/settings/events"
import {AdminRoot} from "spotlight/admin/components/AdminRoot"

//=====================================================================
// ERRORS
//=====================================================================

addErrorHandler(error => {
  const key = error.type ?? "generic"

  AdminAppStore.dispatch(showToast({
    key: `admin/${key}`,
    message: error.message,
    details: error.details,
    type: ToastType.ERROR,
  }))

  console.error("Spotlight error", error.message, error.details)
})

//=====================================================================
// SCREENS
//=====================================================================

Screens.register({
  id: "galleries",
  title: "Galleries",
  position: 0,
  component: FeedsScreen,
})

Screens.register({
  id: "new",
  title: "Add New",
  isHidden: true,
  component: NewFeedScreen,
})

Screens.register({
  id: "edit",
  title: "Edit",
  isHidden: true,
  component: EditFeedScreen,
})

Screens.register({
  id: "settings",
  title: "Settings",
  position: 50,
  component: SettingsScreen,
})

//=====================================================================
// EVENTS
//=====================================================================

document.addEventListener(SETTINGS_SAVE_SUCCESS, () => {
  AdminAppStore.dispatch(showToast({
    key: "admin/settings/saved",
    message: "Settings saved.",
  }))
})

document.addEventListener(SETTINGS_SAVE_FAILED, (e: CustomEvent<SettingsSavedEvent>) => {
  triggerError({
    type: "settings/save/error",
    message: e.detail.error,
  })
})

//=====================================================================
// LOAD
//=====================================================================

AdminAppStore.dispatch(loadAdminApp())

//=====================================================================
// WP ADMIN MENU
//=====================================================================

// Change the submenu in the WP Admin menu from direct links to router links and make them react to route
// changes in the app to update which entry is highlighted as the current page.

// Get the menu entries
const topMenu = document.getElementById("toplevel_page_snft")

if (topMenu) {
  const subMenu = topMenu.querySelector("ul.wp-submenu")
  const menuLiIter = subMenu.querySelectorAll("li:not(.wp-submenu-head)")
  const menuList = Array.from(menuLiIter)

  const state = AdminAppStore.getState()
  Screens.getList().forEach(screen => {
    const screenState = screen.state || {}
    const screenQuery = withPartial({screen: screen.id}, screenState)
    const screenUrl = getRouteAbsUrl(state.router, screenQuery)

    // Find the menu entry whose link matches the screen's URL
    const listEl = menuList.find(el => el.querySelector("a").href === screenUrl)
    // Stop if no matching entry
    if (!listEl) return

    // Add a custom attribute to the menu item to easily find it later using the screen ID
    listEl.setAttribute("data-screen", screen.id)

    // Change the click behavior of the link to push history state, rather than navigate
    listEl.querySelector("a").addEventListener("click", (e) => {
      AdminAppStore.dispatch(gotoScreen(screen.id))
      e.preventDefault()
      e.stopPropagation()
    })
  })

  AdminAppStore.subscribe(() => {
    const state = AdminAppStore.getState()
    const currentScreen = selectScreen(state)

    // Remove the "current" class from any menu item
    menuList.forEach(el => el.classList.remove("current"))
    // Add the "current" class to the menu item that corresponds to the current screen
    const currMenuItem = menuList.find(el => el.getAttribute("data-screen") === currentScreen)
    if (currMenuItem) {
      currMenuItem.classList.add("current")
    }
  })
}

//=====================================================================
// MOUNT APP
//=====================================================================

const root = document.getElementById(AdminCommon.config.rootId)
if (root) {
  root.classList.add("wp-core-ui-override")

  runWhenDomReady(() => {
    ReactDOM.render(React.createElement(AdminRoot), root)
  })
}
