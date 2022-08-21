package router

import (
	"gin-react-template/controller"
	"gin-react-template/middleware"
	"github.com/gin-gonic/gin"
)

func SetRouter(router *gin.Engine) {
	router.Use(middleware.AllStat())
	setWebRouter(router)
	setApiRouter(router)
	router.NoRoute(controller.Get404Page)
}
