---
title: 应用内无法正常显示页面的教务系统如何适配
createTime: 2026/03/11 16:28:05
tags:
    - 教务适配
---

> 某些教务系统在应用内访问时只会渲染出仅含少许文字的空白页面，无法通过 HTML 获取数据

<!-- more -->

主要原因是 Android System WebView 在请求头中自动添加了 `X-Requested-With` 字段，其值通常为应用的包名。一些教务系统网站会检测到这个字段，如果存在则不会返回正常的网页内容，从而导致显示异常。

我们曾尝试让 WebView 不再添加 `X-Requested-With` 字段，但未能成功。Google 曾短暂计划在 Android System WebView 中移除此字段，但目前已取消该计划，系统仍会在所有请求中发送此标头。因此，相关的白名单 API 也已弃用。

> 参考文档：[Android Developers - Webkit 1.15.2 版本说明](https://developer.android.google.cn/jetpack/androidx/releases/webkit?hl=zh-cn#version_115_2)
>
> *思考：为什么 Google 自家的 Chrome Android 浏览器不会添加 `X-Requested-With` 字段？*

## 如何适配显示异常的教务系统？

对于这类无法正常显示页面的教务系统，建议开发者**放弃**直接从当前页面获取 HTML 源码来提取课程信息的适配方案。

正确的做法是使用 `Fetch API` 发送请求来获取课程数据。为什么 `Fetch API` 可以？因为这些网站只是页面显示不正常，但其登录 `Cookie` 通常是完整的。只要能找到对应的请求接口，就可以通过 `Fetch API` 获取课程数据（无论是 `JSON` 格式还是 `HTML` 片段），进而完成适配开发。

## 目前已知存在显示异常的教务系统及适配参考：
- **树维教务**：可以参考[长江大学](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/YANGTZEU)的树维教务适配代码完成开发。