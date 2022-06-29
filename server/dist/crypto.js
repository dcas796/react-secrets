"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmac = exports.decrypt = exports.encrypt = void 0;
var crypto_1 = __importDefault(require("crypto"));
var DEFAULT_ALGO = "aes-256-ctr";
var encrypt = function (message, key, algorithm) {
    if (algorithm === void 0) { algorithm = DEFAULT_ALGO; }
    var iv = crypto_1.default.randomBytes(16);
    var cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    var content = Buffer.concat([cipher.update(message), cipher.final()]);
    return { iv: iv, content: content };
};
exports.encrypt = encrypt;
var decrypt = function (hash, key, algorithm) {
    if (algorithm === void 0) { algorithm = DEFAULT_ALGO; }
    var decipher = crypto_1.default.createDecipheriv(algorithm, key, hash.iv);
    return Buffer.concat([decipher.update(hash.content), decipher.final()]);
};
exports.decrypt = decrypt;
var hmac = function (input, key) {
    return crypto_1.default.createHmac("sha256", key).update(input).digest();
};
exports.hmac = hmac;
