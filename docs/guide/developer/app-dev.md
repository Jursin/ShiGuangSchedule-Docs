---
title: 应用开发
createTime: 2026/03/04 20:22:50
---

> 项目注重开放性和可扩展性，欢迎社区开发者参与贡献完善应用相关功能。

## 环境要求

- Android Studio Ladybug+
- JDK 21
- Android SDK

## 项目结构

::: file-tree

- shiguangschedule
  - app
    - src
      - **main** # 共用源码与资源
        - java
          - com.xingheyuzhuan.shiguangschedule
            - **MainActivity.kt**
            - **MyApplication.kt**
            - **Navigation.kt**
            - data/
              - api/ # 网络请求（节假日、WebDAV）
              - db/ # Room 数据库
              - model/ # 数据模型
              - repository/ # 数据仓库
              - …
            - service/ # 后台服务（课程提醒、勿扰模式）
            - tool/ # 工具类（ICS 导出、Git 更新）
            - ui/
              - components/ # 通用组件（ImageCropper, ColorPicker...）
              - schedule/ # 课表页面
              - today/ # 今日课表
              - settings/ # 设置页面
              - schoolselection/ # 教务导入
              - theme/ # 主题配色
              - …
            - widget/ # 桌面小组件
            - …
        - res/
        - assets/ # JS 适配脚本
        - proto/ # Protobuf 定义
        - …
      - **dev** # 开发版专属（红色图标）
        - res/
          - values/
            - ic_launcher_background.xml
      - **prod** # 正式版专属（蓝色图标）
        - …
    - build.gradle.kts
    - proguard-rules.pro
    - …
  - gradle/
    - **libs.versions.toml** # 版本目录
    - wrapper/
    - …
  - build.gradle.kts
  - settings.gradle.kts
  - gradle.properties
  - …

:::

## 应用入口

- `MainActivity.kt` — Compose 主入口，EdgeToEdge，Navigation3 导航
- `MyApplication.kt` — Hilt Application，WorkManager 初始化

## 核心依赖

| 库 | 用途 |
|---|------|
| Jetpack Compose + Material3 | UI 框架 |
| Navigation3 | 声明式导航 |
| Hilt | 依赖注入 |
| Room | 本地数据库 |
| DataStore | 键值存储 |
| Ktor | 网络请求（节假日 API、WebDAV） |
| Coil | 图片加载 |
| Wire | Protobuf 序列化（小组件数据） |
| JGit | Git 仓库操作（适配脚本更新） |
| aboutLibraries | 开源许可证展示 |
| WorkManager | 后台任务（课程提醒、数据同步） |

## 构建变体

项目通过 **productFlavors** 分为开发版（`dev`）和正式版（`prod`）两个变体：

| 特性 | dev | prod |
|------|-----|------|
| 包名后缀 | `.dev` | 无 |
| 版本后缀 | `-dev` | 无 |
| 应用图标 | 红色 | 蓝色 |
| 基准灯塔标签验证 | 关闭 | 开启 |
| 自定义/私有仓库 | 显示 | 隐藏 |
| DevTools 选项 | 显示 | 隐藏 |
| 地址栏切换按钮 | 显示 | 隐藏 |

```bash
# 开发版 Debug
./gradlew :app:assembleDevDebug

# 开发版 Release
./gradlew :app:assembleDevRelease

# 正式版 Debug
./gradlew :app:assembleProdDebug

# 正式版 Release
./gradlew :app:assembleProdRelease
```

## ABI 分包

构建产物按 CPU 架构分包：

- `arm64-v8a`
- `armeabi-v7a`
- `x86_64`

## 签名文件配置

正式版发布前需在 `app/build.gradle.kts` 中配置签名信息。项目当前 release 构建类型默认使用 debug 签名，发布时应替换为正式签名：

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("keystore.jks")
            storePassword = "your-store-password"
            keyAlias = "your-key-alias"
            keyPassword = "your-key-password"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

签名文件（`.jks` / `.keystore`）应妥善保管，建议：

- 不提交到版本控制系统
- 使用环境变量或 CI 密钥管理服务注入密码

## 测试

```bash
# 运行单元测试
./gradlew :app:testDevDebug

# 运行插桩测试
./gradlew :app:connectedDevDebugAndroidTest
```

## 参与贡献

- [Fork 仓库](https://github.com/XingHeYuZhuan/shiguangschedule/fork)
- 提交 PR 到 `dev` 分支（`main` 分支已开启分支保护）
- [提交 Issue](https://github.com/XingHeYuZhuan/shiguangschedule/issues/new/choose)
