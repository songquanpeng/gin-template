package controller

import (
	"encoding/json"
	"fmt"
	"gin-template/common"
	"gin-template/model"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type wechatLoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    string `json:"data"`
}

func WeChatLogin(c *gin.Context) {
	if !common.WeChatLoginEnabled {
		c.JSON(http.StatusOK, gin.H{
			"message": "管理员未开启微信登录",
			"success": false,
		})
		return
	}
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusOK, gin.H{
			"message": "无效的参数",
			"success": false,
		})
		return
	}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/wechat/user?code=%s", common.WeChatServerAddress, code), nil)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	req.Header.Set("Authorization", common.WeChatServerToken)
	client := http.Client{
		Timeout: 5 * time.Second,
	}
	httpResponse, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	defer httpResponse.Body.Close()
	var res wechatLoginResponse
	err = json.NewDecoder(httpResponse.Body).Decode(&res)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	if !res.Success {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": res.Message,
		})
		return
	}
	if res.Data == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "验证码错误或已过期",
		})
		return
	}
	wechatId := res.Data
	if !model.IsWeChatIdAlreadyTaken(wechatId) {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "用户未注册，请先注册",
		})
		return
	}
	user := model.User{
		WeChatId: wechatId,
	}
	user.FillUserByWeChatId()
	if user.Status != common.UserStatusEnabled {
		c.JSON(http.StatusOK, gin.H{
			"message": "用户已被封禁",
			"success": false,
		})
		return
	}
	setupLogin(&user, c)
}
