"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var utils_1 = require("./utils");
var SECRET = (_a = process.env["SIGNATURE_SECRET"]) !== null && _a !== void 0 ? _a : utils_1.fatalError("SIGNATURE_SECRET must be in environment");
var TokenStore = /** @class */ (function () {
    function TokenStore() {
    }
    TokenStore.prototype.generate = function (/* subject: string,  */ data) {
        var header = {
            alg: "HS256",
            typ: "JWT"
        };
        var payload = __assign({ 
            // sub: subject,
            iat: Date.now() }, data);
        var headerEncoded = Buffer.from(JSON.stringify(header)).toString("base64url");
        var payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
        var signature = crypto_1.createHmac("sha256", SECRET).update(headerEncoded + "." + payloadEncoded).digest("base64url").replace("=", "");
        return [
            headerEncoded,
            payloadEncoded,
            signature
        ].join(".");
    };
    TokenStore.prototype.validate = function (token) {
        var _a = token.split("."), header = _a[0], payload = _a[1], signature = _a[2];
        var expectedSignature = crypto_1.createHmac("sha256", SECRET).update(header + "." + payload).digest("base64url").replace("=", "");
        if (expectedSignature.length != signature.length)
            return false;
        return crypto_1.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
    };
    return TokenStore;
}());
exports.default = TokenStore;
