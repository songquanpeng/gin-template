package router

import (
	"embed"
	"gin-react-template/middleware"
	"gin-react-template/router/v0"
	"github.com/gin-gonic/gin"
)

func SetRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte) {
	router.Use(middleware.AllStat())

	v0.SetApiRouter(router)
	setWebRouter(router, buildFS, indexPage)
}
