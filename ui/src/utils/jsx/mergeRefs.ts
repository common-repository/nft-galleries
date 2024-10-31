export function mergeRefs(...refs) {
    return (el) => {
        refs.forEach((ref) => ref && setRef(ref, el));
    };
}

function setRef(ref, el) {
    if (typeof ref === "function") {
        ref(el);
    } else {
        ref.current = el;
    }
}
