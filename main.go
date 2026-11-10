package main

import (
	"log/slog"
	"net/http"
	"net/http/pprof"
	"os"
	"runtime"
	"runtime/debug"
	"time"
)

func main() {
	// 业务接口：这里仅模拟一次有一定计算开销的请求。
	businessMux := http.NewServeMux()
	businessMux.HandleFunc("/work", func(w http.ResponseWriter, r *http.Request) {
		var result uint64
		for i := uint64(0); i < 10_000_000; i++ {
			result += i
		}

		slog.Info("业务请求处理完成", "result", result)
		_, _ = w.Write([]byte("ok\n"))
	})

	// 诊断接口：显式注册到独立的 ServeMux，不挂到业务端口。
	debugMux := http.NewServeMux()
	debugMux.HandleFunc("/debug/pprof/", pprof.Index)
	debugMux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	debugMux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	debugMux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	debugMux.HandleFunc("/debug/pprof/trace", pprof.Trace)

	// 简单运行状态：方便快速查看 goroutine 和最近 GC 情况。
	debugMux.HandleFunc("/debug/runtime", func(w http.ResponseWriter, r *http.Request) {
		var gc debug.GCStats
		debug.ReadGCStats(&gc)

		slog.Info("读取运行时状态",
			"goroutines", runtime.NumGoroutine(),
			"gc_count", gc.NumGC,
		)
		_, _ = w.Write([]byte("运行时信息已记录到服务日志\n"))
	})

	go func() {
		server := &http.Server{
			Addr:              "127.0.0.1:6060",
			Handler:           debugMux,
			ReadHeaderTimeout: 5 * time.Second,
		}
		if err := server.ListenAndServe(); err != nil {
			slog.Error("诊断服务退出", "error", err)
		}
	}()

	server := &http.Server{
		Addr:              ":8076",
		Handler:           businessMux,
		ReadHeaderTimeout: 5 * time.Second,
	}
	if err := server.ListenAndServe(); err != nil {
		slog.Error("业务服务退出", "error", err)
		os.Exit(1)
	}
}
