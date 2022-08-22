package test

import (
	"github.com/gorilla/websocket"
	"log"
	"net/url"
	"os"
	"os/signal"
	"testing"
	"time"
)

/**
* boot4go-docker-ui源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : client_test.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/8/10 22:37
* 修改历史 : 1. [2022/8/10 22:37] 创建文件 by LongYong
*/

func TestWSClient(t *testing.T) {
	var addr = "localhost:8999"
	//var addr = "192.168.56.102:2375"

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	//u := url.URL{Scheme: "ws", Host: addr, Path: "/v1.41/exec/60f14c195ab6ea1b115468bad9485b406aad83c974fa3a717c287d985f76a36e/start"}
	//u := url.URL{Scheme: "ws", Host: addr, Path: "/docker-api-ws/echo"}
	u := url.URL{Scheme: "ws", Host: addr, Path: "/docker-api-ws/exec"}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String()+"?id=abcdefg", nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})

	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
		}
	}()

	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			err := c.WriteMessage(websocket.TextMessage, []byte(t.String()))
			if err != nil {
				log.Println("write:", err)
				return
			}
		case <-interrupt:
			log.Println("interrupt")

			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("write close:", err)
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
