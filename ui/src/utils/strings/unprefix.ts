export function unprefix(s: string, p: string) {
    return s.startsWith(p) ? s.substr(p.length) : s;
}
