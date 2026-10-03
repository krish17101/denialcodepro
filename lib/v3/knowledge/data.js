"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.payerFingerprintsBySlug = exports.payersBySlug = exports.fingerprintsBySlug = exports.rarcsBySlug = exports.carcsBySlug = exports.getPayerSlug = exports.getDenialSlug = exports.getRarcSlug = exports.getCarcSlug = exports.knowledgeBase = void 0;
var denialcodepro_v2_public_knowledge_export_json_1 = __importDefault(require("../../../denialcodepro_v2_public_knowledge_export.json"));
exports.knowledgeBase = denialcodepro_v2_public_knowledge_export_json_1.default;
function getCarcSlug(code) {
    return code.toLowerCase();
}
exports.getCarcSlug = getCarcSlug;
function getRarcSlug(code) {
    return code.toLowerCase();
}
exports.getRarcSlug = getRarcSlug;
function getDenialSlug(df) {
    var parts = [];
    if (df.group_code)
        parts.push(df.group_code);
    parts.push(df.carc);
    if (df.rarc)
        parts.push(df.rarc);
    return parts.join('-').toLowerCase();
}
exports.getDenialSlug = getDenialSlug;
function getPayerSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
exports.getPayerSlug = getPayerSlug;
exports.carcsBySlug = new Map();
exports.rarcsBySlug = new Map();
exports.fingerprintsBySlug = new Map();
exports.payersBySlug = new Map();
exports.payerFingerprintsBySlug = new Map();
(_a = exports.knowledgeBase.carcs) === null || _a === void 0 ? void 0 : _a.forEach(function (carc) {
    // Deliberately exclude CARC 15 as requested
    if (carc.code === '15')
        return;
    exports.carcsBySlug.set(getCarcSlug(carc.code), carc);
});
(_b = exports.knowledgeBase.rarcs) === null || _b === void 0 ? void 0 : _b.forEach(function (rarc) {
    exports.rarcsBySlug.set(getRarcSlug(rarc.code), rarc);
});
(_c = exports.knowledgeBase.denial_fingerprints) === null || _c === void 0 ? void 0 : _c.forEach(function (df) {
    exports.fingerprintsBySlug.set(getDenialSlug(df), df);
});
(_d = exports.knowledgeBase.payer_intelligence) === null || _d === void 0 ? void 0 : _d.forEach(function (payer) {
    if (payer.Payer)
        exports.payersBySlug.set(getPayerSlug(payer.Payer), payer);
});
(_e = exports.knowledgeBase.payer_fingerprints) === null || _e === void 0 ? void 0 : _e.forEach(function (pf) {
    exports.payerFingerprintsBySlug.set(pf.record_id.toLowerCase(), pf);
});
