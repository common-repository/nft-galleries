import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import styles from "./FeedsList.pcss"
import {selectFeeds} from "spotlight/admin-common/stores/feeds/selectors"
import {deleteFeed, duplicateFeed} from "spotlight/admin-common/stores/feeds/thunks"
import {Dashicon} from "spotlight/common/components/Dashicon"
import {Link} from "spotlight/admin-common/components/Link"
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button"
import Table, {TableStyleMap} from "spotlight/admin-common/components/Table/Table"
import {SCREENS} from "spotlight/admin-common/stores/ScreensStore"
import {MenuContent, MenuItem, MenuSeparator, StatefulMenu} from "spotlight/admin-common/components/Containers/Menu"
import {Ellipsis} from "spotlight/admin-common/components/Ellipsis"
import {CopyShortcode} from "spotlight/admin-common/components/Feeds/CopyShortcode"
import WalletInfoModal from "spotlight/admin-common/components/WalletInfoModal"
import {Responsive} from "spotlight/utils/responsive"
import {Feed} from "spotlight/admin-common/stores/feeds"
import {removeToast, showToast, ToastType} from "spotlight/admin-common/stores/toasts"
import {gotoRoute} from "spotlight/admin-common/stores/router"
import CopyToClipboard from "react-copy-to-clipboard"
import {getErrorResponseMessage} from "spotlight/common/modules/rest-api/client"
import {RestApi} from "spotlight/common/modules/rest-api"
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api"
import {triggerError} from "spotlight/common/modules/errors/handlers"
import {selectWalletList} from "spotlight/admin-common/stores/wallets/selectors"
import {Wallet} from "spotlight/common/modules/wallets"

