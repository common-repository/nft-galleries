import "./styles/fields.pcss"
import {client} from "spotlight/common/modules/rest-api/client"
import {RestApi} from "spotlight/common/modules/rest-api"
import {FakePreview} from "spotlight/feed-editor/config"
import {AdminRestApi} from "spotlight/admin-common/modules/rest-api"

// The type of the localized variable from the server
declare var SnftAdminCommonConfig: {
    adminUrl: string;
    restApi: {
        wpNonce: string;
    },
    cronSchedules: Array<{ key: string, display: string, interval: number }>;
    hasElementor: boolean;
    preview: FakePreview;
};

// Add localization var to window type declaration
declare global {
    interface Window {
        SnftAdminCommonConfig: typeof SnftAdminCommonConfig;
    }
}

export const AdminCommonConfig = SnftAdminCommonConfig;

// Add the WordPress REST API nonce to requests
client.interceptors.request.use(config => {
    config.headers["X-WP-Nonce"] = SnftAdminCommonConfig.restApi.wpNonce;

    return config;
}, (error) => Promise.reject(error));

// The config for this bundle
const AdminCommon = {
    config: {
        rootId: "snft-admin",
        adminUrl: SnftAdminCommonConfig.adminUrl,
        cronSchedules: SnftAdminCommonConfig.cronSchedules,
        cronScheduleOptions: SnftAdminCommonConfig.cronSchedules.map(schedule => ({
            value: schedule.key,
            label: schedule.display,
        })),
        postTypes: [],
        hasElementor: SnftAdminCommonConfig.hasElementor,
        searchPosts: async (type: string, search: string = "") => {
            const response = await AdminRestApi.wp.posts.search(type, search);

            return response.data;
        },
        customPosts: {
            enabled: false,
        },
    },
    restApi: {
        config: SnftAdminCommonConfig.restApi,
    },
    editor: {
        preview: SnftAdminCommonConfig.preview,
    },
};

export default AdminCommon;

// Allow automatic of media imports when media fetch responses do not contain media
RestApi.config.autoImportMedia = true;
