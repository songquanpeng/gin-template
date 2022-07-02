package main

import (
	"gin-template/common"
	"gin-template/controllers"
	"gin-template/middlewares"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetStaticFile(c *gin.Context) {
	path := c.Param("file")
	c.FileFromFS("public/static/"+path, http.FS(fs))
}

func SetIndexRouter(router *gin.Engine) {
	router.GET("/", controllers.GetIndex)
	router.GET("/static/:file", GetStaticFile)
	router.Static("/public/upload", UploadPath)
	router.GET("/status", controllers.GetStatus)
	router.POST("/auth", controllers.Login)
	router.StaticFS("/admin", common.EmbedFolder(buildFS, "web/build"))
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    common.StatusError,
			"message": "the requested url does not exist",
		})
	})
}

func SetApiRouter(router *gin.Engine) {
	apiGroup := router.Group("/api/")
	{
		apiGroup.POST("/user/login", controllers.Login)
		basicAuth := apiGroup.Group("/")
		basicAuth.Use(middlewares.JWTAuthMiddleware())
		{
			basicAuth.GET("/user/status", controllers.GetUserStatus)
			basicAuth.GET("/user", controllers.GetUser)
			basicAuth.PUT("/user", controllers.UpdateUser)
			basicAuth.GET("/page", controllers.GetAllPages)

			adminAuth := basicAuth.Group("/")
			adminAuth.Use(middlewares.AdminAuthMiddleware())
			{
				adminAuth.GET("/user/:username", controllers.GetUser)
				adminAuth.PUT("/user/:username", controllers.UpdateUser)
				adminAuth.DELETE("/user/:username", controllers.DeleteUser)
			}
		}
		//apiGroup.GET("/snippet/:id", controller.GetSnippet)
		//apiGroup.GET("/search/snippet", controller.SearchSnippet)
		//apiGroup.GET("/search/snippet/:query", controller.SearchSnippet)
		apiGroup.POST("/user", controllers.CreateUser)
	}
}
