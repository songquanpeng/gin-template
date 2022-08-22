package router

import (
	"embed"
	"gin-react-template/common"
	"gin-react-template/middleware"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func setWebRouter(router *gin.Engine, buildFS embed.FS) {
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/build")))
}
