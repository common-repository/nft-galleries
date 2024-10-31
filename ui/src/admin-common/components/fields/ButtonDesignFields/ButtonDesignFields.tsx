import React, {useState} from "react";
import {ButtonGroup} from "spotlight/admin-common/components/ButtonGroup";
import {Button, ButtonType} from "spotlight/admin-common/components/Button";
import {ButtonDesign} from "spotlight/utils/design/button";
import {ColorPicker} from "spotlight/admin-common/components/fields/ColorPicker/ColorPicker";
import {MultiColor} from "react-color-types";
import {withPartial} from "spotlight/utils/objects/withPartial";
import {Color} from "spotlight/utils/design/color";
import {BorderDesignFields} from "spotlight/admin-common/components/fields/BorderDesignFields/BorderDesignFields";
import {FieldRow} from "spotlight/admin-common/components/fields/FieldRow/FieldRow";

export namespace ButtonDesignFields {
    export interface Props {
        id?: string;
        value?: ButtonDesign;
        onChange?: (design: ButtonDesign) => void;
        disabled?: boolean;
        show?: {
            textColor?: boolean;
            bgColor?: boolean;
            states?: boolean;
            margins?: boolean;
            paddings?: boolean;
            border?: BorderDesignFields.Props["show"];
        }
    }
}

ButtonDesignFields.defaultProps = {
    id: "",
    value: null,
    onChange: null,
    disabled: false,
    show: {},
} as ButtonDesignFields.Props;

export function ButtonDesignFields({id, value, onChange, disabled, show}: ButtonDesignFields.Props) {
    const [state, setState] = useState<ButtonDesign>(ButtonDesign.DEFAULT);
    value = value ?? state;
    onChange = onChange ?? setState;

    const [isHoverState, setIsHoverState] = useState(false);
    const setToNormal = () => setIsHoverState(false);
    const setToHover = () => setIsHoverState(true);

    const borderDesign = value.border ?? {};

    const currState = ButtonDesign.getFullState(value, isHoverState);
    const bgColor = currState.bgColor ?? Color.WHITE;

    const textDesign = currState.text ?? {};
    const textColor = textDesign.color ?? Color.BLACK;

    const onChangeColor = (c: MultiColor) => {
        const newDesign = ButtonDesign.withState(value, isHoverState, state => {
            state.text = state.text ?? {};
            state.text.color = c.rgb;

            return state;
        });

        onChange(newDesign);
    };

    const onChangeBg = (c: MultiColor) => {
        const newDesign = ButtonDesign.withState(value, isHoverState, state => {
            state.bgColor = c.rgb;

            return state;
        });

        onChange(newDesign);
    };

    const onChangeBorder = (border) => {
        onChange(withPartial(value, {border}));
    };

    return (
        <>
            {show.states && (
                <FieldRow disabled={disabled} wide centered>
                    <ButtonGroup wide>
                        <Button type={ButtonType.TOGGLE} active={!isHoverState} onClick={setToNormal}>
                            Normal
                        </Button>
                        <Button type={ButtonType.TOGGLE} active={isHoverState} onClick={setToHover}>
                            Hover
                        </Button>
                    </ButtonGroup>
                </FieldRow>
            )}

            {show.textColor && (
                <FieldRow label="Text color" labelId={`${id}-color`} disabled={disabled}>
                    <ColorPicker
                        id={`${id}-color`}
                        value={textColor}
                        onChange={onChangeColor}
                    />
                </FieldRow>
            )}

            {show.bgColor && (
                <FieldRow label="Background color" labelId={`${id}-bg`} disabled={disabled}>
                    <ColorPicker
                        id={`${id}-bg`}
                        value={bgColor}
                        onChange={onChangeBg}
                    />
                </FieldRow>
            )}

            <hr />

            {show.border && (
                <BorderDesignFields
                    design={borderDesign}
                    onChange={onChangeBorder}
                    show={show.border}
                    labels
                />
            )}
        </>
    );
}
