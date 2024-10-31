type Recipe<T extends {}> = {
    [k in keyof T]: T[k] | (() => T[k]);
};

/**
 * Accepts an object recipe and creates a new object based on that recipe.
 *
 * The recipe is an object whose properties can either be fixed values or factory functions. The created object will
 * have the same properties. Their values depends on the value of the corresponding property in the recipe. If it is
 * a fixed value, the result's property will simply be equal to that value. If it is a factory function, the function
 * will be called and the result's property will be equal to the return value.
 *
 * *Example*:
 * ```
 * const obj = makeObj({
 *     a: 1,
 *     b: () => "hello",
 *     c: () => {
 *          const temp = someCalculation();
 *          const key = temp ? 0 : 1;
 *
 *          return temp[key];
 *     }
 * });
 *
 * // => {a: 1, b: "hello", c: ...}
 * ```
 *
 * @param obj
 */
export function makeObj<T extends {}>(obj: Recipe<T>): T {
    const newObj = {...obj};

    Object.keys(newObj).forEach(key => {
        newObj[key] = obj[key] instanceof Function
            ? obj[key]()
            : obj[key];
    });

    // @ts-ignore
    return newObj;
}
