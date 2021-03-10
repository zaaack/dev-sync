#!/usr/bin/env node

import cac from 'cac'
import { ScpSync, Conf } from './index'
import { fs } from 'foy'

const cli = cac('scp-sync')
const scpSync = ScpSync.resolveConf()

cli
.command('start', 'start watching and syncing...')
.action((...args) => {
  scpSync.watch()
  scpSync.startCmd()
})

cli
.command('watch', 'watch and sync files')
.action((...args) => {
  scpSync.watch()
})

cli
.command('exec', 'exec start command')
.action((...args) => {
  scpSync.startCmd()
})

cli.command('init').action(() => {
  const conf: Conf = {
    host: 'yourName@yourServer',
    startCmd: 'npm start',
    remoteFolder: 'yourRemoteFolderPath',
    localFolder: "yourLocalFolderPath",
    port: 0,
    scpParams: [],
    sshParams: [],
    ignore: ['**/.DS_Store', '**/node_modules/**']
  }
  fs.outputJsonSync('./scpSync.json', conf, {
    space: 2
  })
})

cli.help()
cli.version(require('../package.json').version)
cli.parse()
