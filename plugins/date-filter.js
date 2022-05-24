import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/advancedFormat.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone)
dayjs.extend(advancedFormat);

dayjs.tz.setDefault("America/New_York");

/**
 *
 * @type {import("../lib/types").Filter}
 *
 * @param {string} timestamp
 * @param {['rfc' | 'iso' | 'string']} args
 * @param {object} kwargs
 * @param {'rfc' | 'iso' | 'string'} [kwargs.format]
 * @param {string} [kwargs.timezone]
 * @param {string} [kwargs.tz] Alias for `timezone`
 *
 * @returns {string}
 */
export function date(timestamp, [format], kwargs) {
    if(timestamp === 'now' || !timestamp) {
        timestamp = new Date();
    }
    if (kwargs.format) format = kwargs.format;

    let dt = dayjs(timestamp);

    const tz = kwargs.tz || kwargs.timezone;
    if(tz) dt = dt.tz(tz);

    if(format === 'rfc' || format === 'string') {
        return dt.toString();
    } else if (format === 'iso') {
        return dt.toISOString();
    } else {
        return dt.format(format);
    }
}