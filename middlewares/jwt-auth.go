package middlewares

import (
	"gin-template/common"
	"github.com/gin-gonic/gin"
	"net/http"
)

func JWTAuthMiddleware() func(c *gin.Context) {
	return func(c *gin.Context) {
		token, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusOK, gin.H{
				"status":  false,
				"message": "cookie not found",
			})
			c.Abort()
			return
		}

		claims, err := common.ParseToken(token)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{
				"status":  false,
				"message": "invalid token",
			})
			c.Abort()
			return
		}
		if claims.IsBanned {
			c.JSON(http.StatusOK, gin.H{
				"status":  false,
				"message": "you has been banned",
			})
			c.Abort()
			return
		}
		c.Set("username", claims.Username)
		c.Set("is_admin", claims.IsAdmin)
		c.Set("is_banned", claims.IsBanned)
		c.Next()
	}
}
