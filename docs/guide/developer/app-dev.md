---
title: 应用开发
createTime: 2026/03/04 20:22:50
---

> 项目注重开放性和可扩展性，欢迎社区开发者参与贡献完善应用相关功能。
>
> 目前应用支持 **Android 8.0 +** 的 Android 版本，项目分为**开发版（`dev`）** 和**正式版（`prod`）**两个版本。

## 正式版和开发版主要特性和区别

1. **安全性：正式版**开启了**基准灯塔标签验证**，确保用户导入的适配脚本是安全可靠的。
2. **仓库可见性：正式版**默认**隐藏了自定义/私有仓库**，防止普通用户误用未经官方验证的脚本。
3. **版本标识：开发版**使用 `.dev` 后缀，允许其与正式版共存，便于开发者进行测试。
4. **调试工具：正式版**会禁用 **DevTools** 选项，防止普通用户**误触启用调试功能**，从而避免潜在的**信息泄露**或**配置被意外修改**的风险。
5. **应用图标：正式版**图标是**蓝色**背景，开发者版图标是**红色**背景，便于区分。

## 如何参与
- [Fork](https://github.com/XingHeYuZhuan/shiguangschedule/fork) 应用仓库，提交你的改进或教务适配使用的可调用组件。
- 提交 [Pull Request](https://github.com/XingHeYuZhuan/shiguangschedule/compare)，等待审核合并（`main` 分支已经开启分支保护，请提交到 `dev` 分支）。
- 如有问题或建议，欢迎在 GitHub 提交 [Issue](https://github.com/XingHeYuZhuan/shiguangschedule/issues/new/choose) 或加入社区讨论。