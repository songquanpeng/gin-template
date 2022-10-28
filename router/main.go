package router

import (
	"embed"
	"gin-react-template/middleware"
	"gin-react-template/router/v0"
	"github.com/gin-gonic/gin"
	"net/http"
)

func SetRouter(router *gin.Engine, buildFS embed.FS) {
	router.Use(middleware.AllStat())

	v0.SetApiRouter(router)
	setWebRouter(router, buildFS)
	router.NoRoute(func(c *gin.Context) {
		c.Redirect(http.StatusSeeOther, "/")
	})
}
