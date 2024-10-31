import React, {forwardRef, HTMLAttributes, ReactNode} from "react";

type BaseProps = Omit<HTMLAttributes<SVGSVGElement>, "children" | "viewBox">;

type Props = BaseProps & {
    icon: ReactNode;
}

export const Icon = forwardRef<SVGSVGElement, Props>(({icon, ...props}, ref) => (
    <svg ref={ref} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <g>
            {icon}
        </g>
    </svg>
));
