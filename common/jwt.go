package common

import (
	"errors"
	"gin-template/models"
	"github.com/dgrijalva/jwt-go"
	"os"
	"time"
)

type MyClaims struct {
	Username string `json:"username"`
	IsAdmin  bool   `json:"is_admin"`
	IsBanned bool   `json:"is_banned"`
	jwt.StandardClaims
}

const TokenExpireDuration = time.Hour * TokenExpireHour

var Secret = []byte("default secret")

func init() {
	if os.Getenv("SECRET") != "" {
		Secret = []byte(os.Getenv("SECRET"))
	}
}

func GenerateToken(user models.User) (string, error) {
	c := MyClaims{
		user.Username,
		user.IsAdmin,
		user.IsBlocked,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(TokenExpireDuration).Unix(),
			Issuer:    AppName,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString(Secret)
}

func ParseToken(tokenString string) (*MyClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (i interface{}, err error) {
		return Secret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}
