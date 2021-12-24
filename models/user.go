package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type User struct {
	ID          uuid.UUID `gorm:"primaryKey;column:id"`
	Username    string    `gorm:"unique"`
	DisplayName string    `gorm:"column:displayName" json:"displayName"`
	Password    string    `gorm:"not null"`
	AccessToken uuid.UUID `gorm:"column:accessToken" json:"accessToken"`
	Email       string
	Url         string
	Avatar      string
	IsAdmin     bool      `gorm:"column:isAdmin" json:"isAdmin"`
	IsModerator bool      `gorm:"column:isModerator" json:"isModerator"`
	IsBlocked   bool      `gorm:"column:isBlocked" json:"isBlocked"`
	CreatedAt   time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

func (User) TableName() string {
	return "Users"
}

func (u *User) BeforeCreate(*gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}
