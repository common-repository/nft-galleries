export function openWindow(url, target, options: WindowOptions = {}) {
    return window.open(url, target, windowOptions(options));
}

export function windowOptions(options: WindowOptions = {}) {
    return Object.getOwnPropertyNames(options).map((key) => `${key}=${options[key]}`).join(",");
}

export function getWindowCenterBounds(width, height) {
    const top = window.top.outerHeight / 2 + window.top.screenY - (height / 2);
    const left = window.top.outerWidth / 2 + window.top.screenX - (width / 2);

    return {top, left, width, height};
}

export function getWindowSize() {
    const {innerWidth: width, innerHeight: height} = window;

    return {width, height};
}

declare type YesNo = "yes" | "no";

interface WindowOptions {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    screenX?: number;
    screenY?: number;
    centerscreen?: YesNo;
    outerWidth?: number;
    outerHeight?: number;
    innerWidth?: number;
    innerHeight?: number;
    menubar?: YesNo;
    toolbar?: YesNo;
    location?: YesNo;
    personalbar?: YesNo;
    directories?: YesNo;
    status?: YesNo;
    dependent?: YesNo;
    minimizable?: YesNo;
    fullscreen?: YesNo;
    noopener?: YesNo;
    noreferrer?: YesNo;
    resizable?: YesNo;
    scrollbars?: YesNo;
    chrome?: YesNo;
    dialog?: YesNo;
    modal?: YesNo;
    titlebar?: YesNo;
    alwaysRaised?: YesNo;
    alwaysLowered?: YesNo;
    alwaysOnTop?: YesNo;
    close?: YesNo;
}
