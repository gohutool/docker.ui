package db

import (
	"database/sql"
	"github.com/gohutool/boot4go-util/db"
	_ "github.com/mattn/go-sqlite3"
)

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : _db.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/5/12 21:23
* 修改历史 : 1. [2022/5/12 21:23] 创建文件 by LongYong
*/

var dbPlus db.DBPlus

func init() {
	db1, err := sql.Open("sqlite3", "./data.db")
	if err != nil {
		panic(err)
	}
	dbPlus = db.DBPlus{DB: db1}
}

var sql_table = `CREATE TABLE if not exists "t_user" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userid" VARCHAR(64) NULL,
    "username" VARCHAR(64),
	"password" VARCHAR(128),
    "createtime" TIMESTAMP default (datetime('now', 'localtime'))
);

CREATE TABLE if not exists "t_db" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "dbid" VARCHAR(64) NULL,
    "endpoint" VARCHAR(64),
	"username" VARCHAR(64),
	"password" VARCHAR(64),
    "createtime" TIMESTAMP default (datetime('now', 'localtime'))
);

CREATE TABLE if not exists "t_repos" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "reposid" VARCHAR(64) NULL,
    "name" VARCHAR(255),
    "description" text,
    "endpoint" VARCHAR(255),
	"username" VARCHAR(255),
	"password" VARCHAR(255),
    "createtime" TIMESTAMP default (datetime('now', 'localtime'))
);

CREATE TABLE if not exists "t_orchestrator" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "orchestratorid" VARCHAR(64) NULL,
    "name" VARCHAR(64),
    "description" text,
    "json" text,
    "userid" VARCHAR(64),
    "createtime" TIMESTAMP default (datetime('now', 'localtime'))
);
`

func InitDB() {

	_, err := dbPlus.GetDB().Exec(sql_table)
	if err != nil {
		panic(err)
	}

	InitAdminUser()
}
