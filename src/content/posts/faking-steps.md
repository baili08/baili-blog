---
title: 使用 Python 脚本一键步数作弊

published: 2025-07-25

description: '通过Python脚本实现Zeep Life步数修改，自动化提交指定步数，集成PushMe通知功能'

image: https://r2.baili.cfd/20250725.webp

tags: ["Python", "自动化","Zeep Life","request"]

category: 'Python源码'

draft: false 

lang: ''
---
## 简介

本文介绍了一个简化版的 Python 脚本，用于一次性向特定平台提交微信运动步数。此脚本移除了原版的分批提交和定时任务功能，使其更加直接和易于使用。它还集成了 [PushMe](https://push.i-i.me/) 服务，用于在任务完成后发送通知。

> **注意:**

> 1. 本脚本仅供学习和交流使用，请遵守相关平台的使用条款。

> 2. 脚本中需要的 `USERNAME` 和 `PASSWORD` 是您在 **Zeep Life** App 中注册的**账户和密码**，请确保填写正确。

## 功能特点

* **一次性提交**: 立即提交您配置的总步数。
* **状态通知**: 通过 [PushMe](https://push.i-i.me/) 服务推送成功或失败的消息。
* **简洁明了**: 代码结构清晰，易于理解和修改。
* **易于配置**: 所有用户特定信息都集中在脚本顶部的配置区域。

## 准备工作

1. **获取 PushMe Key**:


*   访问 [PushMe 主页](https://push.i-i.me/)。



*   下载并安装 PushMe Android 客户端。



*   打开 App，获取您的 `push_key` 并妥善保管。


2. **确认 Zeep Life 账户信息**:


*   确保您拥有 Zeep Life App 的登录凭证（用户名/邮箱 和 密码）。


## 脚本配置与运行

### 1. 配置脚本

下载或复制以下脚本代码到您的本地环境（例如 `simple_step_updater.py`）。打开文件，找到配置区并填入您的信息：

```python

# ========== 配置区 ==========

# 请在此处填写您的真实信息 (USERNAME 和 PASSWORD 是 Zeep Life 的账户密码)

USERNAME = "your_username_or_email" # 您在 Zeep Life 的用户名或邮箱

PASSWORD = "your_password"          # 您在 Zeep Life 的密码

TOTAL_STEPS = 10000                 # 您想要设置的总步数

PUSHME_KEY = "your_pushme_key"      # 您从 PushMe App 获取的 push_key

# ===========================

```

请务必将占位符（如 `your_username_or_email`）替换为您自己的实际信息。

### 2. 安装依赖

确保您的 Python 环境中安装了 `requests` 和 `schedule` 库。如果未安装，可以通过 pip 安装：

```bash

pip install requests

```

### 3. 运行脚本

在命令行中导航到脚本所在目录，并执行：

```bash

python simple_step_updater.py

```

脚本将立即尝试提交步数，并通过 PushMe 发送结果通知。

## 脚本代码

以下是完整的 Python 脚本：
```python
# -*- coding: utf-8 -*-
import requests
import logging
import time
import schedule
import sys

# 日志配置
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')

# ========== 配置区 ==========
# 请在此处填写您的真实信息 (USERNAME 和 PASSWORD 是 Zeep Life 的账户密码)
USERNAME = "your_username_or_email"
PASSWORD = "your_password"
TOTAL_STEPS = 10000 # 例如：10000
PUSHME_KEY = "your_pushme_key"
# ===========================

# 常量
DATU520_URL = "https://ydapi.datu520.com/"
PUSHME_URL = "https://push.i-i.me/"

def submit_steps(steps: int) -> tuple[bool, str]:
    """向 datu520 提交步数"""
    headers = {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "referer": "https://zeep.xin/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0"
    }
    data = {
        "user": USERNAME,
        "password": PASSWORD,
        "step": steps
    }

    try:
        resp = requests.post(DATU520_URL, headers=headers, data=data, timeout=10)
        if resp.status_code != 200:
            return False, f"HTTP {resp.status_code}"

        text = resp.text.strip()
        if text.lower() == "success":
            return True, "提交成功"
        return False, text or "未知错误"
    except Exception as e:
        return False, str(e)

def pushme(title: str, content: str) -> None:
    """通过 PushMe 发送通知"""
    try:
        requests.post(
            PUSHME_URL,
            data={
                "push_key": PUSHME_KEY,
                "title": title,
                "content": content,
                "type": "text"
            },
            timeout=5
        )
        logging.info("PushMe 通知已发送")
    except Exception as e:
        logging.warning(f"PushMe 通知失败：{e}")

def job():
    """执行一次步数提交任务"""
    logging.info(f"开始提交步数: {TOTAL_STEPS}")
    success, message = submit_steps(TOTAL_STEPS)

    if success:
        final_msg = f"步数更新成功！\n总步数：{TOTAL_STEPS}"
        pushme("步数更新", final_msg)
        logging.info("任务完成，程序退出。")
        sys.exit(0) # 成功后退出程序
    else:
        error_msg = f"步数提交失败: {message}"
        pushme("步数更新失败", error_msg)
        logging.error(error_msg)
        sys.exit(1) # 失败后退出程序

if __name__ == "__main__":
    logging.info("启动一次性步数更新任务")
    job() # 立即执行一次任务
```
## 示例运行日志

以下是一个脚本运行成功时的示例日志输出。

```
2025-07-25 20:55:04,521 - INFO: 启动一次性步数更新任务
2025-07-25 20:55:04,522 - INFO: 开始提交步数: 10000
2025-07-25 20:55:06,377 - INFO: PushMe 通知已发送
2025-07-25 20:55:06,378 - ERROR: 步数提交失败: {

"code": 200,

"msg": "数据提交成功",

"user": "test@qq.com",

"step": "10000
}
```
## 封面
封面为日漫《[我的青春恋爱物语果然有问题](https://zh.moegirl.org.cn/%E6%88%91%E7%9A%84%E9%9D%92%E6%98%A5%E6%81%8B%E7%88%B1%E7%89%A9%E8%AF%AD%E6%9E%9C%E7%84%B6%E6%9C%89%E9%97%AE%E9%A2%98)》中的[比企谷八幡](https://zh.moegirl.org.cn/%E6%AF%94%E4%BC%81%E8%B0%B7%E5%85%AB%E5%B9%A1)和[由比滨结衣](https://zh.moegirl.org.cn/%E7%94%B1%E6%AF%94%E6%BB%A8%E7%BB%93%E8%A1%A3)。