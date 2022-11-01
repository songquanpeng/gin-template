package model

import (
	"gin-template/common"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"log"
	"os"
)

var DB *gorm.DB

func createRootAccountIfNeed() error {
	var user User
	DB.First(&user)
	if user.Status != common.UserStatusEnabled {
		hashedPassword, err := common.Password2Hash("123456")
		if err != nil {
			return err
		}
		rootUser := User{
			Username:    "root",
			Password:    hashedPassword,
			Role:        common.RoleRootUser,
			Status:      common.UserStatusEnabled,
			DisplayName: "Root User",
		}
		DB.Create(&rootUser)
	}
	return nil
}

func CountTable(tableName string) (num int) {
	DB.Table(tableName).Count(&num)
	return
}

func InitDB() (db *gorm.DB, err error) {
	if os.Getenv("SQL_DSN") != "" {
		// Use MySQL
		db, err = gorm.Open("mysql", os.Getenv("SQL_DSN"))
	} else {
		// Use SQLite
		db, err = gorm.Open("sqlite3", common.SQLitePath)
	}
	if err == nil {
		DB = db
		db.AutoMigrate(&File{})
		db.AutoMigrate(&User{})
		db.AutoMigrate(&Option{})
		err = createRootAccountIfNeed()
		return DB, err
	} else {
		log.Fatal(err)
	}
	return nil, err
}
