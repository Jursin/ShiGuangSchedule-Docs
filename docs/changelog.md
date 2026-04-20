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

## [v1.2.2](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.2.2) <Badge type="tip" text="2026-04-19" />

- ### ✨ 新增功能 (Features)

  - 支持在课程中添加备注信息
  - 支持自定义课表页面及课程块的文字颜色

  ### 💡 功能与体验优化 (Improvements)

  - 优化课表导入导出逻辑并支持备注字段迁移
  - 优化滚动选择器的滚动选中逻辑
  - 优化今日课表与周课表的状态显示与架构逻辑
  - 优化深色模式状态管理逻辑
  - 优化桌面小组件布局与课程显示逻辑
  - 优化课程导入逻辑，实现同名课程自动分配相同颜色
  - 新增主题设置功能并支持自定义主色调
  - 新增启动页设置
  - 优化课程冲突逻辑，更换非本周课程视觉提示 ([#71](https://github.com/XingHeYuZhuan/shiguangschedule/pull/71))
  - 优化非本周课程显示
  - 为滚动选择器添加动画效果

  ### 🚀 性能与代码改进 (Improvements)

  - 迁移导航框架至 Navigation 3 并重构页面路由机制
  - 将样式设置界面的 UI 组件提取到独立文件便于维护

## [v1.2.1](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.2.1) <Badge type="tip" text="2026-03-27" />

### ✨ 新增功能 (Features)
- 引入学校访问历史记录并优化列表索引交互
- 优化时间段管理逻辑、修复 ICS 导出日期对齐问题并改进 UI 体验
- 个性化支持文字居中对齐、边框样式自定义及样式设置交互优化
- 为课程编辑界面添加未保存更改的退出拦截提醒
- 优化仓库更新界面交互与 Git 同步日志显示
- 引入非本周课程显示功能并重构课程重叠处理逻辑
- 添加当前时间段高亮显示功能
- 优化课表界面显示并在网格左上角新增年份显示
- 引入垂直列表桌面小组件并优化现有组件渲染逻辑
- 新增穿戴设备同步兼容模式并重构通知设置界面
- 预见式返回动画
- 重构课程编辑功能，支持多课程方案管理
- 新增上课进度条提醒功能，在支持的设备引入实时课程进度通知
- 新增语言切换功能
### 🐛 Bug 修复 (Bug Fixes)
- 优化双日小组件无课状态的文本显示逻辑
- 修复英文状态下课表星期显示文本过长的问题
💡 功能与体验优化 (Improvements)
- 课程提醒增加live updatas属性，移除实时课程进度条
- 优化逻辑，周起始日设置与周末显示双向联动
- 优化 WebView 桌面模式兼容性并调整勿扰模式逻辑
- 课表页状态栏沉浸
### 🚀 性能与代码改进 (Improvements)
- 优化桌面小组件课程指示条样式
- 优化 UI 界面样式与交互体验
- 引入安全导航机制并优化界面切换动画
- 优化 Compose 导航动画逻辑并重构 AppNavigation
- 优化课程提醒与勿扰模式的闹钟管理机制
- 提取图片裁剪逻辑为通用组件
- 将应用设置从 Room 数据库迁移至 DataStore
- 引入 Hilt 依赖注入框架并优化 ViewModel 配置
- 重构 WebView 组件并优化显示
- 移除旧的语言切换逻辑，改用 Appcompat 库实现
### 🚧 其他提交 (Other Commits)
- 壁纸缩放裁剪功能

## [v1.1.13](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.13) <Badge type="tip" text="2026-02-03" />
### ✨ 新增功能 (Features)
- 新增快捷操作页面与基于日期快速删除课程功能
### 🐛 Bug 修复 (Bug Fixes)
- 修复冲突课程渲染异常问题
### 💡 功能与体验优化 (Improvements)
- 增强调课功能
- 样式页面添加网格线隐藏开关
- 优化课表页面加载逻辑，使切换课程更加平滑

## [v1.1.12](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.12) <Badge type="tip" text="2026-01-16" />
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

## [v1.1.11](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.11) <Badge type="tip" text="2025-11-10" />
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

## [v1.1.10](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.1.10) <Badge type="tip" text="2025-10-20" />

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

## [v1.0.8](https://github.com/XingHeYuZhuan/shiguangschedule/releases/tag/v1.0.8) <Badge type="tip" text="2025-10-11" />
### 🚧 其他提交 (Other Commits)
- 添加发布构建
- 关闭开发者版本仓库检查行为,添加开发者DevTools调试选项
- 更新自动构建配置
- 双版本开发,web可使用http协议
- 更新镜像仓库