import React from "react";
import classes from "./ThumbnailGenField.pcss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {ThumbnailGenConfig} from "spotlight/admin-common/stores/settings";
import {NumberField} from "spotlight/admin-common/components/fields/NumberField";

interface Props {
    id?: string;
    value: ThumbnailGenConfig[];
    onChange: (value: ThumbnailGenConfig[]) => void;
}

export function ThumbnailGenField({id, value, onChange}: Props) {
    const handleWidth = (i) => (width) => {
        value[i].width = width;
        onChange(value);
    };

    const handleQuality = (i) => (quality) => {
        value[i].quality = quality;
        onChange(value);
    };

    const addRow = () => {
        value.push({width: 0, quality: 100});
        onChange(value);
    };

    return (
        <div id={id}>
            <div className={classes.list}>
                {value.map((item, i) => (
                    <div className={classes.row} key={`thumb-row-${i}`}>
                        <div className={classes.sizeField}>
                            <NumberField value={item.width} onChange={handleWidth(i)} min={0} unit="px" />
                        </div>
                        <div className={classes.qualityField}>
                            <Slider
                                min={0}
                                max={100}
                                value={item.quality}
                                onChange={handleQuality(i)}
                            />
                            <span>{item.quality}%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={classes.footer}>
                <Button type={ButtonType.SECONDARY} size={ButtonSize.NORMAL} onClick={addRow}>
                    <Dashicon icon="plus" />
                    {" "}
                    <span>Add size</span>
                </Button>
            </div>
        </div>
    );
}

const defaultValue: ThumbnailGenConfig[] = [
    {width: 480, quality: 80},
    {width: 600, quality: 90},
];
