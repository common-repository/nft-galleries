import axios, {AxiosInstance} from "axios";
import {Common} from "spotlight/common";
import {stripHtml} from "spotlight/utils/dom";

export let client = axios.create({
    baseURL: Common.config.restApi.baseUrl,
});

export function decorateClient(decorator: (client: AxiosInstance) => AxiosInstance) {
    client = decorator(client);
}

if (Common.config.restApi.authToken) {
    client.defaults.headers["X-SNFT-Auth-Token"] = Common.config.restApi.authToken;
}

client.interceptors.response.use(
    res => res,
    err => {
        if (err.response === undefined) {
            return;
        }

        if (err.response.status === 403) {
            throw new Error("Your login cookie is not valid. Please check if you are still logged in.");
        }

        throw err;
    },
);

export function getErrorResponseMessage(error) {
    let message;

    if (typeof error.response === "object") {
        error = error.response.data;
    }

    if (typeof error.message === "string") {
        message = error.message;
    } else if (typeof error.error === "string") {
        message = error.error;
    } else {
        message = error.toString();
    }

    return stripHtml(message);
}
