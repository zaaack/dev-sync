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
var scpSync = index_1.ScpSync.resolveConf();
cli
    .command('start', 'start watching and syncing...')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    scpSync.watch();
    scpSync.startCmd();
});
cli
    .command('watch', 'watch and sync files')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    scpSync.watch();
});
cli
    .command('exec', 'exec start command')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    scpSync.startCmd();
});
cli.command('init').action(function () {
    var conf = {
        host: 'yourName@yourServer',
        startCmd: 'npm start',
        remoteFolder: 'yourRemoteFolderPath',
        localFolder: "yourLocalFolderPath",
        port: 0,
        scpParams: [],
        sshParams: [],
        ignore: ['**/.DS_Store', '**/node_modules/**']
    };
    foy_1.fs.outputJsonSync('./scpSync.json', conf, {
        space: 2
    });
});
cli.help();
cli.version(require('../package.json').version);
cli.parse();
//# sourceMappingURL=cli.js.map