---
title: 使用 Cloudflare Tunnel 让本地 Mac mini 接入公网
description: 记录 Axon 本地部署方案，通过 Cloudflare Tunnel 暴露接口，并计划使用 Pages 托管前端。
cover: /assets/cloudflare-tunnel/tunnel-dashboard.jpg
date: 2026-11-22 18:00:00
updated: 2026-11-22 18:00:00
categories:
  - 操作系统
tags:
  - Cloudflare
  - macOS
  - 网络
  - 部署
permalink: archives/21b5ca28.html
---

Axon 的服务运行在本地 Mac mini 上。后续开发时，我希望把演示页面分享给外部用户，但不想把整套撮合、数据库和消息队列搬上云，也不想为了早期演示承担一套完整服务器的费用。

因此先整理了几套**本地运行、对外展示**的方案，比较公网入口、需要的网络条件和维护成本，再选择方案 A 进行尝试。这篇文章记录选型理由和实际测试过程。

## 先看考虑过的几种方案

| 方案 | 公网如何访问本地 | 适用条件与代价 |
| --- | --- | --- |
| A · Cloudflare Tunnel + Pages | 前端放 Pages，本地 `cloudflared` 主动建立隧道 | 无需公网 IP 和路由器入站端口；需要实测访问速度 |
| B · 现有云服务器 + frp | 云服务器作为入口，frp 把请求转回本地 | 可复用现有服务器；需维护服务器、证书、隧道与安全组 |
| C · 路由器端口映射 + DDNS | 域名指向家宽，由路由器把请求转到本地 | 需要可用的公网网络条件；要自行保护暴露的入口 |
| D · 国内服务器 + frp | 国内服务器作为公网入口，再通过隧道连接本地 | 需要额外服务器；线路、费用和相关要求需另行核实 |

**先选择 A**：它可以让业务继续留在 Mac mini，并通过本地发起的连接对外提供演示；前端静态资源也不必依赖本地机器。若后续实际网络测试不理想，再评估服务器入口方案。

> 当前进度：隧道曾连接本地临时页面并从公网访问成功；真实 API、前端 Pages 和 WebSocket 的完整公网链路仍待配置验证。隧道目前处于关闭状态。

## 整体是怎么连接的？

