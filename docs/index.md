---
home: true
config:
  - type: doc-hero
    background: tint-plate
    hero:
      name: 拾光课程表
      text: 面向中国高校师生的课程表应用
      tagline: 开源·轻量·启动快·无广告
      image: /logo.png
      actions:
        - theme: brand
          text: Github 仓库
          icon: fa-brands:github
          link: https://github.com/XingHeYuZhuan/shiguangschedule
        - theme: alt
          text: 阅读文档
          icon: lucide:list-start
          link: /guide/user/schedule-import
        - theme: alt
          text: 下载
          icon: lucide:download
          link: /download

  - type: features
    features:
      - title: 今日/周次课表
        icon: mdi:calendar-today
        details: 包括今日课表、周次课表页面，应对多种场景
      - title: 多样化小组件
        icon: mdi:widgets-outline
        details: 提供多种尺寸与功能小组件，支持明日预告
      - title: 课程提醒
        icon: mdi:bell-outline
        details: 课前提醒，并可设置上课自动开启勿扰/静音模式
        link: /guide/user/course-notification
        linkText: 访问
      - title: 节假日同步
        icon: mdi:calendar-check
        details: 获取全年节假日数据，避免节假日课程打扰
        link: /guide/user/course-notification.html#节假日同步
        linkText: 访问
      - title: 快捷操作
        icon: mdi:lightning-bolt-outline
        details: 包括课程调动、快速删除课程等功能
        link: /guide/user/quickactions
        linkText: 访问
      - title: 课程导入导出
        icon: mdi:file-transfer-outline
        details: 支持 json 文件导入导出、ics 日历文件导出及从教务系统导入
      - title: 深色适配
        icon: mdi:theme-light-dark
        details: 应用与小组件均已完美适配深色模式
      - title: 课表个性化
        icon: mdi:palette-outline
        details: 自定义背景、格子样式、课程块颜色与内容
        link: /guide/user/personalized-configuration.html
        linkText: 访问
      - title: 多语言支持
        icon: mdi:language
        details: 支持简体中文、繁体中文、英语
  - type: image-text
    title: 今日课表
    description: 展示今日所有课程
    image: /images/今日课表.png
    list:
      - title: 展示今日日期、星期、周数
      - title: 展示每个时间段课程
        description: 课程开始时间大字号强调，课程卡片显示详细信息
      - title: 不同课程卡片使用不同颜色背景，便于区分
      - title: 已上课程显示删除线
  - type: text-image
    title: 周次课表
    description: 展示本周所有课程
    image: /images/周次课表.png
    list:
      - title: 一周课程总览，当前日高亮标识
        description: 多彩课程块按时间段和日期分布，直观展示整周教学安排
      - title: 左右滑动切换周次
        description: 点击顶部周次标题弹出底部选择器，快速跳转至指定周并标记当前所在周
      - title: 支持长按调整课程块位置或高度
        description: 拖拽移动课程至新时间/日期，或拉伸改变课程节数，浮动模式批量调整
      - title: 已上课程与当前时间指示线辅助查看
      - title: 支持自定义背景壁纸样式
        description: 从相册选取图片，内置裁剪工具适配屏幕比例，打造专属课表界面
  - type: image-text
    title: 我的
    description: 展示所有设置项
    image: /images/我的.png
    list:
      - title: 学期基础配置
        description: 开学日期、学期总周数、每周起始日、手动调整当前周、显示周末/非本周课程等
      - title: 高级功能入口
        description: 管理多课表创建与切换、全局课程增删改、JSON/ICS 导入导出、教务系统/星链分享码导入、自定义时间段等
      - title: 课程提醒与自动化
        description: 课前通知提醒，支持上课自动开启勿扰/静音模式，同步全年节假日数据避免假期打扰
      - title: 个性化配置
        description: 界面显示、网格尺寸、课程块配置、颜色方案等
      - title: 同步
        description: 同步到系统日历，WebDAV 云同步、本地 ZIP 文件备份等
  - type: text-image
    title: 个性化配置
    description: 设置个性化配置
    image: /images/个性化配置.png
    list:
      - title: 自定义课表背景壁纸
        description: 从相册选取图片，内置裁剪工具支持缩放和拖动，自动适配屏幕比例
      - title: 支持 24 小时时间轴模式
        description: 切换为连续时间轴布局，更贴近真实时间流逝，适合全天课程排布
      - title: 控制网格尺寸
        description: 调整格子高度、侧边栏宽度、顶部表头高度
      - title: 自定义课程块样式
        description: 支持设置文字颜色、文字水平/垂直居中、文字缩放比例、自定义信息显示、课程块圆角/间距/不透明度、边框样式（无/实线/虚线）等
      - title: 浅色/深色模式独立颜色池
        description: 多组预设颜色搭配高级 HSV 颜色选择器，课程块颜色随模式自动切换
  - type: image-text
    title: 小部件
    description: 支持多种小部件
    image: /images/小部件.png
    list:
      - title: 提供多种尺寸与样式的小组件
        description: 紧凑型、列表竖直型、双日型、微小组件（2×1），适配桌面不同位置需求
      - title: 支持明日课程预告
        description: 今日课程结束后自动切换显示明日课程预览
      - title: 课程颜色与主应用自动同步
        description: 小部件课程卡片颜色与 App 内配色方案保持一致
      - title: 完美适配深色模式
        description: 跟随系统颜色模式自动切换
---
