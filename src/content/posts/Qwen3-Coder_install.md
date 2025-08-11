---
title: Qwen3-Coder 保姆级命令行安装与使用教程
published: 2025-07-28
description: 一篇保姆级教程，手把手教你用摩搭社区免费额度在本地命令行安装并运行 Qwen3-Coder 480B 大模型。涵盖 Node.js 环境、@qwen-code/qwen-code CLI 安装、API 令牌获取、环境变量配置，5 分钟搞定，开箱即用。
image: https://r2.baili.cfd/2025072803.webp
tags: ['Qwen3-Coder','免费API','AI编程']
category: 教程
draft: false
lang: zh

---

---

# 0. 先厘清 3 个事实
1. 官方 CLI 包名：`@qwen-code/qwen-code`。  
2. 免费调用途径：摩搭社区（ModelScope）每天提供 2000 次免费额度。  
3. 付费途径：阿里云百炼（DashScope）按量收费，无免费额度。  

下文全部围绕 “摩搭社区免费版” 展开。

---

# 1. 安装 Node.js ≥ 20

```bash
# macOS / Linux 推荐 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20        # 验证：node -v 显示 v20.x.x
```

---

# 2. 安装 CLI（二选一）

场景	命令	
零安装（用完即走）	`npx @qwen-code/qwen-code`	
全局安装（推荐长期用）	`npm i -g @qwen-code/qwen-code`	

安装后执行 `qwen --version` 能看到版本号即可。

---

# 3. 获取摩搭社区 API 令牌（免费）
1. 打开 [https://www.modelscope.cn](https://www.modelscope.cn) 并登录。  
2. 右上角头像 → 「访问令牌」 → 「创建令牌」，复制以 `ms-` 开头的字符串。  
3. 回到模型页 [Qwen3-Coder-480B-A35B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen3-Coder-480B-A35B-Instruct) 点击 「在线体验」 确认有剩余额度即可。

---

# 4. 配置环境变量（三选一）

方式	操作	
临时	终端里直接 export，关闭窗口后失效	
长期	把下面三行追加到 `~/.zshrc` 或 `~/.bashrc`，然后 `source ~/.zshrc`	
项目级	在项目根目录新建 `.env` 文件，CLI 会自动读取	

```bash
# 摩搭社区免费接口
export OPENAI_BASE_URL="https://api-inference.modelscope.cn/v1"
export OPENAI_API_KEY="ms-你的令牌"
export OPENAI_MODEL="Qwen/Qwen3-Coder-480B-A35B-Instruct"
```

---

# 5. 命令行实战

```bash
# 1. 让 AI 写个 Python 快排
qwen "写一个原地快速排序的 Python 函数，带中文注释"

# 2. 解释当前目录所有 .py 文件
qwen explain .

# 3. 进入交互模式
qwen chat
```

第一次调用会下载 <1 MB 的 tiny client，随后就能看到回复。
## 封面
封面为为《[紫罗兰永恒花园](https://zh.moegirl.org.cn/紫罗兰永恒花园)》中的[薇尔莉特·伊芙加登](https://zh.moegirl.org.cn/薇尔莉特·伊芙加登)