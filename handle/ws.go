package handle

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/fasthttp/websocket"
	. "github.com/gohutool/boot4go-docker-ui/log"
	. "github.com/gohutool/boot4go-docker-ui/model"
	util4go "github.com/gohutool/boot4go-util"
	fasthttputil "github.com/gohutool/boot4go-util/http"
	routing "github.com/qiangxue/fasthttp-routing"
	"github.com/valyala/fasthttp"
	"net"
	"net/http"
	"net/http/httputil"
	"strings"
	"time"
)

var upgrader = fasthttputil.Upgrader{
	// cross origin domain
	CheckOrigin: func(ctx *fasthttp.RequestCtx) bool { //这个是解决跨域问题
		return true
	},
	Subprotocols: []string{"Sec-WebSocket-Protocol"},
	//将获取的参数放进这个数组，问题解决
}

var echoHandler = fasthttputil.EchoWSRequestHandler{
	Upgrader: upgrader,
}

func InitWsRouter(router *routing.Router, routerGroup *routing.RouteGroup) {
	routerGroup.Any("/echo", EchoWSHandler)
	routerGroup.Any("/exec", ExecWSHandler)
}

func EchoWSHandler(ctx *routing.Context) error {
	return echoHandler.Handle(ctx.RequestCtx)
}

func getRequestInfo4WS(context string, ctx *routing.Context) (rtn RequestInfo, err error) {

	path := string(ctx.Path())

	uris := strings.Split(path, context+"/")

	if len(uris) <= 1 {
		err = errors.New(path + " is not good")
		return
	}

	arr := strings.Split(string(ctx.Request.Header.Peek("Sec-WebSocket-Protocol")), ",")

	if len(arr) != 3 {
		err = errors.New(string(ctx.Request.Header.Peek("Sec-WebSocket-Protocol")) + " is not good")
		return
	}

	if len(strings.TrimSpace(arr[0])) == 0 {
		err = errors.New("not set endpoint in request header, you must set endpoint in your request header")
		return
	}

	version := strings.TrimSpace(arr[2])

	if len(version) == 0 {
		version = "v1.32"
	}

	if strings.Index(version, "v1.") != 0 {
		err = errors.New("endpoint_version is not right, please check it in request header")
		return
	}

	rtn.Host = strings.TrimSpace(arr[0]) + ":" + strings.TrimSpace(arr[1])
	rtn.Api = uris[1]
	rtn.Version = version
	rtn.Path = "/" + version + "/" + uris[1]

	return
}

func ExecWSHandler(ctx *routing.Context) error {
	execId := string(ctx.FormValue("id"))

	if util4go.IsEmpty(execId) {
		fasthttputil.Result.Fail("没有设置需要执行的ID").Response(ctx.RequestCtx)
		return nil
	}

	ri, err := getRequestInfo4WS("/docker-api-ws", ctx)
	if err != nil {
		return err
	}

	err = upgrader.Upgrade(ctx.RequestCtx, func(ws *websocket.Conn) {
		defer ws.Close()
		ctx.Request.Header.Del("Origin")
		hijackExecStartOperation(ws, ri.Host, execId, ri.Version)
	})

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); ok {
			Logger.Info(err)
		}
		return err
	}

	ctx.Response.Header.Set("Sec-WebSocket-Protocol", ri.Version)

	return nil
}

func createExecStartRequest(execID string, version string) (*http.Request, error) {
	params := make(map[string]any)
	params["Tty"] = true
	params["Detach"] = false

	encodedBody := bytes.NewBuffer(nil)
	err := json.NewEncoder(encodedBody).Encode(params)
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequest("POST", "/"+version+"/exec/"+execID+"/start", encodedBody)
	if err != nil {
		return nil, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Connection", "Upgrade")
	request.Header.Set("Upgrade", "tcp")

	return request, nil
}

func hijackExecStartOperation(websocketConn *websocket.Conn, endpoint string, execID string, version string) error {
	if strings.Index(endpoint, "unix") == 0 || strings.Index(endpoint, "UNIX") == 0 {
		endpoint = "unix:///var/run/docker.sock"
	}

	dial, err := fasthttputil.InitClientDial(endpoint)

	if err != nil {
		return err
	}

	if tcpConn, ok := dial.(*net.TCPConn); ok {
		tcpConn.SetKeepAlive(true)
		tcpConn.SetKeepAlivePeriod(30 * time.Second)
	}

	httpConn := httputil.NewClientConn(dial, nil)
	defer httpConn.Close()

	execStartRequest, err := createExecStartRequest(execID, version)
	if err != nil {
		return err
	}

	err = fasthttputil.HijackClientRequest(websocketConn, httpConn, execStartRequest)
	if err != nil {
		return err
	}

	return nil
}
