import { inspect } from "node:util";
import { date } from "./date-filter.js";

export const filters = {
    date,
    /** @type {import("../lib/types").Filter} */
    log(content, args, kwargs) {
        kwargs.depth ??= args[0] ?? 2;
        kwargs.compact ??= args[1] ?? false;

        console.error(inspect(content, {
            depth: kwargs.depth,
            compact: kwargs.compact,
            colors: true
        }))
    },
    /**
     *
     * Turn a number into an ordinal, such as "1" => "1st"
     * @param {number} n
     * @returns {string}
     */
    ordinal: function(n) {
        let s = n.toString();
        if (s.endsWith("1")) return s + "st";
        else if (s.endsWith("2")) return s + "nd";
        else if (s.endsWith("3")) return s + "rd";
        else return s + "th";
    },
    //==== jinja stuff ====
    /**
     * @template {Record<string, any>} T
     * @template {keyof T} O
     * @param {T} obj
     * @param {[O]} args
     * @returns {T[O]}
     */
    attr(obj, [name]) {
        return obj[name];
    }
}

export const functions = {
    class: function(...groups) {
        // Combine arrays of classes as `one two | three`
        return groups.map(g => {
            if(["symbol", "object"].includes(typeof g)) {
                let gg = g.filter(n => !!n);
                return gg.length > 0 ? gg.join(" ") : [];
            }
            return g ?? [];
        }).flat().join(" | ");
    }
}