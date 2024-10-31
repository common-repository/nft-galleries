import React, {useEffect} from "react";
import classes from "./Toast.pcss";
import {useDispatch} from "react-redux";
import {Dashicon} from "spotlight/common/components/Dashicon";
import {removeToast, Toast as ToastObj, ToastType} from "spotlight/admin-common/stores/toasts";
import {AdminResources} from "spotlight/admin-common/modules/admin-resources";

interface Props {
    toast: ToastObj;
}

// The time it takes for an expiring toast to live before it expires, in milliseconds
const EXPIRY_TIME = 5000;

// Should match the duration of the fade out animation, in milliseconds
const FADE_OUT_DURATION = 200;

export function Toast({toast}: Props) {
    const dispatch = useDispatch();

    // The state that controls whether the toast is playing the fade out animation or not
    const [isFading, setIsFading] = React.useState(false);
    // The timers for the toast's TTL and fade out animation respectively
    let timer = React.useRef<any>();
    let fadeTimer = React.useRef<any>();

    const toastType = toast.type ?? ToastType.NOTIFICATION;
    const expires = toastType === ToastType.NOTIFICATION;

    const dismiss = () => dispatch(removeToast(toast.key));

    // Starts the toast's timer, triggering the fade animation when time is up
    const startTimer = () => {
        if (expires) {
            timer.current = setTimeout(startFade, EXPIRY_TIME);
        }
    };

    // Stops the toast's timer
    const stopTimer = () => {
        clearTimeout(timer.current);
    };

    // Starts the fading animation and schedules the expiry to occur after the fade is complete
    const startFade = () => {
        setIsFading(true);
        fadeTimer.current = setTimeout(dismiss, FADE_OUT_DURATION);
    };

    // Stops the fading animation
    const stopFade = () => {
        clearTimeout(fadeTimer.current);
    };

    // Handles manual dismissal. Stops the timer and begins the fading animation
    const handleDismiss = () => {
        stopTimer();
        startFade();
    };

    useEffect(() => {
        startTimer();

        return () => {
            stopTimer();
            stopFade();
        };
    }, []);

    const className = !isFading ? classes.root : classes.rootFadingOut;

    return (
        <div className={className} onMouseOver={stopTimer} onMouseOut={startTimer}>
            <div className={classes.content}>
                {toastType === ToastType.ERROR
                    ? <ErrorContent toast={toast} />
                    : <MessageContent toast={toast} />
                }
            </div>
            <button className={classes.dismissBtn} onClick={handleDismiss}>
                <Dashicon icon="no-alt" className={classes.dismissIcon} />
            </button>
        </div>
    );
}

function MessageContent({toast}: Props) {
    return <p style={{whiteSpace: "pre-wrap"}}>{toast.message}</p>;
}

function ErrorContent({toast}: Props) {
    return (
        <div>
            <p className={classes.heading}>Spotlight has encountered an error:</p>
            <p className={classes.message}>{toast.message}</p>

            {toast.details && <pre className={classes.details}>{toast.details}</pre>}

            <p className={classes.footer}>
                If this error persists, kindly{" "}
                <a href={AdminResources.supportUrl} target="_blank">contact customer support</a>.
            </p>
        </div>
    );
}
