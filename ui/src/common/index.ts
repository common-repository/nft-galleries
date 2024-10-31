import {withPartial} from "spotlight/utils/objects/withPartial"

//  Declaration for the variable that is created by the backend using `wp_localize_script`
declare var SnftCommonConfig: {
    imagesUrl: string;
    restApi: {
        baseUrl: string;
        authToken?: string;
    }
};

// Add localization var to window type declaration
declare global {
    interface Window {
        SnftCommonConfig: typeof SnftCommonConfig;
    }
}

const DefaultCommonConfig = {
    imagesUrl: "",
    restApi: {
        baseUrl: "",
        authToken: "",
    },
    promotions: {
        autos: [],
        global: {},
    },
} as typeof SnftCommonConfig;

// Normalize config with defaults
window.SnftCommonConfig = withPartial(DefaultCommonConfig, SnftCommonConfig);

// The config for this bundle
export const Common = {
    config: SnftCommonConfig,
    isPro: true,
    image(filename: string) {
        return `${SnftCommonConfig.imagesUrl}/${filename}`;
    }
};
