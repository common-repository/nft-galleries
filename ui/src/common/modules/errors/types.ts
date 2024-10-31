/**
 * The type for an error object.
 */
export interface SnftError {
    message: string;
    details?: string;
    type?: string;
}

/**
 * The type for a function that can handle an error.
 */
export type SnftErrorHandler = (error: SnftError) => void;
