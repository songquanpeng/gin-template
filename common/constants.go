package common

import (
	"github.com/google/uuid"
	"sync"
	"time"
)

var StartTime = time.Now().Unix() // unit: second
var Version = "v0.0.0"
var SystemName = "项目模板"
var ServerAddress = "http://localhost:3000"

var SessionSecret = uuid.New().String()
var SQLitePath = ".gin-template.db"

var OptionMap map[string]string
var OptionMapRWMutex sync.RWMutex

var ItemsPerPage = 10

var PasswordLoginEnabled = true
var RegisterEnabled = true
var EmailVerificationEnabled = false
var GitHubOAuthEnabled = false

var SMTPServer = ""
var SMTPAccount = ""
var SMTPToken = ""

var GitHubClientId = ""
var GitHubClientSecret = ""

const (
	RoleGuestUser  = 0
	RoleCommonUser = 1
	RoleAdminUser  = 10
	RoleRootUser   = 100
)

var (
	FileUploadPermission    = RoleGuestUser
	FileDownloadPermission  = RoleGuestUser
	ImageUploadPermission   = RoleGuestUser
	ImageDownloadPermission = RoleGuestUser
)

var (
	GlobalApiRateLimit = 20
	GlobalWebRateLimit = 60
	UploadRateLimit    = 10
	DownloadRateLimit  = 10
	CriticalRateLimit  = 3
)

const (
	UserStatusEnabled  = 1 // don't use 0, 0 is the default value!
	UserStatusDisabled = 2 // also don't use 0
)
