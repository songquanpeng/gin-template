# Gin Template
> Template for Gin & React projects.

<p>
  <a href="https://raw.githubusercontent.com/songquanpeng/gin-template/main/LICENSE">
    <img src="https://img.shields.io/github/license/songquanpeng/gin-template?color=brightgreen" alt="license">
  </a>
  <a href="https://github.com/songquanpeng/gin-template/releases/latest">
    <img src="https://img.shields.io/github/v/release/songquanpeng/gin-template?color=brightgreen&include_prereleases" alt="release">
  </a>
  <a href="https://github.com/songquanpeng/gin-template/releases/latest">
    <img src="https://img.shields.io/github/downloads/songquanpeng/gin-template/total?color=brightgreen&include_prereleases" alt="release">
  </a>
  <a href="https://goreportcard.com/report/github.com/songquanpeng/go-file">
    <img src="https://goreportcard.com/badge/github.com/songquanpeng/gin-template" alt="GoReportCard">
  </a>
</p>

## Features
+ [x] Built-in user management.
+ [x] Built-in file management.
+ [x] [GitHub OAuth](https://github.com/settings/applications/new).
+ [x] WeChat official account authorization (need [wechat-server](https://github.com/songquanpeng/wechat-server)).
+ [x] Email verification & password reset.
+ [x] Request rate limit.
+ [x] Use GitHub Actions to build releases & Docker images. 
+ [x] Mobile friendly UI.

## Usage
1. Download built binaries from [GitHub Releases](https://github.com/songquanpeng/gin-template/releases/latest) or build from source:
   ```shell
   git clone https://github.com/songquanpeng/gin-template.git
   go mod download
   go build -ldflags "-s -w" -o gin-template
   ````
2. Run it: 
   ```shell
   chmod u+x gin-template
   ./gin-template --port 3000 --log-dir ./logs
   ```
3. Command line arguments:
4. The username for the initial account is `root` and the password is `123456`.

## Basic Configurations
The system works out of the box.

You can configure the system by set environment variables or specify command line arguments.

After the system is up, you can use the dashboard for further configuration.

### Environment Variables
1. `REDIS_CONN_STRING`: if set, will use Redis as the store of rate limitation instead of memory.
   + Example: `REDIS_CONN_STRING=redis://default:redispw@localhost:49153`
2. `SESSION_SECRET`: if set, will fix session secret.
   + Example: `SESSION_SECRET=random_string`
3. `SQL_DSN`: if set, will use target SQL database instead of SQLite.
   + Example`SQL_DSN=root:123456@tcp(localhost:3306)/gofile`

### Command line Arguments
1. `--port <port_number>`: specify the port number, if not set, will use `3000`.
   1. Example: `--port 3000`
2. `--log-dir <log_dir>`: specify the log dir, if not set, won't save log.
   + Example: `--log-dir ./logs`
3. `--version`: print version and exit.