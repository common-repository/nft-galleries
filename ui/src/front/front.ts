import React from "react";
import ReactDOM from "react-dom";
import {runWhenDomReady} from "spotlight/utils/dom";
import {FeedEntityResolver, FeedOptions, FeedState} from "spotlight/feed";
import {getWindowSize} from "spotlight/utils/windows";
import {FrontApp} from "spotlight/front/components/FrontApp";
import {Responsive} from "spotlight/utils/responsive";
import {isObjectEmpty} from "spotlight/utils/objects/isObjectEmpty";

declare global {
    interface SlNftFrontApp {
        run(): void;
    }

    interface Window {
        SpotlightNfts: {
            instances: Array<SlNftFrontApp>;
            init(options?: Options): void;
            feed(element: Element, options?: Options): void;
        };

        SnftFrontCtx: {
            [k: number]: FeedOptions;
        };

        SnftWalletInfo: {
            [k: number]: Account[];
        }

        SnftPreloadedTokens: {
            [k: number]: Account[];
        }
    }
}

interface Options {
    silent?: boolean;
}

export function init(options: Options = {}) {
    const elements = document.getElementsByClassName("nft-gallery");

    for (let i = 0, num = elements.length || 0; i < num; ++i) {
        const instance = feed(elements[i], options);

        if (instance) {
            window.SpotlightNfts.instances[i] = instance;
        }
    }
}

export function feed(element: Element, options: Options = {}) {
    const galleryKey = element.getAttribute("data-gallery-var");
    const feedCtx = getFeedContext(galleryKey);
    const walletCtx = getWalletContext(galleryKey);
    const tokenPreload = getPreloadedTokens(galleryKey);

    if (galleryKey && typeof feedCtx === "object" && Array.isArray(walletCtx)) {
        if (element.children.length > 0) {
            if (!options.silent) {
                console.warn("A gallery could not be created because its DOM node is not empty");
            }
        } else {
            const device = Responsive.getDevice(getWindowSize());
            let feedState = new FeedState(feedCtx, device, FeedEntityResolver.forFrontApp(walletCtx));

            if (!isObjectEmpty(tokenPreload)) {
                [feedState] = feedState.load(tokenPreload);
            }

            const app = {
                run() {
                    const frontApp = React.createElement(FrontApp, {feedState});
                    ReactDOM.render(frontApp, element);
                },
            };

            runWhenDomReady(() => app.run());

            return app;
        }
    }

    return null;
}


if (!window.SnftFrontCtx) {
    window.SnftFrontCtx = {};
}

if (!window.SnftWalletInfo) {
    window.SnftWalletInfo = {};
}

if (!window.SnftPreloadedTokens) {
    window.SnftPreloadedTokens = {};
}

if (!window.SpotlightNfts) {
    window.SpotlightNfts = {
        instances: [],
        init,
        feed,
    };
}

function getContextJson(id: string) {
    const ctxElem = document.getElementById(id);

    return (ctxElem && ctxElem.hasAttribute("data-json"))
        ? JSON.parse(ctxElem.getAttribute("data-json"))
        : null;
}

function getFeedContext(name: string) {
    return SnftFrontCtx[name] = SnftFrontCtx.hasOwnProperty(name)
        ? SnftFrontCtx[name]
        : getContextJson(`snft__f__${name}`);
}

function getWalletContext(name: string) {
    return SnftWalletInfo[name] = SnftWalletInfo.hasOwnProperty(name)
        ? SnftWalletInfo[name]
        : getContextJson(`snft__w__${name}`);
}

function getPreloadedTokens(name: string) {
    return SnftPreloadedTokens[name] = SnftPreloadedTokens.hasOwnProperty(name)
        ? SnftPreloadedTokens[name]
        : getContextJson(`snft__t__${name}`);
}

export const SnftFrontCtx = window.SnftFrontCtx;
export const SnftWalletInfo = window.SnftWalletInfo;
export const SnftPreloadedTokens = window.SnftPreloadedTokens;
