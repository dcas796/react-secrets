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
exports.Result = exports.ResultType = exports.applyMixins = exports.RequestError = exports.throwError = exports.throwMessage = exports.fatalError = void 0;
function fatalError(message, code) {
    if (code === void 0) { code = 1; }
    console.error("ERROR: " + message);
    return process.exit(code);
}
exports.fatalError = fatalError;
function throwMessage(message, error, exit) {
    if (exit === void 0) { exit = true; }
    console.error("ERROR: " + message + (error ? ", reason: " + error.message : ""));
    if (exit)
        return process.exit(1);
}
exports.throwMessage = throwMessage;
function throwError(error, exit) {
    var _a;
    if (exit === void 0) { exit = true; }
    return throwMessage((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Fatal Error", undefined, exit);
}
exports.throwError = throwError;
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(status, message) {
        var _this = _super.call(this) || this;
        _this.status = status;
        _this.message = message;
        return _this;
    }
    RequestError.typeMismatch = function (name, type) {
        return new RequestError(400, "Type of " + name + " is not " + type);
    };
    RequestError.wrongUsernameOrPassword = function () {
        return new RequestError(400, "Wrong username or password");
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
// MISC
// https://stackoverflow.com/questions/26948400/typescript-how-to-extend-two-classes
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
exports.applyMixins = applyMixins;
var ResultType;
(function (ResultType) {
    ResultType[ResultType["success"] = 0] = "success";
    ResultType[ResultType["error"] = 1] = "error";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
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
exports.Result = Result;
