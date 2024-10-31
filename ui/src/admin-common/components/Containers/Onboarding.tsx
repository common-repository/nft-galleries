import React, {ReactNode} from "react";
import {bemClass, classList} from "spotlight/utils/jsx/classes";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import "spotlight/admin-common/styles/onboarding.scss";
import {Dashicon} from "spotlight/common/components/Dashicon";

interface Props extends React.HTMLProps<HTMLDivElement> {
    fullWidth?: boolean;
    children?: ReactNode;
    isTransitioning?: boolean;
}

export function Onboarding({className, children, fullWidth, isTransitioning, ...props}: Props) {
    const onboardingClassName = bemClass("onboarding", {
        "--full-width": fullWidth,
        "--transitioning": isTransitioning,
    });

    return (
        <div className={classList(onboardingClassName, className)} {...props}>
            {children}
        </div>
    );
}

export namespace Onboarding {
    // Should match the CSS animation duration
    export const TRANSITION_DURATION = 200;

    export const Thin = ({className, children, ...props}: React.HTMLProps<HTMLDivElement>) => (
        <div className={classList("onboarding__thin", className)} {...props}>
            {children}
        </div>
    );

    export const HelpMsg = ({className, children, ...props}: React.HTMLProps<HTMLParagraphElement>) => (
        <div className={classList("onboarding__help-msg", className)} {...props}>
            {children}
        </div>
    );

    export const ProTip = ({children}: React.HTMLProps<HTMLDivElement>) => (
        <HelpMsg>
            <div className="onboarding__pro-tip">
                <span>
                    <Dashicon icon="lightbulb" />
                    <strong>Pro tip!</strong>
                </span>
                {children}
            </div>
        </HelpMsg>
    );

    export const StepList = ({className, children, ...props}: React.HTMLProps<HTMLUListElement>) => (
        <ul className={classList("onboarding__steps", className)} {...props}>
            {children}
        </ul>
    );

    interface StepProps extends React.HTMLProps<HTMLLIElement> {
        num: number;
        isDone?: boolean;
    }

    export const Step = ({isDone, num, className, children, ...props}: StepProps) => (
        <li className={classList(isDone ? "onboarding__done" : null, className)} {...props}>
            <strong>Step {num}:</strong>{" "}{children}
        </li>
    );

    interface HeroButtonProps {
        className?: string;
        children?: ReactNode;

        [k: string]: any;
    }

    export const HeroButton = ({className, children, ...props}: HeroButtonProps) => (
        <Button type={props.type ?? ButtonType.PRIMARY}
                size={ButtonSize.HERO}
                className={classList("onboarding__hero-button", className)}
                {...props}>
            {children}
        </Button>
    );
}
