# @zaaack/scp-sync

Sync project files to remote server via scp.

## Features

* sync file when file changed
* start command after watching
* customize watching directory and remote directory

## Usage

```sh
yarn add -D @zaaack/scp-sync
npx scp-sync init # this generate config file "scpSync.json" in current directory.
```

then edit scpSync.json,
```json
{
  "host": "yourName@yourHost",
  "startCmd": "start command to run after watching",
  "remoteFolder": "the remote project folder to be sync to",
  "port": 0,
  "sshParams": "extra ssh params when running startCmd",
  "scpParams": "extra scp params when syncing files"
}
```

start watching

```sh
yarn scp-sync start
# yarn scp-sync start -w # watch only
# yarn scp-sync start -s # sync only
```
