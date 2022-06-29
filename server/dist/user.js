"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUsers = exports.User = exports.IUser = void 0;
var crypto_1 = __importDefault(require("crypto"));
var crypto_2 = require("./crypto");
var utils_1 = require("./utils");
var DERIVED_KEY_LENGTH = 32;
// https://stackoverflow.com/questions/56121589/typescript-check-an-object-has-all-interface-properties
var IUser;
(function (IUser) {
    var schema = {
        id: "number",
        name: "string",
        password_hash: "string",
        password_salt: "string",
        encrypted_secret: "string",
        encrypted_secret_iv: "string",
        derived_key_salt: "string"
    };
    function hasProperties(input) {
        var missingProperties = Object.keys(schema)
            .filter(function (key) { return input[key] === undefined; })
            .map(function (key) { return key; });
        return missingProperties.length == 0;
    }
    IUser.hasProperties = hasProperties;
})(IUser = exports.IUser || (exports.IUser = {}));
var User = /** @class */ (function () {
    function User(id, name, password_hash, password_salt, encrypted_secret, encrypted_secret_iv, derived_key_salt) {
        this.id = id;
        this.name = name;
        this.password_hash = password_hash;
        this.password_salt = password_salt;
        this.encrypted_secret = encrypted_secret;
        this.encrypted_secret_iv = encrypted_secret_iv;
        this.derived_key_salt = derived_key_salt;
    }
    User.fromRawUser = function (user) {
        var passwordSalt = crypto_1.default.randomBytes(16);
        var derivedKeySalt = crypto_1.default.randomBytes(16);
        var derivedKey = crypto_1.default.scryptSync(user.password, derivedKeySalt, DERIVED_KEY_LENGTH);
        var encryptedSecret = crypto_2.encrypt(Buffer.from(user.secret), derivedKey);
        return User.from({
            id: user.id,
            name: user.name,
            password_hash: crypto_2.hmac(user.password, passwordSalt).toString("base64url"),
            password_salt: passwordSalt.toString("base64url"),
            encrypted_secret: encryptedSecret.content.toString("base64url"),
            encrypted_secret_iv: encryptedSecret.iv.toString("base64url"),
            derived_key_salt: derivedKeySalt.toString("base64url")
        });
    };
    User.from = function (o) {
        return new User(o.id, o.name, o.password_hash, o.password_salt, o.encrypted_secret, o.encrypted_secret_iv, o.derived_key_salt);
    };
    User.fromAny = function (o) {
        if (IUser.hasProperties(o)) {
            return User.from(o);
        }
        return null;
    };
    User.prototype.validate = function (password) {
        var passwordSalt = Buffer.from(this.password_salt, "base64url");
        var hashedPassword = crypto_2.hmac(password, passwordSalt);
        var passwordHash = Buffer.from(this.password_hash, "base64url");
        return crypto_1.default.timingSafeEqual(passwordHash, hashedPassword);
    };
    User.prototype.getDerivedKey = function (password) {
        if (!this.validate(password))
            throw utils_1.AuthError.invalidPassword();
        var derivedKeySalt = Buffer.from(this.derived_key_salt, "base64url");
        var derivedKey = crypto_1.default.scryptSync(password, derivedKeySalt, DERIVED_KEY_LENGTH);
        return derivedKey.toString("base64url");
    };
    User.prototype.decryptSecret = function (derivedKey) {
        var content = Buffer.from(this.encrypted_secret, "base64url");
        var iv = Buffer.from(this.encrypted_secret_iv, "base64url");
        var key = Buffer.from(derivedKey, "base64url");
        return crypto_2.decrypt({ content: content, iv: iv }, key).toString();
    };
    return User;
}());
exports.User = User;
exports.defaultUsers = [
    {
        id: 0,
        name: "user0",
        password: "password0",
        secret: "secret0"
    },
    {
        id: 1,
        name: "user1",
        password: "password1",
        secret: "secret1"
    },
    {
        id: 2,
        name: "user2",
        password: "password2",
        secret: "secret2"
    }
].map(User.fromRawUser);
