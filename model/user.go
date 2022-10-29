package model

import (
	"gin-react-template/common"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"strings"
)

type User struct {
	Id               int    `json:"id"`
	Username         string `json:"username" gorm:"unique;"`
	Password         string `json:"password" gorm:"not null;"`
	DisplayName      string `json:"display_name"`
	Role             int    `json:"role" gorm:"type:int;default:1"`   // admin, common
	Status           int    `json:"status" gorm:"type:int;default:1"` // enabled, disabled
	Token            string `json:"token"`
	Email            string `json:"email"`
	VerificationCode string `json:"verification_code" gorm:"-:all"`
}

func GetAllUsers() (users []*User, err error) {
	err = DB.Select([]string{"id", "username", "display_name", "role", "status", "email"}).Find(&users).Error
	return users, err
}

func GetUserById(id int, selectAll bool) (*User, error) {
	user := User{Id: id}
	var err error = nil
	if selectAll {
		err = DB.First(&user, "id = ?", id).Error
	} else {
		err = DB.Select([]string{"id", "username", "display_name", "role", "status", "email"}).First(&user, "id = ?", id).Error
	}
	return &user, err
}

func DeleteUserById(id int) (err error) {
	user := User{Id: id}
	err = DB.Delete(&user).Error
	return err
}

func QueryUsers(query string, startIdx int) (users []*User, err error) {
	query = strings.ToLower(query)
	err = DB.Limit(common.ItemsPerPage).Offset(startIdx).Where("username LIKE ? or display_name LIKE ?", "%"+query+"%", "%"+query+"%").Order("id desc").Find(&users).Error
	return users, err
}

func (user *User) Insert() error {
	var err error
	err = DB.Create(user).Error
	return err
}

func (user *User) Update() error {
	var err error
	err = DB.Model(user).Updates(user).Error
	return err
}

func (user *User) Delete() error {
	var err error
	err = DB.Delete(user).Error
	return err
}

func (user *User) ValidateAndFill() {
	// When querying with struct, GORM will only query with non-zero fields,
	// that means if your field’s value is 0, '', false or other zero values,
	// it won’t be used to build query conditions
	DB.Where(&user).First(&user)
}

func ValidateUserToken(token string) (user *User) {
	if token == "" {
		return nil
	}
	token = strings.Replace(token, "Bearer ", "", 1)
	user = &User{}
	if DB.Where("token = ?", token).First(user).RowsAffected == 1 {
		return user
	}
	return nil
}
