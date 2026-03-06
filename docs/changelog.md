---
title: 更新日志
readingTime: false
lastUpdated: false
contributors: false
changelog: false
editLink: false
aside: false
externalLinkIcon: false
---

## [v1.1.13](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.13)
### ✨ 新增功能 (Features)
- 新增快捷操作页面与基于日期快速删除课程功能
### 🐛 Bug 修复 (Bug Fixes)
- 修复冲突课程渲染异常问题
### 💡 功能与体验优化 (Improvements)
- 增强调课功能
- 样式页面添加网格线隐藏开关
- 优化课表页面加载逻辑，使切换课程更加平滑

## [v1.1.12](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.12)
### ✨ 新增功能 (Features)
- 重构小组件底层支持课程颜色同步,今日课程支持课程颜色同步
- 个性化定制你的课表页面,新增个性化配置编辑页面
- 新增课程管理页面,支持全局管理,具有课程灵活的添加和删除模式
- 新增软件检查更新支持
- 增加课程自定义时间的选项
### 🐛 Bug 修复 (Bug Fixes)
- 修复部分小组件对于假期状态的不显示问题
### 💡 功能与体验优化 (Improvements)
- 重构小组件底层实现,进一步缩小软件包体积
- 优化自定义课程的显示逻辑以及编辑自定义课程时间的输入优化
### 🚀 性能与代码改进 (Improvements)
- 重构课表底层为"真日历"模式，实现无限滚动和数据加载优化

## [v1.1.11](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.11)
### ✨ 新增功能 (Features)
- 添加英语和繁体中文的翻译
- 添加多语言支持依赖与模板
- 教务导入新增课表配置调用js函数
- 新增上课自动开启勿扰功能选项
- 新增每周起始日选项,更多设置项可以随课表切换
### 💡 功能与体验优化 (Improvements)
- 更改课程块颜色支持,更加适配深浅ui模式的颜色风格
- 小部件字符文本添加超出省略效果
- 小组件添加明日课程预告
- 文件导入导出优化,教务导入逻辑优化
- 为小部件添加自适应效果以适配更多屏幕

## [v1.1.10](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.10)

::: warning 重要提示
**教务适配数据结构重构，如果是旧版本通过安装包升级需要在`我的-更多-更新教务适配仓库`更新新的适配数据**
**！旧版本已经不可以使用更新教务适配仓库选项了，因为更新的数据无法解析。**
:::

### ✨ 新增功能 (Features)
- 添加新风格近日课程组件,新风格小组件深色适配
- 重构小组件样式
### 🐛 Bug 修复 (Bug Fixes)
- 修复导入完成后无法自动跳转到周课表页面的问题
### 💡 功能与体验优化 (Improvements)
- 更改底部导航栏视觉效果
- 优化小组件显示效果
- 调整微小部件样式
- 优化电脑模式显示效果
### 🚀 性能与代码改进 (Improvements)
- 调整导入按钮的位置
- ui改进
### 📚 文档更新 (Documentation)
- 在README.md中添加关于项目版本的说明
### 🚧 其他提交 (Other Commits)
- improve：新增ITDONG镜像库(三网优化)
- ci :修复问题

## [v1.0.8](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.0.8)
### 🚧 其他提交 (Other Commits)
- 添加发布构建
- 关闭开发者版本仓库检查行为,添加开发者DevTools调试选项
- 更新自动构建配置
- 双版本开发,web可使用http协议
- 更新镜像仓库