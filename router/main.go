package router

import (
	"embed"
	"gin-react-template/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func SetRouter(router *gin.Engine, buildFS embed.FS) {
	router.Use(middleware.AllStat())

	setApiRouter(router)
	setWebRouter(router, buildFS)
	router.NoRoute(func(c *gin.Context) {
		c.Redirect(http.StatusSeeOther, "/")
	})
}
