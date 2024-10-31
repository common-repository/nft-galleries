export type Toast = {
    key: string;
    type?: ToastType;
    message?: string;
    details?: string;
}

export enum ToastType {
    NOTIFICATION = "notification",
    STICKY = "sticky",
    ERROR = "error",
}
