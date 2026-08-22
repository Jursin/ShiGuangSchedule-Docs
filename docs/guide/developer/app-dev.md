---
title: 应用开发
createTime: 2026/03/04 20:22:50
---

> 项目注重开放性和可扩展性，欢迎社区开发者参与贡献完善应用相关功能。

## 环境要求

- Android Studio
- JDK 21
- Android SDK

## 项目结构

::: warning
项目从 2.x 版本起迁移至 **Compose Multiplatform** 多平台框架，采用 KMP（Kotlin Multiplatform）架构。Gradle 包含三个模块（`androidApp`、`shared`、`desktopApp`），iOS 通过 Xcode 构建独立的 `iosApp` 项目：
:::

::: file-tree

- shiguangschedule
  - **androidApp/** # Android 平台入口
    - src/main/kotlin/com/xingheyuzhuan/shiguangschedule
      - **MainActivity.kt** — Compose 主入口，EdgeToEdge，Koin Application
      - **MyApplication.kt** — Koin Application 初始化
      - data/sync/ # Android 平台数据同步实现
      - service/ # 后台服务（课程提醒、勿扰模式）
      - widget/ # 桌面小组件
    - build.gradle.kts
  - **shared/** # 跨平台共享模块（核心业务逻辑）
    - src/commonMain/kotlin/com/xingheyuzhuan/shiguangschedule
      - **App.kt** — 共享 Compose 入口
      - **Navigation.kt** — Navigation3 导航定义
      - data/ # 数据层
        - api/ # 网络请求（节假日、WebDAV）
        - db/ # Room 数据库（MainAppDatabase）
        - di/ # Koin 依赖注入模块
        - model/ # 数据模型
        - repository/ # 数据仓库
        - sync/ # 数据同步逻辑
      - navigation/ # 导航路由定义
      - tool/ # 工具类（ICS 导出、日历账户管理、加密、Zip、更新等）
      - ui/ # UI 层
        - components/ # 通用组件（ImageCropper, ColorPicker...）
        - schedule/ # 课表页面
        - today/ # 今日课表
        - settings/ # 设置页面
        - schoolselection/ # 教务导入
        - theme/ # 主题配色
    - src/androidMain/ # Android 平台特定代码
    - src/jvmMain/ # Desktop (JVM) 平台特定代码
    - src/iosMain/ # iOS 平台特定代码
    - assets/offline_repo/ # 离线适配资源
    - schemas/ # Room 数据库 Schema 导出
    - build.gradle.kts
  - **desktopApp/** # Desktop (JVM) 平台入口
    - build.gradle.kts
  - **iosApp/** # iOS 平台入口（Xcode 项目）
    - iosApp.xcodeproj/
    - iosApp/
  - gradle/
    - **libs.versions.toml** # 版本目录（统一管理依赖版本）
    - wrapper/
  - build.gradle.kts # 根项目插件声明
  - settings.gradle.kts # 模块包含配置
  - gradle.properties

:::

## 应用入口

- `androidApp/MainActivity.kt` — Android 平台入口，EdgeToEdge，Koin Application
- `shared/commonMain/App.kt` — 共享 Compose 入口，所有平台共用的 UI 与逻辑
- `shared/commonMain/Navigation.kt` — Navigation3 导航定义
- `desktopApp/` — Desktop (JVM) 平台入口
- `iosApp/` — iOS 平台入口（通过 Xcode 构建，调用 shared 模块的 iOS Framework）

## 跨平台源集

`shared` 模块按 KMP 约定划分源集：

| 源集 | 目标平台 | 说明 |
|------|----------|------|
| `commonMain` | 全平台 | 共享业务逻辑、UI、数据层 |
| `androidMain` | Android | Android 特定实现（SQLite Framework、Ktor CIO） |
| `jvmMain` | Desktop (JVM) | Desktop 特定实现（SQLite Bundled、Ktor CIO） |
| `iosMain` | iOS | iOS 特定实现（SQLite Framework、Ktor Darwin） |

## 开发者模式

从 2.x 版本开始，项目不再区分正式版本和开发者版本。开发者功能通过在**更多**页面**点击应用图标 5 次**启用。

## 构建命令

```bash
# Android Debug
./gradlew :androidApp:assembleDebug

# Android Release
./gradlew :androidApp:assembleRelease

# Desktop (JVM) 运行
./gradlew :desktopApp:run

# Desktop (JVM) 打包
./gradlew :desktopApp:package
```

## ABI 分包

Android 构建产物按 CPU 架构分包：

- `arm64-v8a`
- `armeabi-v7a`
- `x86_64`

APK 命名格式：`shiguangschedule-v{version}-{abi}-{buildType}.apk`

## 签名文件配置

正式版发布前需在 `androidApp/build.gradle.kts` 中配置签名信息。项目当前 release 构建类型默认使用 debug 签名，发布时应替换为正式签名：

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
# 运行 shared 模块单元测试
./gradlew :shared:desktopTest

# 运行 Android 插桩测试
./gradlew :androidApp:connectedDebugAndroidTest
```

## 参与贡献

- [Fork 仓库](https://github.com/XingHeYuZhuan/shiguangschedule/fork)
- 提交 PR 到 `dev` 分支（`main` 分支已开启分支保护）
- [提交 Issue](https://github.com/XingHeYuZhuan/shiguangschedule/issues/new/choose)
