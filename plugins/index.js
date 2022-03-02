import { date } from "./date-filter.js";

export const filters = {
    date,
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