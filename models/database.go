package models

import (
	"errors"
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func init() {
	db, err := gorm.Open(sqlite.Open("./data.db"), &gorm.Config{})
	if err == nil {
		DB = db
		_ = db.AutoMigrate(&User{}, &Page{}, &File{}, &Option{})
	} else {
		log.Fatal(err)
	}
	user := User{}
	if err := db.First(&user).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		fmt.Println("Create an administrator user account for you, username is admin with password 123456.")
		user.Username = "admin"
		user.Password = "123456"
		user.IsAdmin = true
		if err := DB.Create(&user).Error; err != nil {
			fmt.Println(err.Error())
		}
	}

	return
}
