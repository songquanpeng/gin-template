package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Page struct {
	ID            uuid.UUID `gorm:"primaryKey;column:id" json:"id"`
	Type          int       `gorm:"unique;default 0" json:"type"`
	Link          string    `gorm:"not null" json:"link"`
	PageStatus    int8      `gorm:"default 1;column:pageStatus" json:"pageStatus"`
	CommentStatus int8      `gorm:"default 1;column:commentStatus" json:"commentStatus"`
	Title         string    `gorm:"not null" json:"title"`
	Content       string    `gorm:"not null" json:"content"`
	Tag           string    `json:"tag"`
	Password      string    `json:"password"`
	View          int       `json:"view"`
	UpVote        int       `gorm:"column:upVote" json:"upVote"`
	DownVote      int       `gorm:"column:downVote" json:"downVote"`
	Description   string    `json:"description"`
	CreatedAt     string    `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt     string    `gorm:"column:updatedAt" json:"updatedAt"`
	UserId        uuid.UUID `gorm:"column:UserId" json:"UserId"`
}

func (Page) TableName() string {
	return "Pages"
}

func (p *Page) BeforeCreate(*gorm.DB) (err error) {
	p.ID = uuid.New()
	return
}
