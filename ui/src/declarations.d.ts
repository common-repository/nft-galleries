declare module "*.scss";
declare module "*.css";
declare module "*.pcss";

declare module "*.png" {
    const value: any;
    export = value;
}

declare module "react-color-types" {
    export interface HSLColor {
        a?: number;
        h: number;
        l: number;
        s: number;
    }

    export interface RGBAColor {
        a?: number;
        b: number;
        g: number;
        r: number;
    }

    export type Color = string | HSLColor | RGBAColor;

    export interface MultiColor {
        hex: string;
        hsl: HSLColor;
        rgb: RGBAColor;
    }
}

declare module "popper" {
    import {ReactNode, Ref} from "react";

    export type Placement = "auto-start"
        | "auto"
        | "auto-end"
        | "top-start"
        | "top"
        | "top-end"
        | "right-start"
        | "right"
        | "right-end"
        | "bottom-end"
        | "bottom"
        | "bottom-start"
        | "left-end"
        | "left"
        | "left-start";

    export type DualPopperChildren = [(props: { ref: Ref<any> }) => ReactNode, ReactNode];
}

declare const elementor: {
    modules: {
        controls: {
            BaseData: {
                extend(param: {
                    saveValue: () => void;
                    onBeforeDestroy: () => void;
                    onReady: () => void
                });
                updateElementModel(value: any);
            };
        };
    };

    channels: {
        editor: {
            on(event: string, fn: () => void);
        };
    };

    hooks: {
        addAction(hook: string, fn: (...args) => void);
    };

    addControlView(id: string, view);
};

declare namespace elementorModules {
    namespace frontend {
        namespace handlers {
            abstract class Base<T extends {}> {
                $element: JQuery;
                elements: { [k in keyof T]: JQuery };

                getSettings(key: string);

                abstract getDefaultSettings();

                abstract getDefaultElements(): T;

                abstract bindEvents();
            }
        }
    }
}

declare const elementorFrontend: {
    elementsHandler: {
        addHandler(handler, options: object);
    };

    hooks: {
        addAction(hook: string, fn: (element: JQuery) => void);
    };
};
