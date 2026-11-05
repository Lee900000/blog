# 量化机会：原前端静态快照 Demo

本版已替换最初自行绘制的简化面板。位置仍为博客 `/arbitrage/` 的个人理财介绍下方、策略阅读区上方。

## 复用与边界

直接提取 `/Volumes/AiCode/个人理财工具/web/app/index.html` 中量化机会区域、原生 SVG 绘图函数及样式，并复用 `common.js` 的 DOM/数字格式化辅助函数。原工具只读，未修改。

保留原表格 19 列、原筛选与回车搜索、排序、行展开、回本日期、六个期限收益、费用步骤表、盘口深度、滚动净年化与资金费率图、K 线合并/分开、多空比、大户多空账户数比、主动买卖量以及周期切换。

明确的演示差异：

- 使用 16 个录制样本，不声称复制原后台的完整机会清单或实时数值。
- 刷新按钮只重载本站快照；关注和开仓指令按钮禁用，相关实现已移除。
- 取消行情轮询；回本日期以录制时间为基准，不伪装为今日行情。
- 每次进入 Demo 默认使用 K 线“合并对比”，不恢复上次验收留下的“分开”状态；当前页面内仍可双向切换。
- 不复制资产、账户、仓位、成交、通知、密钥或登录信息。
- 表格在容器内滚动；独立 iframe 隔离原页面样式并跟随博客明暗主题。

## 数据来源与只读请求

来源为用户指定的本机 `127.0.0.1:8080` 查询接口。查询之前核对了源项目路由及处理代码；这些 POST 均为查询，不因方法名为 POST 就认定是写操作：

- `POST /finance/opportunities/list`
- `GET /finance/opportunities/{symbol}`
- `POST /finance/opportunities/trend`
- `POST /finance/market/liquidity`
- `POST /finance/market/depth`
- `POST /finance/market/long-short`
- `POST /finance/market/top-trader-ratio`
- `POST /finance/market/taker-volume`
- `POST /finance/market/candles`

没有调用同步任务、设置保存、关注、账户或交易写接口。来源首页仅打开查看，未操作写按钮。

`tools/quant-demo-capture.mjs` 只允许本机固定查询白名单，向标准输出生成补丁，不直接写文件。快照按原结果保存；账户/凭证类字段被剔除。演示运行时不使用此采集脚本。

浏览器中的 `adapter.js` 只是原接口协议的本地回放：真正的网络请求只有本站静态文件的 GET，且不携带凭证。没有后端代理，不会访问 8080、交易所或其他外站。内页还设置了 CSP `connect-src 'self'` 和禁止表单提交。

## 快照覆盖与真实缺失

16 个样本，包括 12 个永续和 4 个交割合约；共 80 个分组文件。覆盖五种多空统计周期、三种 K 线周期，合计 43,644 根返回的蜡烛数据。

原接口有以下缺失，保留其错误，不编造曲线：

- 两个 U 本位交割合约的流动性查询返回合约不存在，深度只返回可用盘口。
- 240 份统计响应中有 34 份原请求失败，主要在交割合约统计，切换到相应模块显示原查询缺失原因。
- 快照分时读取，列表、详情、盘口的采集时间并非同一毫秒；每个响应保留其时间信息。

因此这是原前端交互的静态回放，不是行情准确性认证或交易建议。

## 实现与验证

- 宿主挂载：`source/js/quant-opportunities.js`
- 原版视图：`source/assets/quant-demo/view.js`、`view.css`
- 本地数据适配：`source/assets/quant-demo/adapter.js`
- 快照：同目录 `catalog.json`、`snapshots/`
- Hexo 对 `assets/quant-demo/**` 原样复制，避免把内页再次套入博客布局。
- 全量 `npm test`：139 项通过；`npm run build:tago` 成功。
- 实际浏览器检查：UNI 搜索、展开、6 张图与双边盘口可显示；K 线切换到四小时、分开展示及多空统计日线后为 7 张图，无错误提示，所有私人操作按钮禁用。
- 尚未提交、推送或部署。
