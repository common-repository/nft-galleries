import React, {useState} from "react";
import classes from "./BorderDesignFields.pcss";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";
import {BorderDesign} from "spotlight/utils/design/border";
import {Select} from "spotlight/admin-common/components/fields/Select";
import {ColorPicker} from "spotlight/admin-common/components/fields/ColorPicker/ColorPicker";
import {withPartial} from "spotlight/utils/objects/withPartial";
import {MultiColor} from "react-color-types";
import {FieldRow} from "spotlight/admin-common/components/fields/FieldRow/FieldRow";

export namespace BorderDesignFields {
    export interface Props {
        design?: BorderDesign;
        onChange?: (design: BorderDesign) => void;
        labels?: boolean;
        show?: {
            width?: boolean;
            style?: boolean;
            color?: boolean;
            radius?: boolean;
        };
    }
}

export function BorderDesignFields({design, onChange, labels, show}: BorderDesignFields.Props) {
    const [state, setState] = useState<BorderDesign>(BorderDesign.DEFAULT);

    design = design ?? state;
    onChange = onChange ?? setState;

    const onChangeWidth = (width) => {
        onChange(withPartial(design, {width}));
    };

    const onChangeStyle = (style) => {
        onChange(withPartial(design, {style}));
    };

    const onChangeColor = (c: MultiColor) => {
        onChange(withPartial(design, {color: c.rgb}));
    };

    const onChangeRadius = (r: number | string) => {
        const radius = parseInt(r.toString());

        onChange(withPartial(design, {radius: radius || 0}));
    };

    return (
        <div className={classes.root}>
            {(show.width || show.style || show.color) && (
                <FieldRow label={labels && "Border"}>
                    {show.width && (
                        <div className={classes.width}>
                            <NumberField
                                value={design.width}
                                onChange={onChangeWidth}
                                placeholder="Thickness"
                                min={0}
                                unit="px"
                            />
                        </div>
                    )}

                    {show.style && (
                        <div className={classes.style}>
                            <Select value={design.style} onChange={onChangeStyle} options={[
                                {value: "solid", label: "Solid line"},
                                {value: "dotted", label: "Dotted line"},
                                {value: "dashed", label: "Dashed line"},
                                {value: "double", label: "Double line"},
                                {value: "groove", label: "Grooved"},
                            ]} />
                        </div>
                    )}

                    {show.color && (
                        <div className={classes.color}>
                            <ColorPicker value={design.color} onChange={onChangeColor} />
                        </div>
                    )}
                </FieldRow>
            )}

            {show.radius && (
                <FieldRow label={labels && "Border Radius"}>
                    <NumberField value={design.radius} onChange={onChangeRadius} min={0} unit="px" />
                </FieldRow>
            )}
        </div>
    );
}
