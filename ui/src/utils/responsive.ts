import {isPlainObject} from "spotlight/utils/objects/isPlainObject";
import {cloneObj} from "spotlight/utils/objects/cloneObj";
import {Size} from "spotlight/utils/size";

export type ResponsiveMap<T = any> = {
    desktop: T;
    tablet?: T;
    phone?: T;
};

export type Responsive<T = any> = ResponsiveMap<T> | T;
export type NonResponsive<T extends Responsive> = T extends Responsive<infer R> ? R : any;

export type ResponsiveProps<T extends {}> = {
    [K in keyof T]: Responsive<T[K]>
}

export type NonResponsiveProps<T extends ResponsiveProps<any>> = T extends ResponsiveProps<infer R> ? R : any;

export type Device = keyof ResponsiveMap;

export const Device = {
    DESKTOP: "desktop" as Device,
    TABLET: "tablet" as Device,
    PHONE: "phone" as Device,
};

export namespace Responsive {
    export function create<T>(value: Responsive<T>): ResponsiveMap<T> {
        return isMap(value) ? value : {
            desktop: value,
            tablet: value,
            phone: value,
        };
    }

    export function get<T>(arg: Responsive<T>, device: Device, fallbackToDesktop: boolean = false): T {
        const argIsMap = isMap(arg);
        const value = argIsMap ? arg[device] : arg;
        const isValEmpty = value === undefined || value === null;

        return (argIsMap && isValEmpty && fallbackToDesktop) ? get(arg, Device.DESKTOP) : value;
    }

    // If the force arg is true, a non-object arg will be turned into an object before the device value is set
    // If the force arg is false, a non-object arg will result in the new value simply being returned
    export function set<T>(arg: Responsive<T>, device: Device, value: T, force: boolean = false): Responsive<T> {
        const argIsMap = isMap(arg);

        if (!argIsMap && !force) {
            return value;
        }

        const subject = argIsMap
            ? cloneObj(arg)
            : {desktop: arg} as ResponsiveMap<T>;

        subject[device] = value;

        return subject;
    }

    export function extract<T>(arg: Responsive<T>): T {
        if (!isMap(arg)) {
            return arg;
        }

        return arg.desktop ?? arg.tablet ?? arg.phone;
    }

    export function isMap<T>(arg: any): arg is ResponsiveMap<T> {
        return isPlainObject(arg) && arg.hasOwnProperty(Device.DESKTOP);
    }

    export function getDevice(size: Size): Device {
        if (size.width <= 768) {
            return Device.PHONE;
        }

        if (size.width <= 935) {
            return Device.TABLET;
        }

        return Device.DESKTOP;
    }
}
