#!/usr/bin/env node

import cac from 'cac'
import { ScpSync, Conf } from './index'
import { fs } from 'foy'

const cli = cac('scp-sync')

cli
.command('start', 'start watching and syncing...')
.option('-w, --watch-only', 'watch only')
.option('-s, --start-only', 'start command only')
.action((...args) => {
  const options = args.pop()
  const scpSync = ScpSync.resolveConf()
  if (!options.startOnly) {
    scpSync.watch()
  }
  if (!options.watchOnly) {
    scpSync.startCmd()
  }
})

cli.command('init').action(() => {
  const conf: Conf = {
    host: 'yourName@yourServer',
    startCmd: 'npm start',
    remoteFolder: 'yourRemoteFolderPath',
    watchDir: "yourLocalFolderPath",
    port: 0,
    scpParams: [],
    sshParams: [],
  }
  fs.outputJsonSync('./scpSync.json', conf, {
    space: 2
  })
})

cli.help()
cli.parse()
