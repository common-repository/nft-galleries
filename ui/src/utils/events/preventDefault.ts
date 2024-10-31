import {SyntheticEvent} from "react";

type AnyEvent = Event | SyntheticEvent;

export function preventDefault(handler?: (event: AnyEvent) => any) {
    return (event: AnyEvent) => {
        event.preventDefault();

        return handler && handler(event);
    };
}
