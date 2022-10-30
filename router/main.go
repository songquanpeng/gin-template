package router

import (
	"embed"
	"gin-template/router/v0"
	"github.com/gin-gonic/gin"
)

func SetRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte) {
	v0.SetApiRouter(router)
	setWebRouter(router, buildFS, indexPage)
}
