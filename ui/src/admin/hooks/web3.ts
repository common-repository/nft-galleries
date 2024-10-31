import {useRef} from "react"
import {providers} from "ethers"

export function useWeb3Provider(): providers.Web3Provider | undefined {
    const provider = useRef<providers.Web3Provider>()

    if (window.ethereum && !provider.current && window.ethereum) {
        provider.current = new providers.Web3Provider(window.ethereum)
    }

    return provider.current
}
