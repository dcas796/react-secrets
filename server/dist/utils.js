"use strict";
// ERROR HANDLING
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = exports.RequestError = exports.throwWarning = exports.fatalError = void 0;
function fatalError(message, code) {
    if (code === void 0) { code = 1; }
    console.error("FATAL ERROR: " + message);
    return process.exit(code);
}
exports.fatalError = fatalError;
function throwWarning(message) {
    console.warn("WARNING: " + message);
}
exports.throwWarning = throwWarning;
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(status, message) {
        var _this = _super.call(this) || this;
        _this.status = status;
        _this.message = message;
        return _this;
    }
    RequestError.missingValue = function (name) {
        return new RequestError(400, "Missing " + name + " in request body");
    };
    RequestError.typeMismatch = function (name, type) {
        return new RequestError(400, "Type of " + name + " is not " + type);
    };
    RequestError.noAuthorization = function () {
        return new RequestError(401, "Authorization must be sent with the request");
    };
    RequestError.corruptedAuthorization = function () {
        return new RequestError(400, "Corrupted or malformed authorization bearer");
    };
    RequestError.invalidAuthorization = function () {
        return new RequestError(400, "Invalid authorization");
    };
    return RequestError;
}(Error));
exports.RequestError = RequestError;
var AuthError = /** @class */ (function (_super) {
    __extends(AuthError, _super);
    function AuthError(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    AuthError.invalidUsernameOrPassword = function () {
        return new AuthError("Wrong username or password");
    };
    AuthError.invalidPassword = function () {
        return new AuthError("Invalid password");
    };
    return AuthError;
}(Error));
exports.AuthError = AuthError;
// TODO: Remove Result if not necessary in next commit
var ResultType;
(function (ResultType) {
    ResultType[ResultType["success"] = 0] = "success";
    ResultType[ResultType["error"] = 1] = "error";
})(ResultType || (ResultType = {}));
var Result = /** @class */ (function () {
    function Result(type, value) {
        this.type = type;
        this.value = value;
    }
    Result.success = function (value) {
        return new Result(ResultType.success, value);
    };
    Result.error = function (error) {
        return new Result(ResultType.error, error);
    };
    return Result;
}());
