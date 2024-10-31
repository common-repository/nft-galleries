import React from "react";

interface Props {
    id?: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export function TextField({id, value, onChange, placeholder}: Props) {
    return (
        <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
}
