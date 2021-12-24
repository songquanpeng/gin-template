package controllers

import (
	"gin-template/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetIndex(c *gin.Context) {
	//page := c.Query("p")

	var pages []*models.Page
	var message = ""
	if err := models.DB.Table("pages").
		Select("pages.view, pages.link, pages.pageStatus, pages.title, pages.tag, pages.description, pages.createdAt").
		Order("pages.updatedAt desc").Scan(&pages).Error; err != nil {
		message = err.Error()
	}

	c.HTML(http.StatusOK, "index.html", gin.H{
		"message": message,
		"pages":   pages,
	})
}
