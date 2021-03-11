import { exec, fs, logger, spawn } from 'foy'
import path from 'path'
import minimatch from "minimatch"

export interface Conf {
  port?: number
  scpParams?: string[]
  sshParams?: string[]
  host: string
  remoteFolder: string
  startCmd?: string
  localFolder?: string
  ignore: string[]
}
export class ScpSync {
  constructor(private conf: Conf) {
    conf.scpParams = conf.scpParams || []
    conf.sshParams = conf.sshParams || []
    conf.localFolder = conf.localFolder || process.cwd()
    conf.ignore = conf.ignore || []
    if (conf.port) {
      conf.scpParams.push('-P', conf.port + '')
      conf.sshParams.push('-p', conf.port + '')
    }
  }

  static resolveConf() {
    let conf: Conf = {
      host: '',
      remoteFolder: '',
      ignore: [],
    }
    const ScpSyncFile = './scpSync.json'
    if (fs.existsSync(ScpSyncFile)) {
      conf = fs.readJsonSync(ScpSyncFile)
    } else {
      const pkg = require('../package.json')
      if (!pkg.scpSync) {
        throw new Error(`Cannot find config in ./scpSync.json or package.json['scpSync']`)
      }
      conf = pkg.scpSync
    }
    if (!conf.host || !conf.remoteFolder) {
      throw new Error(`Invalid conf file:${JSON.stringify(conf, null, 2)}`)
    }
    return new ScpSync(conf)
  }
  resolveFile(file: string) {
    const relatedPath = path.relative(
      this.conf.localFolder!,
      path.join(this.conf.localFolder!, file),
    )
    return path.join(this.conf.remoteFolder, relatedPath)
  }
  async scp(file: string) {
    return spawn(
      'scp',
      ['-rp', ...(this.conf.scpParams || []), file, `${this.conf.host}:${this.resolveFile(file)}`],
      {
        stdio: 'inherit',
      },
    ).catch(logger.error)
  }
  // make sync task running as queue
  private _runningScpTask = Promise.resolve()
  watch() {
    fs.watchDir(this.conf.localFolder!, (event, fileOrFolder) => {
      const resolvedFileOrFolder = this.resolveFile(fileOrFolder)
      // pattern match
      if (
        this.conf.ignore.some((i) => {
          return minimatch(resolvedFileOrFolder, i)
        })
      ) {
        logger.debug('ignore', fileOrFolder)
        return
      }
      this._runningScpTask = this._runningScpTask
        .then(async () => {
          logger.log('watch', event, fileOrFolder)
          const exists = await fs.exists(fileOrFolder)
          if (exists) {
            await this.scp(fileOrFolder)
          } else {
            await this.ssh(`rm -rf ${resolvedFileOrFolder}`)
          }
        })
        .catch(logger.error)
    })
    logger.info(`Start watching: ${process.cwd()}`)
  }
  async startCmd() {
    if (!this.conf.startCmd) {
      return
    }
    return this.ssh(`${this.conf.startCmd}`)
  }
  ssh(cmd: string) {
    logger.info('ssh', cmd)
    return spawn(
      'ssh',
      [
        ...(this.conf.sshParams || []),
        this.conf.host,
        '-t',
        `$SHELL -i -c "cd ${this.conf.remoteFolder};${cmd.replace('"', '\\"')}"`,
      ],
      {
        stdio: 'inherit',
      },
    ).catch(logger.error)
  }
}
