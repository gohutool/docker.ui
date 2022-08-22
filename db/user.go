package db

import (
	"github.com/gohutool/boot4go-docker-ui/model"
	. "github.com/gohutool/boot4go-util"
	"time"
)

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : user.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/5/12 21:27
* 修改历史 : 1. [2022/5/12 21:27] 创建文件 by LongYong
*/

const (
	INSERT_USER           = `insert into t_user (userid, username, password, createtime) values(?,?,?,?)`
	SELECT_USER_BY_NAME   = `select * from t_user where userid=?`
	UPDATE_PWD_USER_BY_ID = `update t_user set password=? where userid=?`

	INSERT_REPOS       = `insert into t_repos (reposid, name, description, endpoint, username, password, createtime) values(?, ?,?,?,?,?,?)`
	SELECT_REPOS       = `select * from t_repos where reposid=?`
	SELECT_ALL_REPOS   = `select * from t_repos where 1=1 `
	UPDATE_REPOS_BY_ID = `update t_repos set password=?, username=?, endpoint=?, name=?, description=? where reposid=?`
)

func InitAdminUser() {
	c, err := dbPlus.QueryCount("select count(1) from t_user where username=?", "ginghan")
	if err != nil {
		panic(err)
	}

	if c == 0 {
		err = CreateUser("ginghan", "123456")

		if err != nil {
			panic(err)
		}
	}
}

func CreateUser(username, password string) error {
	userId := MD5(username)
	password = SaltMd5(password, userId)

	createtime := time.Now()

	_, _, err := dbPlus.Exec(INSERT_USER, userId, username, password, createtime)

	//stm, err := _db.Prepare(INSERT_USER)

	//stm.Exec(userId, username, password, createtime)

	//stm.Close()

	return err
}

func UpdatePwd(userid, passwd string) error {
	passwd = SaltMd5(passwd, userid)
	_, _, err := dbPlus.Exec(UPDATE_PWD_USER_BY_ID, userid, passwd)
	return err
}

func GetUser(userid string) *model.User {
	user, err := dbPlus.QueryOne(SELECT_USER_BY_NAME, userid)

	if err != nil || user == nil {
		return nil
	}

	rtn := &model.User{
		UserName:     GetMapValue2(user, "username", ""),
		UserID:       GetMapValue2(user, "userid", ""),
		UserPassword: GetMapValue2(user, "password", ""),

		//	CreateTime: *GetITime(GetMapValue2(user, "createtime", ""), "yyyy", nil),
	}
	//2022-05-13 13:54:40.5049073+08:00

	return rtn
}
