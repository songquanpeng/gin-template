package main

import (
	"embed"
	"gin-template/common"
	"gin-template/model"
	"gin-template/router"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"strconv"
)

//go:embed web/build
var buildFS embed.FS

//go:embed web/build/index.html
var indexPage []byte

func main() {
	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}
	// Initialize SQL Database
	db, err := model.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize Redis
	err = common.InitRedisClient()
	if err != nil {
		log.Fatal(err.Error())
	}

	// Initialize options
	model.InitOptionMap()

	// Initialize HTTP server
	server := gin.Default()

	// Initialize session store
	if common.RedisEnabled {
		opt := common.ParseRedisOption()
		store, _ := redis.NewStore(opt.MinIdleConns, opt.Network, opt.Addr, opt.Password, []byte(common.SessionSecret))
		server.Use(sessions.Sessions("session", store))
	} else {
		store := cookie.NewStore([]byte(common.SessionSecret))
		server.Use(sessions.Sessions("session", store))
	}

	router.SetRouter(server, buildFS, indexPage)
	var realPort = os.Getenv("PORT")
	if realPort == "" {
		realPort = strconv.Itoa(*common.Port)
	}
	if *common.Host == "localhost" {
		ip := common.GetIp()
		if ip != "" {
			*common.Host = ip
		}
	}
	serverUrl := "http://" + *common.Host + ":" + realPort + "/"
	if !*common.NoBrowser {
		common.OpenBrowser(serverUrl)
	}
	err = server.Run(":" + realPort)
	if err != nil {
		log.Println(err)
	}
}
