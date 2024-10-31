export function arraySegregate<A, B>(array: (A | B)[], fn: (elem: A | B) => boolean): [A[], B[]] {
    const a = [];
    const b = [];

    array.forEach(elem => {
        if (fn(elem)) {
            a.push(elem);
        } else {
            b.push(elem);
        }
    });

    return [a, b];
}
