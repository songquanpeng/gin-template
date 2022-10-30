package common

import (
	"flag"
	"fmt"
	"github.com/google/uuid"
	"os"
	"path"
	"path/filepath"
	"sync"
	"time"
)

var StartTime = time.Now().Unix() // unit: second
var Version = "v0.0.0"
var SystemName = "项目模板"
var ServerAddress = "http://localhost:3000"

var OptionMap map[string]string
var OptionMapRWMutex sync.RWMutex

var ItemsPerPage = 10

var PasswordLoginEnabled = true
var RegisterEnabled = true
var EmailVerificationEnabled = false
var GitHubOAuthEnabled = true

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

var (
	Port         = flag.Int("port", 3000, "specify the server listening port.")
	Host         = flag.String("host", "localhost", "the server's ip address or domain")
	Path         = flag.String("path", "", "specify a local path to public")
	VideoPath    = flag.String("video", "", "specify a video folder to public")
	NoBrowser    = flag.Bool("no-browser", false, "open browser or not")
	PrintVersion = flag.Bool("version", false, "print version")
)

// UploadPath Maybe override by ENV_VAR
var UploadPath = "upload"
var ExplorerRootPath = UploadPath
var ImageUploadPath = "upload/images"
var VideoServePath = "upload"

var SessionSecret = uuid.New().String()

var SQLitePath = ".gin-template.db"

func init() {
	flag.Parse()

	if *PrintVersion {
		fmt.Println(Version)
		os.Exit(0)
	}

	if os.Getenv("SESSION_SECRET") != "" {
		SessionSecret = os.Getenv("SESSION_SECRET")
	}
	if os.Getenv("SQLITE_PATH") != "" {
		SQLitePath = os.Getenv("SQLITE_PATH")
	}
	if os.Getenv("UPLOAD_PATH") != "" {
		UploadPath = os.Getenv("UPLOAD_PATH")
		ExplorerRootPath = UploadPath
		ImageUploadPath = path.Join(UploadPath, "images")
		VideoServePath = UploadPath
	}
	if *Path != "" {
		ExplorerRootPath = *Path
	}
	if *VideoPath != "" {
		VideoServePath = *VideoPath
	}

	ExplorerRootPath, _ = filepath.Abs(ExplorerRootPath)
	VideoServePath, _ = filepath.Abs(VideoServePath)
	ImageUploadPath, _ = filepath.Abs(ImageUploadPath)

	if _, err := os.Stat(UploadPath); os.IsNotExist(err) {
		_ = os.Mkdir(UploadPath, 0777)
	}
	if _, err := os.Stat(ImageUploadPath); os.IsNotExist(err) {
		_ = os.Mkdir(ImageUploadPath, 0777)
	}
}
