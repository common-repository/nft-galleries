import React, {MutableRefObject, ReactElement} from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import Theme from "spotlight/admin-common/styles/export.scss";
import {classList} from "spotlight/utils/jsx/classes";

export interface SelectOption {
    value: any;
    label: string | ReactElement;
}

export declare type SelectChangeHandler = (option: SelectOption) => void;

interface Props {
    id?: string;
    className?: string;
    value?: string;
    placeholder?: string;
    onChange?: SelectChangeHandler;
    options?: Array<SelectOption>;
    isSearchable?: boolean;
    isMulti?: boolean;
    isClearable?: boolean;
    isCreatable?: boolean;
    width?: string | number;
    menuIsOpen?: boolean;
    isValidNewOption?: (value: string) => boolean;

    [k: string]: any;
}

export const SelectStyles = (props: Record<string, any> = {}) => ({
    option: (prev, state) => ({
        ...prev,
        cursor: "pointer",
        lineHeight: "24px",
    }),
    menu: (prev, state) => ({
        ...prev,
        margin: "6px 0",
        boxShadow: "0 2px 8px " + Theme.shadowColor,
        overflow: "hidden",
    }),
    menuList: (prev, state) => ({
        padding: "0px",
    }),
    control: (prev, state) => {
        let style = {
            ...prev,
            cursor: "pointer",
            lineHeight: "2",
            minHeight: "40px",
        };

        if (state.isFocused) {
            style.borderColor = Theme.primaryColor;
            style.boxShadow = `0 0 0 1px ${Theme.primaryColor}`;
        }

        return style;
    },
    valueContainer: (prev, state) => ({
        ...prev,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
    }),
    container: (prev, state) => ({
        ...prev,
        width: props.width || "100%",
    }),
    multiValue: (prev, state) => ({
        ...prev,
        padding: "0 6px",
    }),
    input: (prev, state) => ({
        ...prev,
        outline: "0 transparent !important",
        border: "0 transparent !important",
        boxShadow: "0 0 0 transparent !important",
    }),
    indicatorSeparator: (prev, state) => ({
        ...prev,
        margin: "0",
        backgroundColor: "transparent",
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 9999999
    })
});

export const Select = React.forwardRef<HTMLElement, Props>((props: Props, ref: MutableRefObject<HTMLElement>) => {
    const options = props.options ?? [];
    const value = options.find((opt) => opt.value === props.value);

    props = {
        ...props,
        id: undefined,
        className: classList("react-select", props.className),
        classNamePrefix: "react-select",
        inputId: props.id,
        menuPosition: "absolute",
    };

    const styles = SelectStyles(props);

    const theme = (theme) => ({
        ...theme,
        borderRadius: 3,
        colors: {
            ...theme.colors,
            primary: Theme.primaryColor,
            primary25: Theme.washedColor,
        },
    });

    const Component = props.isCreatable ? CreatableSelect : props.async ? AsyncSelect : ReactSelect;

    return (
        <Component {...props}
                   ref={ref}
                   isSearchable={props.isCreatable}
                   value={value}
                   styles={styles}
                   theme={theme}
                   menuPlacement="auto"
                   menuPortalTarget={document.body}
                   menuShouldScrollIntoView={true}
        />
    );
});
