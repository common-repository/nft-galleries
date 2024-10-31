import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import parseISO from "date-fns/parseISO";

/**
 * Generates a "time ago" string from an ISO8601 date and time string.
 *
 * @param iso8601 The ISO 8601 date and time string
 *
 * @return The "time ago" string.
 */
export function timeAgoIso(iso8601: string) {
    return formatDistanceToNowStrict(parseISO(iso8601), {addSuffix: true});
}
