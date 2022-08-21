package controller

import (
	"gin-react-template/common"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetStaticFile(c *gin.Context) {
	path := c.Param("file")
	c.FileFromFS("public/static/"+path, http.FS(common.FS))
}

func GetLibFile(c *gin.Context) {
	path := c.Param("file")
	c.FileFromFS("public/lib/"+path, http.FS(common.FS))
}
