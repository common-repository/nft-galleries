export interface Size {
    width: number;
    height: number;
}

/**
 * Scales a given size such that its larger dimension is contained within a target space, with the smaller dimension
 * being scaled with the same ratio.
 *
 * @param size The size to scale.
 * @param target The target space in which the given size should be contained.
 */
export function containSize(size: Size, target: Size): Size {
    const ratio = (size.width > size.height)
        ? target.width / size.width
        : target.height / size.height;

    return {
        width: size.width * ratio,
        height: size.height * ratio,
    };
}

/**
 * Scales a given size such that its smaller dimension fills a given target space, with the larger dimension being
 * scaled with the same ratio.
 *
 * @param size The size to scale.
 * @param target The target space which should be covered by the given size.
 */
export function coverSize(size: Size, target: Size): Size {
    const ratio = (size.width < size.height)
        ? target.width / size.width
        : target.height / size.height;

    return {
        width: size.width * ratio,
        height: size.height * ratio,
    };
}
