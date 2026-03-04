---
title: 课表导入
createTime: 2026/03/04 20:22:12
---

## 课程文件导入
> 此方式通过 `json` 文件导入，示例 `json` 课程文件：

```json title="shiguangschedule_20XXXXXX_XXXXXX.json"
{
    "courses": [
        {
            "id": "a63cb711-f626-4ff5-98dd-55cef8d815eb",
            "name": "高等数学A",
            "teacher": "呙老师",
            "position": "东13-D-124c",
            "day": 1,
            "startSection": 1,
            "endSection": 1,
            "color": 4,
            "weeks": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16 ]
        },
        {
            "id": "034cb06c-ebc9-442c-a776-ef454d1811bf",
            "name": "线性代数",
            "teacher": "曹老师",
            "position": "东13-A-305c",
            "day": 1,
            "startSection": 2,
            "endSection": 2,
            "color": 2,
            "weeks": [1,2,3,4,5,6,7,8,9,10,11]
        }
    ],
    "timeSlots": [
        { "number": 1, "startTime": "08:00", "endTime": "08:45" },
        { "number": 2, "startTime": "10:05", "endTime": "11:40" },
        { "number": 3, "startTime": "14:00", "endTime": "15:35" },
        { "number": 4, "startTime": "16:05", "endTime": "17:40" },
        { "number": 5, "startTime": "19:00", "endTime": "20:35" },
        { "number": 6, "startTime": "20:45", "endTime": "22:20" }
    ],
    "config": {
        "semesterStartDate": "2026-03-02",
        "semesterTotalWeeks": 20,
        "defaultClassDuration": 95,
        "defaultBreakDuration": 30
    }
}
```

## 教务系统导入
> 从教务系统导入，依赖相关开发者编写脚本适配学校课程表与时间表导入，更高级的自动配置开学日期等与开发者是否适配学校可能拥有的接口有关

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
  <div style="text-align: center; flex: 0 0 45%; max-width: 450px;">
    <img src="/images/选择学校.png" alt="选择学校" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">选择学校</p>
  </div>
  <div style="text-align: center; flex: 0 0 45%; max-width: 450px;">
    <img src="/images/执行导入.png" alt="执行导入" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">执行导入</p>
  </div>
</div>

::: important
打开**课表页面**后再点击**执行导入**
:::

## WakeUp课程表分享口令导入

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
  <div style="text-align: center; flex: 0 0 45%; max-width: 450px;">
    <img src="/images/通用工具.png" alt="通用工具" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">选择学校-通用工具-通用工具与服务</p>
  </div>
  <div style="text-align: center; flex: 0 0 45%; max-width: 450px;">
    <img src="/images/WakeUp课程表分享口令导入.png" alt="WakeUp课程表分享口令导入" style="width: 100%;">
    <p style="margin-top: 10px; font-weight: bold;">执行导入-输入分享口令</p>
  </div>
</div>