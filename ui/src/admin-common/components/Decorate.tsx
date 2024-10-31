import React, {ComponentType} from "react";

export function Decorate<P>(Component: ComponentType<P>, preProps: Partial<P>) {
    return (props) => React.createElement(Component, {...preProps, ...props});
}
