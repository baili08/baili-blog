---
title: 给你的Fuwari博客接入bangumi追番列表
published: 2025-07-28
description: 想在你的 Fuwari 主题 Astro 博客中展示 Bangumi 追番记录？本教程手把手教你从获取 API 权限、创建页面、添加导航到部署上线，完整实现一个支持暗色模式、响应式布局与进度条显示的 Bangumi 追番列表页面，让你的二次元生活优雅地融入个人博客。
image: https://r2.baili.cfd/20250728.png
tags: ["Fuwari博客", "Bangumi", "追番页面", "Astro教程"]
category: 教程
draft: false
lang: zh

---

第一步：先看看最终效果

在开始之前，请先看看你将要实现的页面长什么样：

![预览图](https://r2.baili.cfd/20250728-bangumi.webp)

- 自动从 Bangumi 获取你的追番数据  
- 支持「在看 / 想看 / 看完」三类分类  
- 失败容错：网络错误提示 + 图片加载失败兜底  
- 完全集成到 Fuwari 主题风格中  

目标页面路径：[https://blog.my0811.cn/bangumi](https://blog.my0811.cn/bangumi)

---

第二步：你需要准备什么？

在动手前，请确保你已完成以下准备工作。

准备清单

| 项目 | 是否必须 | 获取方式 |
|------|----------|----------|
| 1. 一个运行中的 Fuwari 博客 | 必须 | GitHub 仓库 + `npm run dev` |
| 2. Bangumi 账号 | 必须 | [注册地址](https://bgm.tv/signup) |
| 3. Bangumi 用户 UID | 必须 | 登录就能得到 |
| 4. Bangumi Bearer Token | 必须 | 官方一键生成 |
| 5. 文本编辑器 | 必须 | VS Code / Vim / WebStorm 等 |
| 6. `default-image.png`（可选） | 建议 | 用于图片加载失败时兜底 |	

---

第三步：如何获取 Bangumi 所需信息？

1. 获取你的 UID（用户 ID）

1. 登录 [Bangumi 官网](https://bgm.tv)
2. 那一串数字就是用户ID

   记下来，稍后要用。

---

2. 获取 Bearer Token（访问令牌）

官方一键生成  
- 打开：[https://next.bgm.tv/demo/access-token](https://next.bgm.tv/demo/access-token)  
- 登录 Bangumi → 点击「创建个人令牌」→ 输入「名称」和「有效期」点击submit→复制即可
  
  安全提醒：此 token 可读取你的私有收藏，请勿公开分享或提交到 GitHub！

---

第四步：开始搭建 Bangumi 页面

现在我们正式开始创建页面。

1. 创建页面文件

进入你的博客项目根目录，创建以下文件：

```
src/pages/bangumi.astro
```

> Astro 会自动将此文件映射为 `/bangumi` 路由。

---

2. 在导航栏添加链接

打开配置文件：

```
src/config.ts
```

找到 `navLinks` 数组，在适当位置添加新项：

```ts
export const navLinks = [
  { title: '首页', href: '/' },
  { title: '文章', href: '/posts' },
  { title: '标签', href: '/tags' },
  { title: '关于', href: '/about' },
  { title: '追番', href: '/bangumi' },
];
```

保存后，启动本地服务器即可在导航栏看到"追番"菜单。

---

3. 粘贴页面代码（请替换 UID 和 Token）

将以下完整代码粘贴进 `bangumi.astro`，注意替换 `YOUR_BANGUMI_UID` 和 `YOUR_BEARER_TOKEN`：

```astro
---
// src/pages/bangumi.astro

// 请替换为你自己的信息
const uid = "YOUR_BANGUMI_UID";        // 替换为你的数字 ID
const token = 'YOUR_BEARER_TOKEN';     // 替换为你的 access_token
const base = 'https://api.bgm.tv/v0';

// --- 类型定义 ---
type Cat = 'watching' | 'wish' | 'collect';
type CatNum = 3 | 1 | 2;

interface Image {
  large?: string;
  common?: string;
  medium?: string;
  small?: string;
  grid?: string;
}

interface Subject {
  id: number;
  type: number;
  name: string;
  name_cn: string;
  eps?: number;
  images?: Image;
}

interface CollectionItem {
  subject_id: number;
  subject: Subject;
  ep_status: number;
  type: CatNum;
}

interface CollectionResponse {
  data: CollectionItem[];
  limit: number;
  offset: number;
  total: number;
}

const cats = [
  { key: 'watching', name: '在看', type: 3 },
  { key: 'wish',     name: '想看', type: 1 },
  { key: 'collect',  name: '看完', type: 2 },
];

// --- 数据获取 ---
async function fetchOnce(type: CatNum): Promise<CollectionItem[]> {
  try {
    const res = await fetch(
      `${base}/users/${uid}/collections?subject_type=2&type=${type}&limit=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      console.error(`API Error (${type}):`, res.status, await res.text());
      return [];
    }

    const json: CollectionResponse = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

let allDataFetched = true;
const data: Record<Cat, CollectionItem[]> = { watching: [], wish: [], collect: [] };

try {
  const results = await Promise.all(cats.map(({ type }) => fetchOnce(type)));
  cats.forEach(({ key }, i) => { data[key] = results[i]; });
} catch (err) {
  console.error("Fetch failed:", err);
  allDataFetched = false;
}

import MainGridLayout from "../layouts/MainGridLayout.astro";
---

<MainGridLayout title="Bangumi 追番" description="我的动画收藏列表" class="bangumi-page">
  <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32 shadow-sm">
    <div class="card-base z-10 px-4 sm:px-6 py-6 relative w-full">
      <h1 class="text-2xl font-bold mb-6 dark:text-white">我的 Bangumi 追番</h1>

      {allDataFetched ? (
        <>
          <!-- 标签页 -->
          <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6" role="tablist" id="bangumi-tabs">
            {cats.map(({ key, name }, i) => (
              <button
                id={`tab-${key}`}
                class={`tab-button px-4 py-2 font-medium text-sm transition-colors ${
                  i === 0
                    ? 'border-b-2 border-primary text-primary dark:text-[var(--primary)]'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                data-target={key}
                role="tab"
                aria-selected={i === 0}
              >
                {name}（{data[key].length}）
              </button>
            ))}
          </div>

          <!-- 内容区 -->
          <div class="mt-4 bangumi-content-container">
            {cats.map(({ key, name }, i) => (
              <section
                id={key}
                role="tabpanel"
                class={`bangumi-section ${i !== 0 ? 'hidden' : ''}`}
                aria-hidden={i !== 0}
              >
                {data[key].length ? (
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {data[key].map(item => {
                      const s = item.subject;
                      const total = s.eps || 0;
                      const watched = item.ep_status || 0;
                      const percent = total ? Math.min(100, Math.round((watched / total) * 100)) : 0;
                      const img = s.images?.large || s.images?.common || '/default-image.png';

                      return (
                        <div class="card-base overflow-hidden hover:shadow-lg transition-transform hover:scale-[1.02] dark:bg-[var(--card-bg)]">
                          <div class="aspect-[3/4] overflow-hidden">
                            <img
                              src={img}
                              alt={s.name_cn || s.name || '未知'}
                              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              data-src-fallback="/default-image.png"
                            />
                          </div>
                          <div class="p-3">
                            <h2 class="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] dark:text-white">
                              {s.name_cn || s.name}
                            </h2>
                            <div class="text-xs">
                              <div class="flex justify-between mb-1">
                                <span class="text-gray-600 dark:text-gray-300">{watched}/{total}</span>
                                <span class="text-gray-600 dark:text-gray-300">{percent}%</span>
                              </div>
                              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div
                                  class="h-1.5 rounded-full transition-all duration-300"
                                  style={`width: ${percent}%; background-color: var(--primary)`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                    暂无 {name} 的记录
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      ) : (
        <div class="text-center py-12 text-red-500 dark:text-red-400">
          数据加载失败，请检查网络或稍后重试。
        </div>
      )}
    </div>
  </div>
</MainGridLayout>

<!-- 客户端交互 -->
<script is:inline>
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('#bangumi-tabs .tab-button');
    const sections = document.querySelectorAll('.bangumi-section');

    function switchTab(tab) {
      tabs.forEach(t => {
        const selected = t === tab;
        t.classList.toggle('border-b-2', selected);
        t.classList.toggle('border-primary', selected);
        t.classList.toggle('text-primary', selected);
        t.classList.toggle('dark:text-[var(--primary)]', selected);
        t.setAttribute('aria-selected', selected);
      });
      sections.forEach(sec => {
        sec.classList.toggle('hidden', sec.id !== tab.dataset.target);
        sec.setAttribute('aria-hidden', sec.id !== tab.dataset.target);
      });
    }

    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab)));

    // 图片错误处理
    document.querySelectorAll('img[data-src-fallback]').forEach(img => {
      img.addEventListener('error', function () {
        if (this.src !== this.dataset.srcFallback) {
          this.src = this.dataset.srcFallback;
          this.alt = '图片加载失败';
        }
      });
    });
  });
</script>

<!-- 全局样式 -->
<style is:global>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
```

第五步：本地验证
1. 启动开发服务器  
```bash
   npm run dev
   ```
2. 浏览器访问  
```
   http://localhost:4321/bangumi
   ```
3. 逐项检查  
   - 导航栏出现「追番」  
   - 三个分类（在看 / 想看 / 看完）正常切换  
   - 卡片封面、进度条、集数比例显示正确  
   - 网络断开时能看到失败提示  
   - 暗色模式自动跟随系统  



---

第六步：打包与部署

```bash
npm run build
npm run preview   # 本地预览生产版本
```


确认无报错后，推送至 GitHub，你的持续集成（Vercel / Netlify / Cloudflare Pages）会自动部署。若平台支持环境变量，把 `BANGUMI_TOKEN` 加入即可。

---


**封面**
图为《[约会大作战](https://zh.moegirl.org.cn/约会大作战)》中的[时崎狂三](https://zh.moegirl.org.cn/时崎狂三)