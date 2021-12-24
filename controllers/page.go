package controllers

import (
	"gin-template/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAllPages(c *gin.Context) {
	var pages []*models.Page
	if err := models.DB.Table("pages").
		Select("pages.id, pages.type, pages.view, pages.link, pages.pageStatus, pages.commentStatus, pages.title, pages.tag, pages.description").
		Joins("left join users on users.id = pages.UserId").
		Order("pages.updatedAt desc").Scan(&pages).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"status":  false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "ok",
		"pages":   pages,
	})
}
