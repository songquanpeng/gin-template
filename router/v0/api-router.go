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
			userRoute.POST("/token", controller.GetToken)

			adminRoute := userRoute.Group("/")
			adminRoute.Use(middleware.AdminAuth())
			{
				adminRoute.GET("/", controller.GetAllUsers)
				adminRoute.GET("/:id", controller.GetUser)
				adminRoute.POST("/", controller.CreateUser)
				adminRoute.PUT("/:id", controller.UpdateUser)
				adminRoute.DELETE("/:id", controller.DeleteUser)
			}
			selfRoute := userRoute.Group("/self")
			selfRoute.Use(middleware.UserAuth())
			{
				selfRoute.GET("/", controller.GetSelf)
				selfRoute.PUT("/", controller.UpdateSelf)
				selfRoute.DELETE("/", controller.DeleteSelf)
			}
		}
		optionRoute := apiRouter.Group("/options")
		optionRoute.Use(middleware.AdminAuth())
		{
			optionRoute.GET("/option", controller.GetOptions)
			optionRoute.PUT("/option", controller.UpdateOption)
		}
		fileRoute := apiRouter.Group("/file")
		{
			fileRoute.GET("/:id", controller.DownloadFile)
			fileRoute.POST("/", middleware.UserAuth(), controller.UploadFile)
			fileRoute.DELETE("/:id", middleware.UserAuth(), controller.DeleteFile)
		}
	}
}
