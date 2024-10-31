export function mapToObj<T>(map: Map<string, T>, transform?: ([string, T]) => [string, any]) {
    return Array.from(map)
                .map(e => transform ? transform(e) : e)
                .reduce((obj, [k, v]) => Object.assign(obj, {[k]: v}), {});
}
