package middleware

import (
	"gin-react-template/common"
	"gin-react-template/model"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

func UserAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		username := session.Get("username")
		role := session.Get("role")
		id := session.Get("id")
		status := session.Get("status")
		if username == nil {
			// Check token
			token := c.Request.Header.Get("Authorization")
			user := model.ValidateUserToken(token)
			if user != nil && user.Username != "" {
				// Token is valid
				username = user.Username
				role = user.Role
				id = user.Id
				status = user.Status
			} else {
				c.JSON(http.StatusForbidden, gin.H{
					"success": false,
					"message": "无权进行此操作，未登录或 token 无效",
				})
				c.Abort()
				return
			}
		}
		if status.(int) == common.UserStatusDisabled {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "用户已被封禁",
			})
			c.Abort()
			return
		}
		c.Set("username", username)
		c.Set("role", role)
		c.Set("id", id)
		c.Next()
	}
}

func AdminAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		username := session.Get("username")
		role := session.Get("role")
		id := session.Get("id")
		if username == nil {
			// Check token
			token := c.Request.Header.Get("Authorization")
			user := model.ValidateUserToken(token)
			if user != nil && user.Username != "" {
				// Token is valid
				username = user.Username
				role = user.Role
				id = user.Id
			}
		}
		if role.(int) < common.RoleAdminUser {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "无权进行此操作，未登录或 token 无效，或没有权限",
			})
			c.Abort()
			return
		}
		c.Set("username", username)
		c.Set("role", role)
		c.Set("id", id)
		c.Next()
	}
}

func NoTokenAuth() func(c *gin.Context) {
	return func(c *gin.Context) {
		authByToken := c.GetString("authByToken")
		if authByToken == "true" {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "该接口不能使用 token 进行验证",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
