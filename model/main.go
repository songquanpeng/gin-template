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

func createRootAccount() {
	var user User
	DB.Where(User{Role: common.RoleRootUser}).Attrs(User{
		Username:    "root",
		Password:    "123456",
		Role:        common.RoleRootUser,
		Status:      common.UserStatusEnabled,
		DisplayName: "Root User",
	}).FirstOrCreate(&user)
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
		createRootAccount()
		return DB, err
	} else {
		log.Fatal(err)
	}
	return nil, err
}
