import {HTMLAttributes} from "react";
import {ExternalProvider} from "@ethersproject/providers/lib/web3-provider"

declare global {
    namespace React {
        interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
            loading?: "eager" | "lazy";
        }
    }

    interface Window {
        ethereum: ExternalProvider & {
            on(event: string, listener: any),
            removeListener(event: string, listener: any),
        };
    }
}
