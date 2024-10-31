export function cloneObj<T extends {}>(obj: T): T {
    if (obj instanceof Set) {
        // @ts-ignore
        return new Set(obj);
    }

    if (obj instanceof Array) {
        // @ts-ignore
        return obj.slice();
    }

    const result = Object.create(Object.getPrototypeOf(obj), {});

    Object.keys(obj).forEach((key) => {
        const val = obj[key];

        if (Array.isArray(val)) {
            result[key] = val.slice();
        } else if (val instanceof Map) {
            result[key] = new Map(val.entries());
        } else if (typeof val === "object" && val !== null) {
            result[key] = cloneObj(val);
        } else {
            result[key] = val;
        }
    });


    return result;
}
