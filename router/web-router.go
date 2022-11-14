package router

import (
	"embed"
	"gin-template/common"
	"gin-template/controller"
	"gin-template/middleware"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"net/http"
)

func setWebRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte) {
	router.Use(middleware.GlobalWebRateLimit())
	fileDownloadAuth := router.Group("/")
	fileDownloadAuth.GET("/upload/:file", middleware.DownloadRateLimit(), controller.DownloadFile)
	fileDownloadAuth.Use(middleware.DownloadRateLimit())
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/build")))
	router.NoRoute(func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
	})
}
