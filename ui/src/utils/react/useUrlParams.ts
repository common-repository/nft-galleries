import {useLocation} from "react-router-dom";

export function useUrlParams() {
    return new URLSearchParams(useLocation().search);
}
