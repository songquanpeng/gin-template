package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type File struct {
	ID          uuid.UUID `gorm:"primaryKey;column:id"`
	Description string
	Path        string
	Filename    string
	CreatedAt   time.Time `gorm:"column:createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt"`
}

func (Option) File() string {
	return "Files"
}

func (f *File) BeforeCreate(*gorm.DB) (err error) {
	f.ID = uuid.New()
	return
}
