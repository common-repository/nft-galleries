import React from "react";
import {Prompt} from "react-router-dom";

interface Props {
    when: boolean;
    message: string;
}

export default function UnloadPrompt({when, message}: Props) {
    return <Prompt when={when} message={message} />;
}