<style>
.axon-architecture { margin:24px 0; padding:24px 16px; border:1px solid #e0e7ef; border-radius:14px; background:#fff; overflow-x:auto; }
.axon-architecture svg { display:block; width:100%; min-width:760px; height:auto; }
.axon-architecture .box { fill:#f2f4f7; stroke:#dfe5eb; stroke-width:1.4; }
.axon-architecture .edge { fill:#f0f2ff; stroke:#5265ed; stroke-width:1.5; }
.axon-architecture .user { fill:#fff; }
.axon-architecture .label { font:600 14px sans-serif; fill:#202d3d; text-anchor:middle; }
.axon-architecture .sub { font:12px sans-serif; fill:#647184; text-anchor:middle; }
.axon-architecture .link { fill:none; stroke:#5265ed; stroke-width:1.8; marker-end:url(#axon-arrow); }
.axon-architecture .outbound { fill:none; stroke:#94a3b8; stroke-width:1.4; stroke-dasharray:5 4; marker-end:url(#axon-arrow-muted); }
.axon-architecture .note { font:11px sans-serif; fill:#718096; text-anchor:middle; }
</style>

<div class="axon-architecture">
<svg viewBox="0 0 1000 235" role="img" aria-labelledby="axon-title axon-desc">
<title id="axon-title">从公网到本地的访问架构</title>
<desc id="axon-desc">用户分别访问 Cloudflare Pages 页面或经过 Cloudflare Tunnel 访问本地服务；cloudflared 从本地向 Cloudflare 发起出站连接。本地网关与前端页面仍为计划配置。</desc>
<defs>
<marker id="axon-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5265ed"/></marker>
<marker id="axon-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/></marker>
</defs>
<rect class="box user" x="10" y="89" width="115" height="70" rx="11"/><text class="label" x="67" y="118">用户</text><text class="sub" x="67" y="138">App / Web</text>
<rect class="edge" x="190" y="18" width="190" height="70" rx="11"/><text class="label" x="285" y="46">Cloudflare Pages</text><text class="sub" x="285" y="66">demo.xxx.com · 静态页面（计划）</text>
<rect class="edge" x="190" y="148" width="190" height="76" rx="11"/><text class="label" x="285" y="176">Cloudflare 边缘 + Tunnel</text><text class="sub" x="285" y="195">api.xxx.com · HTTPS / WSS</text><text class="sub" x="285" y="212">公网入口</text>
<rect class="box" x="470" y="148" width="165" height="76" rx="11"/><text class="label" x="552" y="176">cloudflared</text><text class="sub" x="552" y="195">Mac mini · 本地连接器</text><text class="sub" x="552" y="212">主动建立出站连接</text>
<rect class="box" x="715" y="148" width="130" height="76" rx="11"/><text class="label" x="780" y="176">本地网关（计划）</text><text class="sub" x="780" y="198">nginx · 路径转发</text>
<rect class="box" x="900" y="148" width="90" height="76" rx="11"/><text class="label" x="945" y="176">服务</text><text class="sub" x="945" y="198">API / WS</text>
<path class="link" d="M125 110 L190 53"/><path class="link" d="M125 138 L190 186"/>
<path class="outbound" d="M470 186 L380 186"/><text class="note" x="425" y="176">出站隧道</text>
<path class="link" d="M380 205 L470 205"/><text class="note" x="425" y="220">请求转发</text>
<path class="link" d="M635 186 L715 186"/><path class="link" d="M845 186 L900 186"/>
</svg>
</div>

隧道由 Mac mini 上的 `cloudflared` **主动向 Cloudflare 发起连接**，浏览器不需要直接连接家庭网络，也不需要在路由器上开放入站端口。Mac mini 休眠、断网或隧道停止后，本地接口就无法通过这条链路访问。

| 部件 | 用途 |
| --- | --- |
| Cloudflare Pages | 存放前端构建后的静态文件 |
| Cloudflare Tunnel | 将公网域名的请求转发到本地服务 |
| cloudflared | 运行在 Mac mini 上，维持到 Cloudflare 的连接 |
| nginx | 计划按路径转发请求，避免直接暴露不需要的接口 |
| 本地服务 | 处理 API、WebSocket 和内部数据 |

## 1. 把域名接入 Cloudflare

域名不必在 Cloudflare 购买。先在 Cloudflare 添加域名，核对已有的 DNS 记录，再到域名注册商处把 NS 修改为 Cloudflare 提供的地址。

**修改前要核对现有网站、邮箱等解析记录**，否则切换 DNS 后可能影响已有服务。域名状态变为 Active 后再继续。

## 2. 创建 Tunnel

进入 Cloudflare 控制台，找到 **Networking → Tunnels**，点击“创建隧道”，选择 `cloudflared`，并给隧道起一个容易识别的名字，例如 `axon`。控制台的菜单名称可能随着界面更新变化。

首次使用 Zero Trust 时，先创建团队并选择套餐。本次选择的是 Zero Trust Free。后台可能要求填写支付信息，以实际界面为准；免费套餐也不意味着所有额外用量都免费。

![Zero Trust Free 套餐信息](/assets/cloudflare-tunnel/zero-trust-plan.jpg)

*Zero Trust Free 套餐页面。*

进入 Networking → Tunnels 后，点击右上角“创建隧道”。如果隧道列表显示“离线”，说明当前没有连接器在线，应继续安装并启动连接器。

![Cloudflare 控制台中的 Tunnels 入口](/assets/cloudflare-tunnel/tunnel-menu.jpg)

*从控制台进入 Tunnels。*

![Cloudflare Tunnel 控制台](/assets/cloudflare-tunnel/tunnel-dashboard.jpg)

*Tunnel 控制台入口。*

![隧道列表与创建隧道按钮](/assets/cloudflare-tunnel/create-tunnel.jpg)

*点击创建隧道；列表中的离线状态表示连接器尚未连接。*

接下来选择 macOS，按控制台提供的命令安装并连接 `cloudflared`。下面仅展示命令结构：

![选择 macOS 安装 cloudflared 连接器](/assets/cloudflare-tunnel/connector.jpg)

*选择 macOS，按照控制台提示安装连接器。截图已裁去凭据。*

```bash
brew install cloudflared
sudo cloudflared service install <TUNNEL_TOKEN>
```

`<TUNNEL_TOKEN>` 是连接凭据，不要放进文章、代码仓库或截图。运行后返回控制台，确认隧道连接状态；如果没有连接，先检查本地网络与服务进程。

## 3. 将域名转发到本地服务

打开隧道详情，进入“路由”，选择添加已发布的应用程序。填写子域名 `api`、选择自己的域名，并把 Service URL 指向本地服务。保存成功后，界面会提示已创建对应的 DNS 记录。

![添加已发布应用程序路由](/assets/cloudflare-tunnel/add-route.jpg)

*选择子域名并填写本地 Service URL。*

![路由添加成功及 DNS 记录](/assets/cloudflare-tunnel/route-created.jpg)

*添加成功后，Cloudflare 显示已创建 DNS 记录。*

![隧道的路由列表](/assets/cloudflare-tunnel/route-list.jpg)

*在路由列表中检查目标服务。*

第一次验证时，本地目标是 `http://localhost:8080` 的测试页面；下表是以后连接实际 API 时使用的示例：

| 配置项 | 示例 |
| --- | --- |
| 公网域名 | `api.xxx.com` |
| 服务协议 | HTTP |
| 本地地址 | `http://127.0.0.1:18080` |

这里的 `18080` 是 Axon 本地 API 当时使用的端口。**示例是直连 API，用来说明转发关系；正式使用前计划改为先经过 nginx，并只允许需要的路径。**

实际测试时，先用 8080 端口的临时页面验证过隧道，公网请求返回 HTTP 200；本地 API 的 `127.0.0.1:18080/health` 也单独返回过 200。这两次结果不能合并成“真实 API 已经从公网打通”。测试页显示 `Tunnel OK` 和“来自本机 8080 的测试页”，证明当时公网请求已经到达本地测试服务。

![公网访问本地测试页的结果](/assets/cloudflare-tunnel/test-result.jpg)

*公网访问返回的本地测试页面。*

后续连接真实 API 后，可以分别检查：

```bash
# 先检查 Mac mini 上的服务
curl -i http://127.0.0.1:18080/health

# 配置公网路由后，再检查公网地址
curl -i https://api.xxx.com/health
```

如果 nginx 只允许 `/api` 和 `/ws`，则应使用实际放行的健康检查路径。WebSocket 也需要单独建立连接验证，HTTP 200 不代表 WebSocket 已经正常。

## 4. 前端放到 Cloudflare Pages

前端构建完成后，在 **Workers & Pages** 创建 Pages 项目，可以连接 Git 仓库自动构建，也可以直接上传构建产物。创建后在项目的 **Custom domains** 中添加 `demo.xxx.com`。

本文的 Pages 部分目前还是计划：还需要部署前端、绑定域名，并检查前端 API 和 WebSocket 地址、跨域配置以及浏览器的实际访问结果。创建项目时先选好上传方式；Cloudflare 文档说明，直接上传创建的项目不能切换为 Git 集成。

## 5. 真正开放前还要做什么？

- 将 API 从临时运行改为稳定的后台服务，并确认重启后能够恢复。
- 在入口处只转发业务需要的路径，管理接口、数据库和消息队列不直接暴露公网；身份验证和权限控制仍由应用及访问策略负责。
- 用不同网络测试页面、API 和 WebSocket 的延迟与断线恢复，尤其是面向中国大陆用户时，不预设访问速度。
- 妥善保存隧道令牌；如果凭据意外公开，应及时轮换。

这次先验证了“外网能通过隧道访问本地测试页面”，下一步才是把真实业务安全地接入这条链路。

## 参考资料

- [Cloudflare Tunnel 官方文档](https://developers.cloudflare.com/tunnel/)
- [Cloudflare Tunnel 路由配置](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/)
- [Cloudflare Pages 直接上传](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Cloudflare Pages 自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)
