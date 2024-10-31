/**
 * Useful in `onChange` props for `Select` components to grab the value from the provided option object.
 */
export function pickOptionValue(onChange: (arg: any) => void) {
    return (option) => onChange(option.value);
}