export function FeedsList() {
  const dispatch = useDispatch()
  const feeds = useSelector(selectFeeds)

  const handleDelete = (feed) => {
    if (confirm("Are you sure you want to delete this gallery? This cannot be undone.")) {
      dispatch(deleteFeed(feed))
    }
  }

  const handleUpdatePosts = async (feed) => {
    const response = await RestApi.tokens.import(feed.options)

    if (!response?.data?.batching) {
      dispatch(showToast({
        key: "admin/feeds/import/done",
        message: `Finished importing NFTs for "${feed.name}".`,
      }))
    }
  }

  const editFeed = (feed: Feed) => {
    dispatch(gotoRoute({
      screen: SCREENS.EDIT_FEED,
      id: feed.id.toString(),
    }))
  }

  const handleDuplicateFeed = (feed: Feed) => {
    dispatch(duplicateFeed(feed))
  }

  const handleClearCache = async (feed) => {
    dispatch(showToast({
      key: "admin/feeds/clear_cache/wait",
      message: `Clearing the cache for "${feed.name}". This could take a while. Please wait ...`,
      type: ToastType.STICKY,
    }))

    try {
      await AdminRestApi.cache.clearForFeed(feed)
      dispatch(showToast({
        key: "admin/feeds/clear_cache/done",
        message: `Finished clearing the cache for "${feed.name}."`,
      }))
    } catch (error) {
      triggerError({
        type: "feeds/clear_cache/error",
        message: getErrorResponseMessage(error),
      })
    } finally {
      dispatch(removeToast("admin/feeds/clear_cache/wait"))
    }
  }

  function onExport() {
    dispatch(showToast({
      key: "admin/feeds/export",
      message: "Copied export code to clipboard!",
    }))
  }

  const styleMap: TableStyleMap = {
    cols: {
      name: styles.nameCol,
      sources: styles.sourcesCol,
      usages: styles.usagesCol,
      actions: styles.actionsCol,
    },
    cells: {
      name: styles.nameCell,
      sources: styles.sourcesCell,
      usages: styles.usagesCell,
      actions: styles.actionsCell,
    },
  }

  return (
    <div className="feeds-list">
      <Table
        styleMap={styleMap}
        rows={feeds}
        cols={[
          {
            id: "name",
            label: "Name",
            render: (feed) => {
              const editLink = {screen: SCREENS.EDIT_FEED, id: feed.id.toString()}

              return (
                <div>
                  <Link to={editLink} className={styles.name}>
                    {feed.name ? feed.name : "(no name)"}
                  </Link>

                  {/*
                  <div className={styles.metaList}>
                    <span className={styles.id}>
                      ID: {feed.id}
                    </span>
                    <span className={styles.layout}>
                      {Responsive.extract(feed.options.layout)?.toUpperCase() ?? "GRID"}
                    </span>
                  </div>
                  */}
                </div>
              )
            },
          },
          {
            id: "sources",
            label: "Shows NFTs from",
            render: (feed) => <FeedSources feed={feed} />,
          },
          {
            id: "usages",
            label: "Instances",
            render: (feed) => <FeedUsages feed={feed} />,
          },
          {
            id: "actions",
            label: "Actions",
            render: (feed) => (
              <div className={styles.actionsList}>
                <StatefulMenu>
                  {({ref, openMenu}) => (
                    <Button
                      ref={ref}
                      className={styles.actionsBtn}
                      type={ButtonType.PILL}
                      size={ButtonSize.NORMAL}
                      onClick={openMenu}>
                      <Ellipsis />
                    </Button>
                  )}
                  <MenuContent>
                    <MenuItem onClick={() => editFeed(feed)}>
                      <Dashicon icon="edit" />
                      Edit gallery
                    </MenuItem>

                    <MenuItem onClick={() => handleDuplicateFeed(feed)}>
                      <Dashicon icon="admin-page" />
                      Duplicate gallery
                    </MenuItem>

                    <MenuSeparator />

                    <CopyShortcode feed={feed}>
                      <MenuItem>
                        <Dashicon icon="editor-code" />
                        Copy shortcode
                      </MenuItem>
                    </CopyShortcode>

                    <CopyToClipboard text={getExportCode(feed)} onCopy={onExport}>
                      <MenuItem>
                        <Dashicon icon="download" />
                        Export gallery
                      </MenuItem>
                    </CopyToClipboard>

                    <MenuSeparator />

                    <MenuItem onClick={() => handleUpdatePosts(feed)}>
                      <Dashicon icon="image-rotate" />
                      Update NFTs
                    </MenuItem>

                    <MenuItem onClick={() => handleClearCache(feed)}>
                      <Dashicon icon="database-remove" />
                      Clear cache
                    </MenuItem>

                    <MenuSeparator />

                    <MenuItem onClick={() => handleDelete(feed)} danger>
                      <Dashicon icon="trash" />
                      Delete gallery
                    </MenuItem>
                  </MenuContent>
                </StatefulMenu>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

function getExportCode(feed: Feed) {
  return JSON.stringify({name: feed.name, options: feed.options})
}

interface SourcesProps {
  feed: Feed;
}

function FeedSources({feed}: SourcesProps) {
  const wallets = useSelector(selectWalletList(feed.options.wallets))

  // The info to show in the bottom row
  let info = []

  // Add selected accounts to info
  wallets.forEach(wallet => {
    if (wallet) {
      info.push(<FeedWallet wallet={wallet} />)
    }
  })

  // If no sources were added to info, add a message
  if (info.length === 0) {
    info.push((
      <div className={styles.noSourcesMsg}>
        <Dashicon icon="warning" />
        <span>Gallery shows no NFTs</span>
      </div>
    ))
  }

  return (
    <div className={styles.sourcesList}>
      {info.map((elem, idx) => elem && <Source key={idx}>{elem}</Source>)}
    </div>
  )
}

interface UsagesProps {
  feed: Feed;
}

const FeedUsages = ({feed}: UsagesProps) => {
  return (
    <div className={styles.usagesList}>
      {feed.usages.map((usage, idx) => (
        <div key={idx} className={styles.usage}>
          <a
            className={styles.usageLink}
            href={usage.link}
            target="_blank">
            {usage.name}
          </a>
          <span className={styles.usageType}>({usage.type})</span>
        </div>
      ))}
    </div>
  )
}

interface FeedAccountProps {
  wallet: Wallet;
  onClick?: () => void;
}

function FeedWallet({wallet, onClick}: FeedAccountProps) {
  return (
    <div className={styles.accountSource} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={0}>
      <Dashicon icon="tag" />
      {wallet.name}
    </div>
  )
}

const Source = ({children}) => (
  <div className={styles.source}>{children}</div>
)
