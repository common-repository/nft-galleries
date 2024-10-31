import {hot} from "react-hot-loader"
import React, {useEffect} from "react"
import {Router} from "react-router-dom"
import {MetaMaskProvider} from "metamask-react"
import {Provider, useDispatch, useSelector} from "react-redux"
import {QueryRoute} from "spotlight/admin-common/components/QueryRoute"
import {Screens} from "spotlight/admin-common/stores/ScreensStore"
import {AdminLoading} from "spotlight/admin/components/AdminLoading/AdminLoading"
import {NewsBeacon} from "spotlight/admin-common/components/NewsBeacon/NewsBeacon"
import {Toaster} from "spotlight/admin-common/components/Toaster/Toaster"
import {ModalLayer} from "spotlight/admin-common/components/ModalLayer/ModalLayer"
import {FetchFailEvent} from "spotlight/feed"
import {AdminAppStore} from "spotlight/admin/store"
import {selectIsAdminAppLoaded, selectIsAdminAppLoading} from "spotlight/admin/store/app/selectors"
import {removeToast, showToast, ToastType} from "spotlight/admin-common/stores/toasts"
import {RouterHistory} from "spotlight/admin-common/stores/router"
import {selectScreen} from "spotlight/admin-common/stores/router/selectors"
import {RestApi} from "spotlight/common/modules/rest-api"
import {triggerError} from "spotlight/common/modules/errors/handlers"

/**
 * The template for the document title, used to change the title on navigation to include the screen name.
 * This should be generated from the document's current title (by the first AdminRoot element to be rendered), where
 * the generated string contains a "%s" token where the current page title will be injected.
 */
const titleTemplate: string = document.title.replace("Spotlight", "%s ‹ Spotlight")

export const AdminRoot = hot(module)(function AdminRoot() {
    return (
        <Provider store={AdminAppStore}>
            <MetaMaskProvider>
                <AdminRootInner />
            </MetaMaskProvider>
        </Provider>
    )
})

export function AdminRootInner() {
    const dispatch = useDispatch()
    const isLoaded = useSelector(selectIsAdminAppLoaded)
    const isLoading = useSelector(selectIsAdminAppLoading)
    const screenId = useSelector(selectScreen)

    useEffect(() => {
        // Get the current screen
        const screen = Screens.getScreen(screenId)

        // Update the document title
        if (screen) {
            document.title = titleTemplate.replace("%s", screen.title)
        }
    }, [screenId])

    const onFetchFail = (e: CustomEvent<FetchFailEvent.Data>) => {
        const message = e.detail.message ?? e.detail.response.data.message ?? null

        triggerError({
            type: "feed/fetch_media/error",
            message: message,
        })
    }

    const onImportStart = () => {
        dispatch(showToast({
            key: "admin/feed/import/pending",
            type: ToastType.STICKY,
            message: "Importing your NFTs from the blockchain. This may take around 30 seconds.",
        }))
    }

    const onImportSuccess = (e: CustomEvent<{ batching: boolean, errors?: string[] }>) => {
        if (e?.detail?.batching) {
            dispatch(showToast({
                key: "admin/feed/import/done",
                type: ToastType.NOTIFICATION,
                message: "Imported the first set of NFTs. The rest of the NFTs are being imported in the background.",
            }))
        }

        if (Array.isArray(e?.detail.errors) && e.detail.errors.length > 0) {
            let message: string
            if (e.detail.errors.length === 1) {
                message = e.detail.errors[0]
            } else {
                const errorList = e.detail.errors.map(e => " • " + e).join("\n")
                message = "Spotlight encountered some problems while importing NFTs from the blockchain:\n\n" + errorList
            }

            dispatch(showToast({
                key: "admin/feed/import/errors",
                type: ToastType.STICKY,
                message,
            }))
        }
    }

    const onImportFail = (event: ErrorEvent) => {
        triggerError({
            type: "feed/import_media/error",
            message: event.message,
        })
    }

    const onImportEnd = () => {
        dispatch(removeToast("admin/feed/import/pending"))
    }

    useEffect(() => {
        document.addEventListener(FetchFailEvent.Type, onFetchFail)
        document.addEventListener(RestApi.tokens.events.import.start, onImportStart)
        document.addEventListener(RestApi.tokens.events.import.success, onImportSuccess)
        document.addEventListener(RestApi.tokens.events.import.fail, onImportFail)
        document.addEventListener(RestApi.tokens.events.import.end, onImportEnd)

        return () => {
            document.removeEventListener(FetchFailEvent.Type, onFetchFail)
            document.removeEventListener(RestApi.tokens.events.import.start, onImportStart)
            document.removeEventListener(RestApi.tokens.events.import.success, onImportSuccess)
            document.removeEventListener(RestApi.tokens.events.import.fail, onImportFail)
            document.removeEventListener(RestApi.tokens.events.import.end, onImportEnd)
        }
    }, [])

    if (isLoading || !isLoaded) {
        return (
            <>
                <AdminLoading />
                <Toaster />
            </>
        )
    }

    return (
        <React.StrictMode>
            <Router history={RouterHistory}>
                {Screens.getList().map((screen, idx) => (
                    <QueryRoute
                        key={screen.id}
                        when="screen"
                        is={screen.id}
                        isRoot={idx === 0}
                        render={() => React.createElement(screen.component)}
                    />
                ))}

                <NewsBeacon />

                <ModalLayer />

                <Toaster />
            </Router>
        </React.StrictMode>
    )
}
