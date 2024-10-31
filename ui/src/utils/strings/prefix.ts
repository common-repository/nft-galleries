export function prefix (s: string, p: string) {
    return s.startsWith(p) ? s : p + s;
}
