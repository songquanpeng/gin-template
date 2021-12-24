package controllers

import (
	"gin-template/common"
	model "gin-template/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func getUsername(c *gin.Context) (username string, ok bool) {
	username = c.Param("username")
	ok = true
	if username == "" {
		value, ok := c.Get("username")
		if !ok {
			return "", false
		}
		username = value.(string)
	}
	return username, ok
}

func GetUserStatus(c *gin.Context) {
	username, ok := getUsername(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"status":  false,
			"message": "unable to fetch username from header",
		})
		return
	}
	user := &model.User{}
	if err := model.DB.Where("username = ?", username).First(user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"status":  false,
			"message": "record not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "ok",
		"user":    user,
	})
}

func GetUser(c *gin.Context) {
	username, ok := getUsername(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusUnexpectedError,
			"message": "unable to fetch username from header",
		})
		return
	}
	user := &model.User{}
	if err := model.DB.Where("username = ?", username).First(user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    gin.H{"user": user},
	})
}

func CreateUser(c *gin.Context) {
	var user *model.User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "invalid parameters",
		})
		return
	}
	if err := model.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    gin.H{"user": user},
	})
}

func UpdateUser(c *gin.Context) {
	username, ok := getUsername(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusUnexpectedError,
			"message": "unable to fetch username from header",
		})
		return
	}
	user := &model.User{}
	if err := model.DB.Where("username = ?", username).First(user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	var newUser model.User
	if err := c.ShouldBind(&newUser); err != nil || newUser.Password == "" || newUser.Username == "" {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "invalid parameters",
		})
		return
	}

	// ID should not be changed.
	newUser.ID = user.ID
	if !user.IsAdmin {
		// User is not an admin user, so we cannot let it change the following attributes.
		newUser.IsAdmin = user.IsAdmin
		newUser.IsBlocked = user.IsBlocked
	}
	if err := model.DB.Save(newUser).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    gin.H{"user": newUser},
	})
}

func DeleteUser(c *gin.Context) {
	// Only the admin can delete user.
	username := c.Param("username")
	user := &model.User{}
	if err := model.DB.Where("username = ?", username).First(user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	if err := model.DB.Delete(user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
	})
}
