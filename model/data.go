package model

import (
	"time"
)

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : data.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/5/13 14:05
* 修改历史 : 1. [2022/5/13 14:05] 创建文件 by LongYong
*/

type User struct {
	UserName     string
	UserID       string
	CreateTime   time.Time
	UserPassword string
	Token        string
}

type RequestInfo struct {
	Api     string
	Host    string
	Version string
	Path    string
}
