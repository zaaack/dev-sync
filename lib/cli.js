#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cac_1 = __importDefault(require("cac"));
var index_1 = require("./index");
var foy_1 = require("foy");
var cli = cac_1.default('scp-sync');
cli
    .command('start', 'start watching and syncing...')
    .option('-w, --watch-only', 'watch only')
    .option('-s, --start-only', 'start command only')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var options = args.pop();
    var scpSync = index_1.ScpSync.resolveConf();
    if (!options.startOnly) {
        scpSync.watch();
    }
    if (!options.watchOnly) {
        scpSync.startCmd();
    }
});
cli.command('init').action(function () {
    var conf = {
        host: 'yourName@yourServer',
        startCmd: 'npm start',
        remoteFolder: 'yourRemoteFolderPath',
        watchDir: "yourLocalFolderPath",
        port: 0,
        scpParams: [],
        sshParams: [],
    };
    foy_1.fs.outputJsonSync('./scpSync.json', conf, {
        space: 2
    });
});
cli.help();
cli.parse();
//# sourceMappingURL=cli.js.map