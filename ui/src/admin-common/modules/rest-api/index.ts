import feeds from "spotlight/admin-common/modules/rest-api/feeds"
import settings from "spotlight/admin-common/modules/rest-api/settings"
import notifications from "spotlight/admin-common/modules/rest-api/notifications"
import cache from "spotlight/admin-common/modules/rest-api/cache"
import wp from "spotlight/admin-common/modules/rest-api/wp"
import wallets from "spotlight/admin-common/modules/rest-api/wallets"

export const AdminRestApi = {
    feeds,
    wallets,
    settings,
    notifications,
    cache,
    wp,
};
