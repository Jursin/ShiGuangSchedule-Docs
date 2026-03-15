---
title: 手环版
createTime: 2026/03/15 17:17:30
---

## 准备
- [AstroBox 客户端](https://astrobox.online/downloads)
  ::: tip
  如果 AstroBox 不支持你的穿戴设备，可以使用[表盘自定义工具](https://www.bandbbs.cn/threads/9797/)
  :::
- [手环端 `rpk` 文件](https://ghproxy.jursin.top/?url=https://github.com/Jursin/ShiGuang-Vela&fetchReleases=true)
- [安卓端同步器](https://ghproxy.jursin.top/?url=https://github.com/Jursin/ShiGuang-Sync&fetchReleases=true)

::: important
本手环端快应用根据[Xiaomi Vela JS 应用开发文档](https://iot.mi.com/vela/quickapp/)开发，理论上支持小米 Vela 穿戴设备
:::

## 向手环安装快应用

<div style="display: flex; align-items: center; justify-content: center; gap: 30px;">
  <p style="margin: 0;">打开 AstroBox-设备，连接设备<br/>点击安装快应用，选择 <code>rpk</code> 文件<br/>点击队列-安装队列的发送按钮，执行安装</p>
  <img src="/images/AstroBox.png" alt="AstroBox" width="40%">
</div>

## 在安卓端传递配置文件

<div style="display: flex; align-items: center; justify-content: center; gap: 30px;">
  <p style="margin: 0;">先确保小米运动健康已连接到穿戴设备<br/>打开拾光课程表同步器，会自动连接穿戴设备并打开快应用<br/>点击选择配置文件按钮选择 <code>json</code> 文件<br/>点击确认导入按钮，手环端应该会提示导入成功</p>
  <img src="/images/sync.png" alt="sync" width="40%">
</div>

## 预览图

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
  <div style="text-align: center; flex: 0 0 30%; max-width: 450px;">
    <img src="/images/band-1.png" alt="首页" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">首页</p>
  </div>
  <div style="text-align: center; flex: 0 0 30%; max-width: 450px;">
    <img src="/images/band-2.png" alt="选择周次" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">选择周次</p>
  </div>
  <div style="text-align: center; flex: 0 0 30%; max-width: 450px;">
    <img src="/images/band-3.png" alt="设置" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">设置</p>
  </div>
</div>

> 本手环版快应用由 [Jursin](https://github.com/Jursin) 开发，仅使用与拾光课程表一致的配置文件，遇到问题请在对应仓库提交 Issue。