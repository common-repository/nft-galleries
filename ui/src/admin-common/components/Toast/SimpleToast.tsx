import React, {ReactNode} from "react";

export default function SimpleToast(props: { message: string | ReactNode }) {
    return <p>{props.message}</p>;
}
