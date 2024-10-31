/**
 * Clamps a number to fit in a range.
 *
 * @param num The index to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 *
 * @return If the given number lies between min and max, it is returned. If it is smaller than min, min will be
 *         returned. If it is larger than max, max will be returned.
 */
export function clampNum(num: number, min: number, max: number) {
    return Math.max(min, Math.min(max, num));
}
