import {SyntheticEvent} from "react";

type AnyEvent = Event | SyntheticEvent;

export function stopPropagation(handler: (event: AnyEvent) => any) {
    return (event: AnyEvent) => {
        event.stopPropagation();

        return handler(event);
    };
}
