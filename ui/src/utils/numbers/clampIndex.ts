import {clampNum} from "spotlight/utils/numbers/clampNum";

/**
 * Clamps a number to fit in the range of valid indices of a list.
 *
 * @param idx The index to clamp.
 * @param list The list.
 *
 * @return If the given index is already a valid index, it is returned unchanged. If outside the range of the valid
 *         indices for the given list, either 0 or the list's final index are returned depending on whether the given
 *         index was smaller than zero or greater than the list's final index, respectively.
 */
export function clampIndex(idx: number, list: { length: number }) {
    return clampNum(idx, 0, list.length - 1);

}
