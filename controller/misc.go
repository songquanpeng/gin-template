package controller

import (
	"gin-react-template/common"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": false,
		"message": "TODO",
	})
	return
}

func GetNotice(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    common.OptionMap["Notice"],
	})
	return
}
