"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importStar(require("crypto"));
var utils_1 = require("./utils");
var sha = function (input) {
    return crypto_1.default.createHash("sha256").update(input).digest("base64");
};
var default_users = [
    { id: 0, name: "admin", password_hash: sha("password"), encrypted_secret: "" },
    { id: 1, name: "user1", password_hash: sha("12345678"), encrypted_secret: "" },
    { id: 2, name: "user2", password_hash: sha("plzdonthack"), encrypted_secret: "" }
];
var RepositoryError = /** @class */ (function (_super) {
    __extends(RepositoryError, _super);
    function RepositoryError(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    RepositoryError.invalidId = function (id) {
        return new RepositoryError("User with id " + id + " does not exist.");
    };
    RepositoryError.invalidUsernameOrPassword = function () {
        return new RepositoryError("Wrong username or password");
    };
    return RepositoryError;
}(Error));
var UserRepository = /** @class */ (function () {
    function UserRepository(dao) {
        this.dao = dao;
        this.createTable();
    }
    UserRepository.prototype.createTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, default_users_1, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Creating user repository");
                        // Create database
                        // DEBUG
                        return [4 /*yield*/, this.dao.run("drop table if exists users;")];
                    case 1:
                        // Create database
                        // DEBUG
                        _a.sent();
                        return [4 /*yield*/, this.dao.run("\n        create table users (\n            id int primary key not null,\n            name text not null,\n            password_hash text not null,\n            encrypted_secret text not null\n        );\n        ")];
                    case 2:
                        _a.sent();
                        console.log("Populating repository");
                        _i = 0, default_users_1 = default_users;
                        _a.label = 3;
                    case 3:
                        if (!(_i < default_users_1.length)) return [3 /*break*/, 6];
                        user = default_users_1[_i];
                        return [4 /*yield*/, this.create(user)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Creating user: " + user);
                        return [4 /*yield*/, this.dao.run("insert into users (id, name, password_hash, encrypted_secret) \n                values (?, ?, ?, ?);", user.id, user.name, user.password_hash, user.encrypted_secret)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.validate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var result, user, passwordDigest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserByName(username)];
                    case 1:
                        result = _a.sent();
                        if (result.type == utils_1.ResultType.error)
                            return [2 /*return*/, false];
                        user = result.value;
                        passwordDigest = sha(password);
                        return [2 /*return*/, crypto_1.timingSafeEqual(Buffer.from(passwordDigest), Buffer.from(user.password_hash))];
                }
            });
        });
    };
    UserRepository.prototype.delete = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dao.run("delete from users where id = ?", user.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var value, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dao.get("select * from users where id = ?", id)];
                    case 1:
                        value = _a.sent();
                        if (value == null)
                            return [2 /*return*/, utils_1.Result.error(RepositoryError.invalidId(id))];
                        return [2 /*return*/, utils_1.Result.success(value)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, utils_1.Result.error(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.getUserByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var value, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dao.get("select * from users where name = ?", name)];
                    case 1:
                        value = _a.sent();
                        if (value == null)
                            return [2 /*return*/, utils_1.Result.error(RepositoryError.invalidUsernameOrPassword())];
                        return [2 /*return*/, utils_1.Result.success(value)];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, utils_1.Result.error(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserRepository;
}());
exports.default = UserRepository;