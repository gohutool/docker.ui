package handle

import (
	"errors"
	. "github.com/gohutool/boot4go-docker-ui/model"
	routing "github.com/qiangxue/fasthttp-routing"
	"strings"
)

/**
* boot4go-docker-ui源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : util.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/8/22 15:25
* 修改历史 : 1. [2022/8/22 15:25] 创建文件 by LongYong
*/

func GetRequestInfo(context string, ctx *routing.Context) (rtn RequestInfo, err error) {

	path := string(ctx.Path())

	uris := strings.Split(path, context+"/")

	if len(uris) <= 1 {
		err = errors.New(path + " is not good")
		return
	}

	host := string(ctx.Request.Header.Peek("endpoint"))

	if len(host) == 0 {
		err = errors.New("not set endpoint in request header, you must set endpoint in your request header")
		return
	}

	version := string(ctx.Request.Header.Peek("endpoint_version"))

	if len(version) == 0 {
		version = "v1.32"
	}

	if strings.Index(version, "v1.") != 0 {
		err = errors.New("endpoint_version is not right, please check it in request header")
		return
	}

	rtn.Host = host
	rtn.Api = uris[1]
	rtn.Version = version
	rtn.Path = "/" + version + "/" + uris[1]

	return
}
