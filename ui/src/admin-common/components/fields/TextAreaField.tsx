import React from "react";

interface Props {
    id?: string;
    value: string;
    onChange: (value: string) => void;
}

export function TextAreaField({id, value, onChange}: Props) {
    return (
        <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
