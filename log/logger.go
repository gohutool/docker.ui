package log

import "github.com/gohutool/log4go"

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : logger.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/5/12 20:20
* 修改历史 : 1. [2022/5/12 20:20] 创建文件 by LongYong
*/

func init() {
	defer func() {
		if err := recover(); err != nil {
			log4go.LoggerManager.InitWithDefaultConfig()
		}
	}()
	log4go.LoggerManager.InitWithXML("log4go.xml")

}

var Logger = log4go.LoggerManager.GetLogger("gohutool.docker4go.ui")
