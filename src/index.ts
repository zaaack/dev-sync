import { exec, fs, logger, spawn } from 'foy'
import path from 'path'

export interface Conf {
  port?: number
  scpParams?: string[]
  sshParams?: string[]
  host: string
  remoteFolder: string
  startCmd?: string
  watchDir?: string
}
export class ScpSync {
  constructor(private conf: Conf) {
    conf.scpParams = conf.scpParams || []
    conf.sshParams = conf.sshParams || []
    conf.watchDir = conf.watchDir || process.cwd()
    if (conf.port) {
      conf.scpParams.push('-P', conf.port + '')
      conf.sshParams.push('-p', conf.port + '')
    }
  }

  static resolveConf() {
    let conf: Conf = {
      host: '',
      remoteFolder: '',
    }
    const ScpSyncFile = './scpSync.json'
    if (fs.existsSync(ScpSyncFile)) {
      conf = fs.readJsonSync(ScpSyncFile)
    } else {
      const pkg = require('../package.json')
      if (!pkg.scpSync) {
        throw new Error(`Cannot find config in ./scpSync.json or package.json['scpSync']`)
      }
      conf = pkg.devSync
    }
    if (!conf.host || !conf.remoteFolder) {
      throw new Error(`Invalid conf file:${JSON.stringify(conf, null, 2)}`)
    }
    return new ScpSync(conf)
  }
  resolveFile(file: string) {
    const relatedPath = path.relative(this.conf.watchDir!, path.resolve(this.conf.watchDir!, file))
    return path.resolve(this.conf.remoteFolder, relatedPath)
  }
  async scp(file: string) {
    await spawn('scp', [
      ...(this.conf.scpParams || []),
      file,
      `${this.conf.host}:${this.resolveFile(file)}`,
    ])
  }
  watch() {
    fs.watchDir(this.conf.watchDir!, (event, file) => {
      logger.log('watch', event, file)
      if (event !== 'delete') {
        this.scp(file)
      } else {
        this.ssh(`rm -rf ${this.resolveFile(file)}`)
      }
    })
    logger.info(`Start watching: ${process.cwd()}`)
  }
  async startCmd() {
    if (!this.conf.startCmd) {
      return
    }
    return this.ssh(`cd ${this.conf.remoteFolder};${this.conf.startCmd}`)
  }
  ssh(cmd: string) {
    logger.info('ssh', cmd)
    return spawn('ssh', [
      ...(this.conf.sshParams || []),
      this.conf.host,
      '-t',
      `$SHELL -i -c "${cmd.replace('"', '\\"')}"`,
    ], {
      stdio: 'inherit'
    })
  }
}
