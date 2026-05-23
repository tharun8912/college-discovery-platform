"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_KEYS = exports.CATEGORY_RULES = void 0;
exports.effectiveCutoff = effectiveCutoff;
exports.admissionProbability = admissionProbability;
exports.chanceLevel = chanceLevel;
exports.chanceLabel = chanceLabel;
/** Reservation category → cutoff relaxation multiplier (higher = more seats / relaxed rank). */
exports.CATEGORY_RULES = {
    GENERAL: { label: "General", cutoffMultiplier: 1.0 },
    EWS: { label: "EWS", cutoffMultiplier: 1.12 },
    OBC: { label: "OBC-NCL", cutoffMultiplier: 1.28 },
    SC: { label: "SC", cutoffMultiplier: 1.45 },
    ST: { label: "ST", cutoffMultiplier: 1.5 },
};
exports.CATEGORY_KEYS = Object.keys(exports.CATEGORY_RULES);
function effectiveCutoff(baseCutoff, category) {
    var _a;
    if (baseCutoff == null || baseCutoff <= 0)
        return null;
    const rule = (_a = exports.CATEGORY_RULES[category]) !== null && _a !== void 0 ? _a : exports.CATEGORY_RULES.GENERAL;
    return Math.round(baseCutoff * rule.cutoffMultiplier);
}
/**
 * Rule-based admission probability from rank vs category-adjusted cutoff.
 * Lower rank is better; margin = how much headroom the candidate has.
 */
function admissionProbability(userRank, cutoff) {
    if (cutoff == null || cutoff <= 0) {
        return 42;
    }
    const margin = (cutoff - userRank) / cutoff;
    if (margin >= 0.4)
        return 96;
    if (margin >= 0.28)
        return 88;
    if (margin >= 0.18)
        return 78;
    if (margin >= 0.1)
        return 68;
    if (margin >= 0.04)
        return 58;
    if (margin >= -0.02)
        return 48;
    if (margin >= -0.08)
        return 38;
    if (margin >= -0.14)
        return 28;
    if (margin >= -0.22)
        return 18;
    if (margin >= -0.32)
        return 10;
    return 5;
}
function chanceLevel(probability) {
    if (probability >= 75)
        return "safe";
    if (probability >= 55)
        return "moderate";
    if (probability >= 35)
        return "borderline";
    if (probability >= 15)
        return "reach";
    return "dream";
}
function chanceLabel(level) {
    const labels = {
        safe: "Safe",
        moderate: "Moderate",
        borderline: "Borderline",
        reach: "Reach",
        dream: "Dream",
    };
    return labels[level];
}
