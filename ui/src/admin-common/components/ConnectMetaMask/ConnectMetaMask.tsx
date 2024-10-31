import React from "react"
import {useMetaMask} from "metamask-react"

export function ConnectMetaMask() {
    const {status, connect} = useMetaMask()

    if (status === "unavailable") {
        return <p>Cannot detect MetaMask. Is it installed on this browser?</p>
    }

    return (
        <>
            <button className="button button-primary button-hero" onClick={connect}>
                Connect with MetaMask
            </button>
        </>
    )
}
