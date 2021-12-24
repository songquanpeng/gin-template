package models

type Option struct {
	Key   string `gorm:"primaryKey"`
	Value string
}

func (Option) TableName() string {
	return "Options"
}
