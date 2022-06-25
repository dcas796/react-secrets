"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var dao_1 = __importDefault(require("./dao"));
var user_repo_1 = __importDefault(require("./user_repo"));
var router_1 = __importDefault(require("./router"));
var utils_1 = require("./utils");
var token_1 = __importDefault(require("./token"));
var DATABASE_PATH = path_1.default.resolve("secrets.db");
var PORT = 3001;
function createLoginToken(store, user_id) {
    return store.generate({ user_id: user_id });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, dao, user_repo, router, store;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express_1.default();
                app.use(cors_1.default());
                app.use(express_1.default.json());
                dao = new dao_1.default(DATABASE_PATH);
                return [4 /*yield*/, dao.initialize()];
            case 1:
                _a.sent();
                user_repo = new user_repo_1.default(dao);
                router = new router_1.default(app);
                store = new token_1.default();
                router.get("/api/getUserFromId/:id", function (req) { return __awaiter(void 0, void 0, void 0, function () {
                    var id, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                id = parseInt(req.params.id);
                                if (isNaN(id)) {
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.typeMismatch("id", "number"))];
                                }
                                return [4 /*yield*/, user_repo.getUserById(id)];
                            case 1:
                                result = _a.sent();
                                if (result.type == utils_1.ResultType.error)
                                    return [2 /*return*/, utils_1.Result.error(result.value)];
                                return [2 /*return*/, utils_1.Result.success(result.value)];
                        }
                    });
                }); });
                router.post("/api/authenticate", function (req) { return __awaiter(void 0, void 0, void 0, function () {
                    var username, password, result, user_id;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                username = req.body.username;
                                password = req.body.password;
                                if (typeof username != "string")
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.typeMismatch("username", "string"))];
                                if (typeof password != "string")
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.typeMismatch("password", "string"))];
                                return [4 /*yield*/, user_repo.validate(username, password)];
                            case 1:
                                if (!(_a.sent()))
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.wrongUsernameOrPassword())];
                                return [4 /*yield*/, user_repo.getUserByName(username)];
                            case 2:
                                result = _a.sent();
                                if (result.type == utils_1.ResultType.error)
                                    return [2 /*return*/, utils_1.Result.error(result.value)];
                                user_id = result.value.id;
                                return [2 /*return*/, utils_1.Result.success({ token: createLoginToken(store, user_id) })];
                        }
                    });
                }); });
                router.get("/api/whoami", function (req) { return __awaiter(void 0, void 0, void 0, function () {
                    var token, decodedPayload, parsedPayload, result, user;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                token = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
                                if (token == null)
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.noAuthorization())];
                                if (!store.validate(token))
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.invalidAuthorization())];
                                decodedPayload = Buffer.from(token.split(".")[1], "base64url").toString();
                                parsedPayload = JSON.parse(decodedPayload);
                                if (parsedPayload.user_id == null)
                                    return [2 /*return*/, utils_1.Result.error(utils_1.RequestError.corruptedAuthorization())];
                                return [4 /*yield*/, user_repo.getUserById(parsedPayload.user_id)];
                            case 1:
                                result = _b.sent();
                                if (result.type == utils_1.ResultType.error)
                                    return [2 /*return*/, utils_1.Result.error(result.value)];
                                user = result.value;
                                return [2 /*return*/, utils_1.Result.success("Hello, " + user.name + ". Your id is " + user.id + ".")];
                        }
                    });
                }); });
                app.listen(PORT, function () {
                    console.log("Server running in port " + PORT);
                });
                return [2 /*return*/];
        }
    });
}); })();
