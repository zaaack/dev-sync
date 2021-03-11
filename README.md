# @zaaack/scp-sync

Sync project files to remote server via scp.

## Features

* sync file when file changed
* start command after watching
* customize watching directory and remote directory

## Usage

```sh
yarn global add @zaaack/scp-sync
scp-sync init # this generate config file "scpSync.json" in current directory.
```

then edit scpSync.json,
```json
{
  "host": "yourName@yourHost",
  "startCmd": "start command to run remotely after watching",
  "remoteFolder": "yourRemoteFolderPath",
  "localFolder": "yourLocalFolderPath",
  "port": 0,
  "sshParams": ["extra", "ssh", "params", "when", "running", "startCmd"],
  "scpParams": ["extra", "scp", "params", "when", "syncing", "files"],
  "ignore": ["**/.DS_Store", "**/node_modules/**"] // 忽略同步某些文件，支持 glob
}
```

start watching

```sh
scp-sync start
# scp-sync watch # watch and sync files
# scp-sync exec # exec start command
```
