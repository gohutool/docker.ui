package model

import "time"

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : model.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/5/12 20:26
* 修改历史 : 1. [2022/5/12 20:26] 创建文件 by LongYong
*/

const DEFAULT_TOKEN_EXPIRE = 24 * time.Hour
const DEFAULT_ISSUER = "DOCKER-UI"

var TokenExpire = DEFAULT_TOKEN_EXPIRE
var Issuer = DEFAULT_ISSUER
