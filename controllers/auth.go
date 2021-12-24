package controllers

import (
	"gin-template/common"
	"gin-template/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Login(c *gin.Context) {
	var login *models.Login
	if err := c.ShouldBind(&login); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"status":  false,
			"message": "Invalid parameters",
		})
		return
	}

	realUser := &models.User{}
	if err := models.DB.Where("username = ?", login.Username).First(realUser).Error; err == nil {
		if realUser.Password == login.Password {
			tokenString, _ := common.GenerateToken(*realUser)
			c.SetCookie("token", tokenString, 3600, "/", "", false, true)
			c.JSON(http.StatusOK, gin.H{
				"status":  true,
				"message": "ok",
			})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusInvalidParameter,
		"message": "Invalid pair of username and password",
	})
}
