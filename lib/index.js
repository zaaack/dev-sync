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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScpSync = void 0;
var foy_1 = require("foy");
var path_1 = __importDefault(require("path"));
var minimatch_1 = __importDefault(require("minimatch"));
var ScpSync = /** @class */ (function () {
    function ScpSync(conf) {
        this.conf = conf;
        // make sync task running as queue
        this._runningScpTask = Promise.resolve();
        conf.scpParams = conf.scpParams || [];
        conf.sshParams = conf.sshParams || [];
        conf.localFolder = conf.localFolder || process.cwd();
        conf.ignore = conf.ignore || [];
        if (conf.port) {
            conf.scpParams.push('-P', conf.port + '');
            conf.sshParams.push('-p', conf.port + '');
        }
    }
    ScpSync.resolveConf = function () {
        var conf = {
            host: '',
            remoteFolder: '',
            ignore: [],
        };
        var ScpSyncFile = './scpSync.json';
        if (foy_1.fs.existsSync(ScpSyncFile)) {
            conf = foy_1.fs.readJsonSync(ScpSyncFile);
        }
        else {
            var pkg = require('../package.json');
            if (!pkg.scpSync) {
                throw new Error("Cannot find config in ./scpSync.json or package.json['scpSync']");
            }
            conf = pkg.scpSync;
        }
        if (!conf.host || !conf.remoteFolder) {
            throw new Error("Invalid conf file:" + JSON.stringify(conf, null, 2));
        }
        return new ScpSync(conf);
    };
    ScpSync.prototype.resolveFile = function (file) {
        var relatedPath = path_1.default.relative(this.conf.localFolder, path_1.default.join(this.conf.localFolder, file));
        return path_1.default.join(this.conf.remoteFolder, relatedPath);
    };
    ScpSync.prototype.scp = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, foy_1.spawn('scp', __spreadArray(__spreadArray(['-rp'], (this.conf.scpParams || [])), [file, this.conf.host + ":" + this.resolveFile(file)]), {
                        stdio: 'inherit',
                    }).catch(foy_1.logger.error)];
            });
        });
    };
    ScpSync.prototype.watch = function () {
        var _this = this;
        foy_1.fs.watchDir(this.conf.localFolder, { throttle: 0 }, function (event, fileOrFolder) {
            var resolvedFileOrFolder = _this.resolveFile(fileOrFolder);
            // pattern match
            if (_this.conf.ignore.some(function (i) {
                console.log("minimatch", resolvedFileOrFolder, i, minimatch_1.default(resolvedFileOrFolder, i));
                return minimatch_1.default(resolvedFileOrFolder, i);
            })) {
                foy_1.logger.debug('ignore', fileOrFolder);
                return;
            }
            _this._runningScpTask = _this._runningScpTask
                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                var exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            foy_1.logger.log('watch', event, fileOrFolder);
                            return [4 /*yield*/, foy_1.fs.exists(fileOrFolder)];
                        case 1:
                            exists = _a.sent();
                            if (!exists) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.scp(fileOrFolder)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.ssh("rm -rf " + resolvedFileOrFolder)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); })
                .catch(foy_1.logger.error);
        });
        foy_1.logger.info("Start watching: " + process.cwd());
    };
    ScpSync.prototype.startCmd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.conf.startCmd) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, this.ssh("" + this.conf.startCmd)];
            });
        });
    };
    ScpSync.prototype.ssh = function (cmd) {
        foy_1.logger.info('ssh', cmd);
        return foy_1.spawn('ssh', __spreadArray(__spreadArray([], (this.conf.sshParams || [])), [
            this.conf.host,
            '-t',
            "$SHELL -i -c \"cd " + this.conf.remoteFolder + ";" + cmd.replace('"', '\\"') + "\"",
        ]), {
            stdio: 'inherit',
        }).catch(foy_1.logger.error);
    };
    return ScpSync;
}());
exports.ScpSync = ScpSync;
//# sourceMappingURL=index.js.map