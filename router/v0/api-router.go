package v0

import (
	"gin-react-template/controller"
	"gin-react-template/middleware"
	"github.com/gin-gonic/gin"
)

func SetApiRouter(router *gin.Engine) {
	apiRouter := router.Group("/api")
	apiRouter.Use(middleware.GlobalAPIRateLimit())
	{
		apiRouter.GET("/status", controller.GetStatus)
		apiRouter.GET("/notice", controller.GetNotice)

		userRoute := apiRouter.Group("/user")
		{
			userRoute.POST("/register", controller.Register)
			userRoute.POST("/login", controller.Login)
			userRoute.GET("/logout", controller.Logout)
			userRoute.GET("/token", controller.GenerateToken)

			selfRoute := userRoute.Group("/")
			selfRoute.Use(middleware.NoTokenAuth(), middleware.UserAuth())
			{
				selfRoute.GET("/self", controller.GetSelf)
				selfRoute.PUT("/self", controller.UpdateSelf)
				selfRoute.DELETE("/self", controller.DeleteSelf)
			}

			adminRoute := userRoute.Group("/")
			adminRoute.Use(middleware.NoTokenAuth(), middleware.AdminAuth())
			{
				adminRoute.GET("/", controller.GetAllUsers)
				adminRoute.GET("/:id", controller.GetUser)
				adminRoute.POST("/", controller.CreateUser)
				adminRoute.POST("/manage", controller.ManageUser)
				adminRoute.PUT("/", controller.UpdateUser)
				adminRoute.DELETE("/:id", controller.DeleteUser)
			}
		}
		optionRoute := apiRouter.Group("/option")
		optionRoute.Use(middleware.NoTokenAuth(), middleware.AdminAuth())
		{
			optionRoute.GET("/", controller.GetOptions)
			optionRoute.PUT("/", controller.UpdateOption)
		}
		fileRoute := apiRouter.Group("/file")
		{
			fileRoute.GET("/:id", controller.DownloadFile)
			fileRoute.POST("/", middleware.UserAuth(), controller.UploadFile)
			fileRoute.DELETE("/:id", middleware.UserAuth(), controller.DeleteFile)
		}
	}
}
