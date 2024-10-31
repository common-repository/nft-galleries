export function isScriptLoaded(id: string) {
    const script = document.getElementById(id);

    return script !== null && script.tagName.toLowerCase() === "script";
}
