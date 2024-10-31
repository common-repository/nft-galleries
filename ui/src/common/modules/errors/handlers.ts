import {SnftError, SnftErrorHandler} from "spotlight/common/modules/errors/types";

/**
 * The registered error handlers.
 *
 * @private
 */
const handlers: SnftErrorHandler[] = [];

/**
 * Triggers an error, which will be handled by the registered handlers.
 *
 * @param error The error to trigger.
 */
export function triggerError(error: SnftError) {
    if (handlers.length === 0) {
        throw error;
    }

    handlers.forEach(h => h(error));
}

/**
 * Adds an error handler.
 *
 * @param handler The handler function to add.
 */
export function addErrorHandler(handler: SnftErrorHandler) {
    handlers.push(handler);
}
