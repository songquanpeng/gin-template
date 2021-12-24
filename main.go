package main

import (
	"embed"
	"fmt"
	"gin-template/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"html/template"
	"log"
	"os"
)

//go:embed public
var fs embed.FS

//go:embed web/build
var buildFS embed.FS

var UploadPath = "./upload"

func init() {
	if _, err := os.Stat(UploadPath); os.IsNotExist(err) {
		_ = os.Mkdir(UploadPath, 0777)
	}
}

func loadTemplate() *template.Template {
	t := template.Must(template.New("").ParseFS(fs, "public/*.html"))
	return t
}

func setupServer() *gin.Engine {
	if os.Getenv("MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}
	server := gin.Default()
	server.SetHTMLTemplate(loadTemplate())
	server.Use(cors.Default())
	SetApiRouter(server)
	SetIndexRouter(server)
	return server
}

func main() {
	db, _ := models.DB.DB()
	defer db.Close()

	server := setupServer()
	var port = "3000"
	if len(os.Args) > 1 {
		port = os.Args[1]
	} else {
		if os.Getenv("PORT") != "" {
			port = os.Getenv("PORT")
		}
	}
	fmt.Println("Server listen on port: " + port)
	log.Fatal(server.Run(":" + port))
}
