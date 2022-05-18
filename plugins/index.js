import { inspect } from "node:util";
import { date } from "./date-filter.js";

export const filters = {
    date,
    log(content, { depth=Infinity, compact=true }) {
        console.error(inspect(content, {
            depth,
            compact,
            colors: true
        }))
    },
    // Turn a number into an ordinal, such as 1 => 1st
    ordinal: function(n=0) {
        let s = n.toString();
        if (s.endsWith("1")) return s + "st";
        else if (s.endsWith("2")) return s + "nd";
        else if (s.endsWith("3")) return s + "rd";
        else return s + "th";
    },
    // jinja stuff
    attr(obj, name) {
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