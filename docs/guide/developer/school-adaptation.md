---
title: 学校教务系统适配
createTime: 2026/03/04 20:23:00
---

> 本应用支持用户通过自定义 `JavaScript` 脚本获取**任何来源**（如教务系统、API 接口等）的课程数据，并将其导入到应用中。您只需要使用我们提供的桥接 API，并将数据解析成我们定义好的结构即可。

## 适配流程

::: steps

1. **Alpha** 阶段

   - 使用 [浏览器插件测试工具](https://github.com/XingHeYuZhuan/shiguang_Tester) 开发你的第一个版本的适配代码
   - 对插件导出的 `json` 数据进行检查，确认没有问题后就可以进入下一个阶段

2. **Beta**阶段

   [详细适配指南参阅 **XingHeYuZhuan/shiguang_warehouse**](https://github.com/XingHeYuZhuan/shiguang_warehouse){.readmore}

   - [Fork 适配代码仓库](https://github.com/XingHeYuZhuan/shiguang_warehouse/fork)并建立自己的分支，建议在 `resources/GLOBAL_TOOLS/test.js` 里放置适配测试代码，应用定义这个位置作为适配占位符，用于在不更新索引的情况下测试适配代码
     ::: note
     - 本仓库带有 `lighthouse` 标签，已在应用开发者模式中关闭检查逻辑，请开发者对使用的仓库链接负责。
     - 注意提交 PR 请不要把测试的 `test.js` 也提交上去！
     :::
   - 在应用内启用开发者功能后，在`我的-更多-更新教务适配仓库`中选择**自定义仓库/私有仓库**，填写仓库 URL 和分支后点击**更新**等待完成，然后点击`教务系统导入-通用工具-适配代码测试`，输入网址并访问后点击`执行导入`来进行测试
     :::: tip
     **可通过 ADB 调试连接 Android 设备来测试：**
     ::: steps
     1. 在 Android 设备上打开`开发者选项`并启用 `USB 调试`/`无线调试`，然后连接设备

     2. 在电脑上访问：
        - Chrome: `chrome://inspect#devices`
        - Edge: `edge://inspect/#devices`
        ![已连接的设备](/images/devices-connected.png)
    
     3. 在应用内启用 DevTools 网页调试
        <img src="/images/DevTools.png" alt="DevTools 调试工具" style="width: 50%; display: block; margin: 20px auto;">
     :::
     ::::
   - 在 `index/root_index.yaml` 文件中登记
   - 在 `resources` 目录创建学校文件夹
   - 创建 `adapters.yaml` 和适配脚本
   - 完成 Beta 阶段适配验证，确认没有问题后提交 [Pull Request](https://github.com/XingHeYuZhuan/shiguang_warehouse/pulls) 到适配代码仓库等待合并

     ::: important
     - 为避免代码出现问题，`main` 分支启用分支保护，需要先合并到 `pending` 分支等待分支同步
     :::
:::

## 数据类型定义

### 整体定义

::: field @courses type="courses[]" required
课程数组
:::

::: field @timeSlots type="timeSlots[]" required
时间段数组
:::

::: field @config type="config" required
课表配置
:::

### 课程表（courses）

:::: field-group
::: field @id type="string" optional
课程唯一标识，内部参数，由程序自动生成，插件输出时建议省略
:::

::: field @name type="string" required
课程名称
:::

::: field @teacher type="string" required
教师姓名
:::

::: field @position type="string" required
上课地点
:::

::: field @day type="int" required
星期几（1-7，1 表示星期一）
:::

::: field @startSection type="int" required
开始节次。当 `isCustomTime` 为 `true` 时可忽略
:::

::: field @endSection type="int" required
结束节次。当 `isCustomTime` 为 `true` 时可忽略
:::

::: field @color type="int" optional
课程格子颜色，由程序自动生成，且依赖软件内部颜色方案配置，插件输出时建议省略
:::

::: field @weeks type="list<int>" required
上课周次数组
:::

::: field @remark type="string" optional default="null"
课程备注，字符数限制 300
:::

::: field @isCustomTime type="boolean" optional default="false"
是否使用自定义时间。为 `true` 时，`customStartTime` 和 `customEndTime` 必填，`startSection` 和 `endSection` 可忽略；为 `false` 或未提供时，`startSection` 和 `endSection` 必填
:::

::: field @customStartTime type="string" optional
自定义开始时间（格式：`HH:mm`）。`isCustomTime` 为 `true` 时必填
:::

::: field @customEndTime type="string" optional
自定义结束时间（格式：`HH:mm`）。`isCustomTime` 为 `true` 时必填
:::
::::

### 时间表（timeSlots）

:::: field-group
::: field @number type="int" required
节次编号
:::

::: field @startTime type="string" required
开始时间（格式：`HH:mm`）
:::

::: field @endTime type="string" required
结束时间（格式：`HH:mm`）
:::

::: field @alias type="string" optional
时间段别名，如"早自习"，字符数限制 5
:::
::::

### 配置（config）

:::: field-group
::: field @semesterStartDate type="string" optional
学期开始日期（格式：`YYYY-MM-DD`）
:::

::: field @semesterTotalWeeks type="int" optional default="20"
学期总周数
:::

::: field @defaultClassDuration type="int" optional default="45"
默认课程时长（单位：分钟）
:::

::: field @defaultBreakDuration type="int" optional default="10"
默认课间休息时长（单位：分钟）
:::

::: field @firstDayOfWeek type="int" optional default="1"
一周的第一天，1 代表星期一，7 代表星期日
:::
::::

::: tip
- [源代码定义位置](https://github.com/XingHeYuZhuan/shiguangschedule/blob/main/app/src/main/java/com/xingheyuzhuan/shiguangschedule/data/repository/CourseImportExport.kt)
- [测试 js 代码](https://github.com/XingHeYuZhuan/shiguang_Tester/blob/main/CourseImporterTestTool/school.js)
:::

## Android 桥接 API 详解

> 通过全局对象 **`window.AndroidBridgePromise`**（用于**异步**交互）和 **`AndroidBridge`**（用于**同步**操作）来提供 `js` 与原生功能的交互能力。

::: warning
所有涉及到用户界面交互或数据保存的调用都应该是**异步**的，使用 `window.AndroidBridgePromise` 并配合 `await` 关键字编写适配代码。
:::

### 异步交互 API (`window.AndroidBridgePromise`)

这些方法会阻塞 JS 的执行，直到用户在原生 Compose UI 上完成操作或原生逻辑执行完毕，并返回一个 Promise。

#### 显示公告弹窗：`showAlert(title, content, confirmText)`

用于向用户显示一个简单的通知，并等待用户确认。

- **参数:**
    - `title` (String): 弹窗标题。
    - `content` (String): 弹窗内容。
    - `confirmText` (String): 确认按钮的文本。
- **返回值 (Promise):**
    - `true`: 用户点击了确认按钮。
    - `false`: 用户取消或关闭了弹窗。

**示例：**

```javascript
async function promptUserToStart() {
    const confirmed = await window.AndroidBridgePromise.showAlert(
        "重要通知",
        "导入前请确保您已成功登录教务系统。",
        "好的，开始"
    );
    if (!confirmed) {
        AndroidBridge.showToast("用户取消了导入。");
        // 如果用户取消，必须立即停止后续流程
        return null;
    }
    return true;
}
```

#### 显示输入框弹窗：`showPrompt(title, tip, defaultText, validatorJsFunction)`

用于获取用户的输入（例如学年、验证码等），并支持在 JS 侧进行输入验证。

- **参数:**
    - `title` (String): 弹窗标题。
    - `tip` (String): 输入框的提示文本。
    - `defaultText` (String): 输入框的默认文本。
    - `validatorJsFunction` (String): **全局作用域**中定义的验证函数名称。
- **返回值 (Promise):**
    - 用户输入的内容 (String)。
    - `null`: 用户取消了输入。

**验证函数要求 (`validatorJsFunction`):**
该函数必须在 JS 全局作用域中定义，接受一个参数（用户输入 `input`），并根据结果返回：

- **`false`**：表示验证通过。
- **错误信息** (String)：表示验证失败，原生 UI 会显示此错误信息。

**示例：**

```javascript
// 全局验证函数示例
function validateYearInput(input) {
    if (/^[0-9]{4}$/.test(input)) {
        return false; // 验证通过
    } else {
        return "请输入四位数字的学年！"; // 验证失败
    }
}

async function getAcademicYear() {
    const yearSelection = await window.AndroidBridgePromise.showPrompt(
        "选择学年", 
        "请输入要导入课程的学年（如 2024）:",
        "2024", 
        "validateYearInput" // 传入全局函数名
    );
    // yearSelection 是用户输入的年份字符串或 null
    return yearSelection;
}
```

#### 显示单选列表弹窗：`showSingleSelection(title, itemsJsonString, defaultSelectedIndex)`

用于让用户从预设的列表中选择一个选项（例如选择学期）。

- **参数:**
    - `title` (String): 弹窗标题。
    - `itemsJsonString` (String): 选项列表的 **JSON 字符串**，例如 `["选项1", "选项2"]`。
    - `defaultSelectedIndex` (Int): 默认选中项的索引（从 0 开始），`-1` 表示不选中。
- **返回值 (Promise):**
    - 用户选择的选项索引 (Int, $\ge 0$)。
    - `null`: 用户取消了选择。

**示例：**

```javascript
async function selectSemester() {
    const semesters = ["1（第一学期）", "2（第二学期）"];
    const semesterIndex = await window.AndroidBridgePromise.showSingleSelection(
        "选择学期", 
        JSON.stringify(semesters), // 必须是 JSON 字符串
        -1 // 默认不选中
    );
    // semesterIndex 是选中的索引或 null
    return semesterIndex;
}
```

#### 提交课程数据：`saveImportedCourses(coursesJsonString)`

将解析完成的课程数据提交给应用保存。

- **参数:**
    - `coursesJsonString` (String): 包含所有课程数据的 **JSON 字符串**（需符合 1.1 节定义的结构）。
- **返回值 (Promise):**
    - `true`: 课程导入成功。
    - 抛出 Error: 导入失败。

**示例：**

```javascript
async function saveCourses(parsedCourses) {
    try {
        await window.AndroidBridgePromise.saveImportedCourses(JSON.stringify(parsedCourses));
        AndroidBridge.showToast(`成功导入 ${parsedCourses.length} 门课程！`);
        return true;
    } catch (error) {
        AndroidBridge.showToast(`保存失败: ${error.message}`);
        return false;
    }
}
```

#### 提交时间段数据：`savePresetTimeSlots(timeSlotsJsonString)`

将解析完成的预设时间段数据提交给应用保存。

- **参数:**
    - `timeSlotsJsonString` (String): 包含所有时间段数据的 **JSON 字符串**（需符合 1.2 节定义的结构）。
- **返回值 (Promise):**
    - `true`: 时间段导入成功。
    - 抛出 Error: 导入失败。

**示例：**

```javascript
async function importPresetTimeSlots() {
    const presetTimeSlots = [/* ... TimeSlotJsonModel 数组 ... */];
    try {
        await window.AndroidBridgePromise.savePresetTimeSlots(JSON.stringify(presetTimeSlots));
        AndroidBridge.showToast("预设时间段导入成功！");
        return true; // 添加返回值
    } catch (error) {
        AndroidBridge.showToast("导入时间段失败: " + error.message);
        return false; // 添加返回值
    }
}
```

#### 提交课表配置数据：`saveCourseConfig(configJsonString)`

将解析完成的课表配置数据（如学期开始日期、总周数等）提交给应用保存。

- **参数:**
    - `configJsonString` (String): 包含课表配置数据的 **JSON 字符串**（需符合 1.3 节定义的结构）。
- **返回值 (Promise):**
    - `true`: 配置导入成功。
    - 抛出 Error: 导入失败。

**示例：**

```javascript
async function saveConfig() {
    const configData = {
        semesterStartDate: "2024-09-01",
        semesterTotalWeeks: 18,
        // 假设教务系统返回的课间只有 5 分钟
        defaultBreakDuration: 5 
    };
    try {
        await window.AndroidBridgePromise.saveCourseConfig(JSON.stringify(configData));
        AndroidBridge.showToast("课表配置更新成功！");
        return true;
    } catch (error) {
        AndroidBridge.showToast("保存配置失败: " + error.message);
        return false;
    }
}
```

### 同步辅助 API (`AndroidBridge`)

这些方法是同步调用，不会阻塞 JS 流程，主要用于即时反馈或通知。

#### 显示 Toast 消息：`AndroidBridge.showToast(message)`

在 Android 底部短暂显示一条提示信息。

- **参数:** `message` (String)。

**示例：**

```javascript
AndroidBridge.showToast("正在发送请求...");
```

#### 通知任务完成：`AndroidBridge.notifyTaskCompletion()`

在整个导入流程逻辑**成功完成后**，调用此方法通知原生应用关闭 WebView 或执行收尾操作。这是一个**生命周期结束信号**。

- **参数:** 无。

**示例：**

```javascript
// 在 runImportFlow 函数的最后一步调用
AndroidBridge.notifyTaskCompletion();
```

## WebView 页面显示异常的处理

部分教务系统在应用内 WebView 中无法正常显示页面，原因是 Android System WebView 会自动在请求头中添加 `X-Requested-With` 字段（值为应用包名），一些教务系统检测到此字段后拒绝返回正常内容。

::: tip 解决方案
放弃直接从页面 HTML 提取数据的方案，改用 `Fetch API` 发送请求获取课程数据。这些网站虽显示异常，但登录 Cookie 通常是完整的，只要能找到对应的请求接口，即可通过 `Fetch API` 获取数据（JSON 或 HTML 片段）。
:::

目前已知存在此问题的教务系统及适配参考：

- **树维教务**：[东北大学秦皇岛分校](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/NEUQ)、[长江大学](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/YANGTZEU)

## 常见教务系统适配案例参考

> 以下案例的课程数据均通过 API 获取，而非解析当前页面 HTML，可更精准地获取课程数据。

| 教务系统 | 适配案例 | adapter_id |
|---------|---------|------------|
| **正方教务 v9** | [广东科技学院](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/GDUST) | `GDUST` |
| **乘方教务** | [山东石油化工学院](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/SDIPCT) | `SDIPCT` |
| **树维教务** | [天津农学院](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/TJAU) | `TJAU` |
| **超星教务** | [山西工程职业学院](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/SXGCXY) | `SXGCXY_01` |
| **URP 教务** | [天津城建大学](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/TCU) | `TCU_01` |
| **青果教务** | [宿州学院](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/AHSZU) | `AHSZU_01` |
| **金智教务** | [三峡大学](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/CTGU) | `CTGU` |
| **金智新教务** | [成都航空职业技术大学](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/CAPU) | `CAPU` |

::: warning 强智教务
强智教务系统版本差异较大，部分学校还有定制修改，暂无通用适配方案。以下案例仅作参考，不可直接套用：

- [南昌航空大学科技学院](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/STCNCHU)（数据在 `id='kbtable'` 内）
- [中国石油大学(华东)](https://github.com/XingHeYuZhuan/shiguang_warehouse/tree/main/resources/UPC)（数据在 `id='timetable'` 内）
:::

## 建议与示例

> 适配脚本的核心在于使用 async/await 来按顺序编排用户交互、网络请求和数据保存。为了实现清晰、高可读性、高可维护性的代码，我们强烈推荐使用结构化编程的方式：将复杂的业务逻辑（如弹窗、网络请求）封装成独立的可调用函数。这样，runImportFlow 函数就如同一个流程控制树，它不再包含具体的业务代码，只负责以清晰的顺序调用这些函数，并在任何关键的取消或失败点，立即终止整个流程。

下面是一个采用这种推荐模式的伪代码示例，它清晰地展示了如何编排课程导入流程：

```javascript
/**
 * 编排整个课程导入流程。
 * 在任何一步用户取消或发生错误时，都会立即退出，AndroidBridge.notifyTaskCompletion()应该只在成功后调用  
 */
async function runImportFlow() {
    AndroidBridge.showToast("课程导入流程即将开始...");

    // 1. 公告和前置检查。
    const alertConfirmed = await promptUserToStart();
    if (!alertConfirmed) {
        // 用户取消，直接退出
        return;
    }

    // 2. 获取用户输入参数。
    const academicYear = await getAcademicYear();
    if (academicYear === null) {
        AndroidBridge.showToast("导入已取消。");
        // 用户取消，直接退出
        return;
    }

    // 3. 获取学期。
    const semesterIndex = await selectSemester();
    if (semesterIndex === null) {
        AndroidBridge.showToast("导入已取消。");
        // 用户取消，直接退出
        return;
    }

    // 4. 网络请求和数据解析。
    const courses = await fetchAndParseCourses(academicYear, semesterIndex);
    if (courses === null) {
        // 请求失败或无数据，直接退出
        return;
    }

    // 5. [可选] 保存配置数据 (例如学期开始日期)
    const configSaveResult = await saveConfig(courses.config); // 假设 courses 对象中包含配置
    if (!configSaveResult) {
        // 保存配置失败，直接退出
        return;
    }

    // 6. 课程数据保存。
    const saveResult = await saveCourses(courses.courses);
    if (!saveResult) {
        // 保存课程数据失败，直接退出
        return;
    }

    // 7. [可选] 导入时间段。
    // 注意：即使时间段导入失败，通常也不阻止最终流程完成。
    await importPresetTimeSlots(); 

    // 8. 流程**完全成功**，发送结束信号。
    AndroidBridge.showToast("所有任务已完成！");
    AndroidBridge.notifyTaskCompletion();
}

// 启动导入流程
runImportFlow();
```