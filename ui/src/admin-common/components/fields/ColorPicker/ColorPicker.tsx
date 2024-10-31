import React, {useEffect} from "react";
import classes from "./ColorPicker.pcss";
import ChromePicker from "react-color/lib/components/chrome/Chrome";
import {Color, MultiColor} from "react-color-types";
import {useDetectTabOut} from "spotlight/utils/react/useDetectTabOut";
import {useDetectOutsideClick} from "spotlight/utils/react/useDetectOutsideClick";
import {useDocumentEventListener} from "spotlight/utils/react/useEventListener";
import {colorToString} from "spotlight/utils/colors/colorToString";
import {Manager, Popper, Reference} from "react-popper";
import {mergeRefs} from "spotlight/utils/jsx/mergeRefs";
import AdminCommon from "spotlight/admin-common/AdminCommon";

interface Props {
    id?: string;
    value?: Color;
    onChange?: (c: MultiColor) => void;
    disableAlpha?: boolean;
}

export function ColorPicker({id, value, disableAlpha, onChange}: Props) {
    value = value ?? "#fff";

    const [color, setColor] = React.useState<Color>(value);
    const [isOpen, setOpen] = React.useState(false);
    const btn = React.useRef();
    const picker = React.useRef();

    const close = React.useCallback(() => setOpen(false), []);
    const toggle = React.useCallback(() => setOpen(v => !v), []);

    const handleChange = React.useCallback((color) => {
        setColor(color.rgb);
        onChange && onChange(color);
    }, [onChange]);

    const onKeyDown = React.useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
            close();
            e.preventDefault();
            e.stopPropagation();
        }
    }, [isOpen]);

    useEffect(() => setColor(value), [value]);
    useDetectOutsideClick(btn, close, [picker]);
    useDetectTabOut([btn, picker], close);
    useDocumentEventListener<KeyboardEvent>("keydown", onKeyDown, [isOpen]);

    const modifiers = {
        preventOverflow: {
            boundariesElement: document.getElementById(AdminCommon.config.rootId),
            padding: 5,
        },
    };

    return (
        <Manager>
            <Reference>
                {({ref}) => (
                    <button ref={mergeRefs(btn, ref)}
                            id={id}
                            className={classes.button}
                            onClick={toggle}>
                        <span className={classes.colorPreview} style={{backgroundColor: colorToString(color)}} />
                    </button>
                )}
            </Reference>
            <Popper placement="bottom-end"
                    positionFixed={true}
                    modifiers={modifiers}>
                {
                    ({ref, style}) => isOpen && (
                        <div className={classes.popper} ref={mergeRefs(picker, ref)} style={style}>
                            <ChromePicker color={color} onChange={handleChange} disableAlpha={disableAlpha} />
                        </div>
                    )
                }
            </Popper>
        </Manager>
    );
}
