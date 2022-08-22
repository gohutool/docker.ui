package handle

import (
	"github.com/gohutool/boot4go-docker-ui/db"
	. "github.com/gohutool/boot4go-docker-ui/log"
	. "github.com/gohutool/boot4go-docker-ui/model"
	. "github.com/gohutool/boot4go-util"
	httputil "github.com/gohutool/boot4go-util/http"
	. "github.com/gohutool/boot4go-util/jwt"
	routing "github.com/qiangxue/fasthttp-routing"
)

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : user.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/5/13 15:15
* 修改历史 : 1. [2022/5/13 15:15] 创建文件 by LongYong
*/
type userHandler struct {
}

var UserHandler = &userHandler{}

func (u *userHandler) InitRouter(router *routing.Router, routerGroup *routing.RouteGroup) {
	router.Post("/login", u.Login)
	routerGroup.Post("/user/pwd", u.Pwd)
	router.Get("/logout", u.Logout)
}

func (u *userHandler) Login(context *routing.Context) error {
	username := httputil.GetParams(context.RequestCtx, "username", "")
	password := httputil.GetParams(context.RequestCtx, "password", "")

	if username == "" || password == "" {
		httputil.Result.Fail("请填写登录用户名和用户密码").Response(context.RequestCtx)
		return nil
	}

	username = MD5(username)

	user := db.GetUser(username)

	if user == nil {
		httputil.Result.Fail("登录用户名和用户密码不正确").Response(context.RequestCtx)
		return nil
	}

	if user.UserPassword != SaltMd5(password, user.UserID) {
		httputil.Result.Fail("登录用户名和用户密码不正确").Response(context.RequestCtx)
		return nil
	}

	token := GenToken(user.UserID, Issuer, Issuer, TokenExpire)

	rtn := make(map[string]string)
	rtn["token"] = token
	rtn["userid"] = user.UserID

	httputil.Result.Success(rtn, "OK").Response(context.RequestCtx)

	Logger.Debug("%v %v %v", user.UserID, username, password)

	return nil

}

func (u *userHandler) Logout(context *routing.Context) error {
	Logger.Debug("%v", "Logout")
	httputil.Result.Success("", "OK").Response(context.RequestCtx)
	return nil
}

func (u *userHandler) Pwd(context *routing.Context) error {

	id := httputil.GetParams(context.RequestCtx, "id", "")
	user := db.GetUser(id)
	password := httputil.GetParams(context.RequestCtx, "password", "")
	password1 := httputil.GetParams(context.RequestCtx, "password1", "")
	password2 := httputil.GetParams(context.RequestCtx, "password2", "")

	if password1 != password2 {
		httputil.Result.Fail("登录用户密码不一致，请确认密码一致").Response(context.RequestCtx)
		return nil
	}

	if user.UserPassword != SaltMd5(password, user.UserID) {
		httputil.Result.Fail("登录用户名和用户密码不正确").Response(context.RequestCtx)
		return nil
	}

	if error := db.UpdatePwd(id, password1); error != nil {
		httputil.Result.Fail("登录用户密码修改本版本暂时不支持:" + error.Error()).Response(context.RequestCtx)
		Logger.Debug("%v", error)
	} else {
		httputil.Result.Success("", "OK").Response(context.RequestCtx)
	}

	return nil
}
