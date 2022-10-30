package middleware

import (
	"context"
	"fmt"
	"gin-template/common"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

var timeFormat = "2006-01-02T15:04:05.000Z"

var keyExpirationDuration = 1 * time.Minute

var inMemoryRateLimiter common.InMemoryRateLimiter

func redisRateLimiter(c *gin.Context, maxRequestPerMinute int, mark string) {
	ctx := context.Background()
	rdb := common.RDB
	key := "rateLimit:" + mark + c.ClientIP()
	listLength, err := rdb.LLen(ctx, key).Result()
	if err != nil {
		fmt.Println(err.Error())
		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}
	if listLength < int64(maxRequestPerMinute) {
		rdb.LPush(ctx, key, time.Now().Format(timeFormat))
		rdb.Expire(ctx, key, keyExpirationDuration)
	} else {
		oldTimeStr, _ := rdb.LIndex(ctx, key, -1).Result()
		oldTime, err := time.Parse(timeFormat, oldTimeStr)
		if err != nil {
			fmt.Println(err)
			c.Status(http.StatusInternalServerError)
			c.Abort()
			return
		}
		newTimeStr := time.Now().Format(timeFormat)
		newTime, err := time.Parse(timeFormat, newTimeStr)
		if err != nil {
			fmt.Println(err)
			c.Status(http.StatusInternalServerError)
			c.Abort()
			return
		}
		// time.Since will return negative number!
		// See: https://stackoverflow.com/questions/50970900/why-is-time-since-returning-negative-durations-on-windows
		if newTime.Sub(oldTime).Seconds() < 60 {
			c.Status(http.StatusTooManyRequests)
			c.Abort()
			return
		} else {
			rdb.LPush(ctx, key, time.Now().Format(timeFormat))
			rdb.LTrim(ctx, key, 0, int64(maxRequestPerMinute-1))
			rdb.Expire(ctx, key, keyExpirationDuration)
		}
	}
}

func memoryRateLimiter(c *gin.Context, maxRequestPerMinute int, mark string) {
	key := mark + c.ClientIP()
	if !inMemoryRateLimiter.Request(key, maxRequestPerMinute) {
		c.Status(http.StatusTooManyRequests)
		c.Abort()
		return
	}
}

func rateLimitFactory(maxRequestPerMinute int, mark string) func(c *gin.Context) {
	if common.RedisEnabled {
		return func(c *gin.Context) {
			redisRateLimiter(c, maxRequestPerMinute, mark)
		}
	} else {
		// It's safe to call multi times.
		inMemoryRateLimiter.Init(keyExpirationDuration)
		return func(c *gin.Context) {
			memoryRateLimiter(c, maxRequestPerMinute, mark)
		}
	}
}

func GlobalWebRateLimit() func(c *gin.Context) {
	return rateLimitFactory(common.GlobalWebRateLimit, "GW")
}

func GlobalAPIRateLimit() func(c *gin.Context) {
	return rateLimitFactory(common.GlobalApiRateLimit, "GA")
}

func CriticalRateLimit() func(c *gin.Context) {
	return rateLimitFactory(common.CriticalRateLimit, "CT")
}

func DownloadRateLimit() func(c *gin.Context) {
	return rateLimitFactory(common.DownloadRateLimit, "DW")
}

func UploadRateLimit() func(c *gin.Context) {
	return rateLimitFactory(common.UploadRateLimit, "UP")
}
