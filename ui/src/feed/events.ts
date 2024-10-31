import {AxiosResponse} from "axios";
import {FeedState} from "spotlight/feed/state";

export namespace FetchFailEvent {
    export const Type = "snft/feed/fetch_fail";

    export type Data = {
        state: FeedState,
        message: string;
        response: AxiosResponse,
    };
}
