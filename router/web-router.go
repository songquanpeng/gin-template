package router

import (
	"embed"
	"gin-react-template/common"
	"gin-react-template/controller"
	"gin-react-template/middleware"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func setWebRouter(router *gin.Engine, buildFS embed.FS) {
	router.Use(middleware.GlobalWebRateLimit())

	// Download files
	fileDownloadAuth := router.Group("/")
	fileDownloadAuth.Use(middleware.DownloadRateLimit(), middleware.FileDownloadPermissionCheck())
	{
		fileDownloadAuth.GET("/upload/:file", controller.DownloadFile)
		fileDownloadAuth.GET("/explorer", controller.GetExplorerPageOrFile)
	}
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/build")))
}
