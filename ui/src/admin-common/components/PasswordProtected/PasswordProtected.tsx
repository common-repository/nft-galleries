import classes from "./PasswordProtected.pcss";
import React, {ReactNode, useState} from "react";
import {AxiosResponse} from "axios";
import {Button, ButtonSize, ButtonType} from "spotlight/admin-common/components/Button";
import {Message, MessageType} from "spotlight/admin-common/components/Message/Message";

export type Props = {
    promptText?: ReactNode
    buttonLabel?: ReactNode;
    request: (pass: string) => Promise<AxiosResponse>;
    children: (response: AxiosResponse) => ReactNode;
};

export function PasswordProtected({
    request,
    children,
    buttonLabel = "Submit",
    promptText = "You need to enter your WordPress password to view this content:"
}: Props) {
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response, setResponse] = useState<AxiosResponse | null>(null);

    const submit = async () => {
        setIsSubmitting(true);

        let response: AxiosResponse | null;
        try {
            response = await request(password);
        } catch (e) {
            response = e.response;
        }

        setResponse(response);
        setIsSubmitting(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            submit();
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const didRequest = response !== null;
    const isError = didRequest && response.status !== 200;
    const errorMessage = response?.data?.message ?? "An unknown error occurred.";

    if (didRequest && !isError && response) {
        return <Revealed children={children} response={response} />;
    }

    return (
        <div className={classes.root}>
            <label htmlFor="snft-password-field">
                {promptText}
            </label>

            <div className={classes.passwordForm}>
                <input
                    id="access-token-password-field"
                    className={classes.passwordField}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                    disabled={isSubmitting}
                />
                <Button
                    className={classes.passwordBtn}
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    onClick={submit}
                    disabled={isSubmitting}>
                    {buttonLabel}
                </Button>
            </div>

            {isError && (
                <div className={classes.error}>
                    <Message type={MessageType.ERROR} showIcon shake>
                        {errorMessage}
                    </Message>
                </div>
            )}
        </div>
    );
}

function Revealed({children, response}) {
    return children(response);
}
