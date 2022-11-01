# Gin Template
> Template for Gin & React projects.

## Features
+ [x] Built-in user management.
+ [x] [GitHub OAuth login](https://github.com/settings/applications/new).
+ [x] Email verification & password reset.
+ [x] Request rate limitation.
+ [x] Use GitHub Actions to build releases & Docker images. 
+ [x] Mobile friendly UI.

## Usage
Install: `go install github/songquanpeng/gin-template@latest`

Or download built binaries from GitHub release.

Environment variables:
1. `REDIS_CONN_STRING`: if set, will use Redis as the store of rate limitation instead of memory.
   + Example: `REDIS_CONN_STRING=redis://default:redispw@localhost:49153`
2. `SESSION_SECRET`: if set, will fix session secret.
   + Example: `SESSION_SECRET=random_string`
3. `SQL_DSN`: if set, will use target SQL database instead of SQLite.
   + Example`SQL_DSN=root:123456@tcp(localhost:3306)/gofile`