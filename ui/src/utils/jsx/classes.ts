export function classList(...classes: string[]) {
    return classes.filter((c) => !!c).join(" ");
}

export function classMap(classes: Record<string, boolean>) {
    const list = Object.getOwnPropertyNames(classes).map((key) => classes[key] ? key : null);

    return classList(...list);
}

export function bemClass(className: string, modifiers: Record<string, boolean> = {}) {
    let pModifiers = Object.getOwnPropertyNames(modifiers)
                           .map((key) => modifiers[key] ? className + key : null);

    return className + " " + pModifiers.filter((c) => !!c).join(" ");
}
