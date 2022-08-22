package handle

import (
	prometheusfasthttp "github.com/gohutool/boot4go-prometheus/fasthttp"
	"github.com/prometheus/client_golang/prometheus"
	routing "github.com/qiangxue/fasthttp-routing"
)

/**
* golang-sample源代码，版权归锦翰科技（深圳）有限公司所有。
* <p>
* 文件名称 : prometheus.go
* 文件路径 :
* 作者 : DavidLiu
× Email: david.liu@ginghan.com
*
* 创建日期 : 2022/4/28 20:52
* 修改历史 : 1. [2022/4/28 20:52] 创建文件 by LongYong
*/

var (
	totalCounterVec = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "worker",
			Subsystem: "jobs",
			Name:      "processed_total",
			Help:      "Total number of jobs processed by the workers",
		},
		// We will want to monitor the worker ID that processed the
		// job, and the type of job that was processed
		[]string{"worker_id", "type"},
	)
	//totalCounterVec.WithLabelValues("num", "counter").Inc()
	/*
	   3 times
	   # HELP worker_jobs_processed_total Total number of jobs processed by the workers
	   # TYPE worker_jobs_processed_total counter
	   worker_jobs_processed_total{type="counter",worker_id="num"} 3
	*/

	amountGaugeVec = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Namespace:   "worker",
			Subsystem:   "jobs",
			Name:        "processed_gauge",
			ConstLabels: map[string]string{"BeanName": "Hello"},
		},
	)
	//amountGaugeVec.Set(10)
	/*
	   3 times
	   # HELP worker_jobs_processed_gauge
	   # TYPE worker_jobs_processed_gauge gauge
	   worker_jobs_processed_gauge{BeanName="Hello"} 10
	*/

	amountSummaryVec = prometheus.NewSummaryVec(
		prometheus.SummaryOpts{
			Namespace: "worker",
			Subsystem: "jobs",
			Name:      "processed_summary",
			Help:      "Total number of jobs processed by the workers",
		}, []string{"worker_id", "type"},
	)
	//amountSummaryVec.WithLabelValues("num", "counter").Observe(11)
	/*
	   3 times
	   # HELP worker_jobs_processed_summary Total number of jobs processed by the workers
	   # TYPE worker_jobs_processed_summary summary
	   worker_jobs_processed_summary_sum{type="counter",worker_id="num"} 33
	   worker_jobs_processed_summary_count{type="counter",worker_id="num"} 3
	*/
)

type prometheusHandler struct {
}

var PrometheusHandler = &prometheusHandler{}

func (u *prometheusHandler) InitRouter(router *routing.Router, routerGroup *routing.RouteGroup) {

	prometheus.MustRegister(totalCounterVec)
	prometheus.MustRegister(amountSummaryVec)
	prometheus.MustRegister(amountGaugeVec)

	router.Get("/metrics", func(context *routing.Context) error {
		prometheusfasthttp.PrometheusHandler(prometheusfasthttp.HandlerOpts{})(context.RequestCtx)
		return nil
	})
}
