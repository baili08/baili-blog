---
title: "记一次对喵窝计账的逆向分析"
published: 2025-08-09
description: "本文详细记录了对安卓应用喵窝计账的逆向工程分析过程，包括使用工具定位关键代码、修改会员验证逻辑以及处理会员功能限制等技术细节，最终实现对该应用的深度定制。"
image: "https://r2.baili.cfd/0809-1_ba9aa70d.webp"
category: "Android逆向"
tags: ["Android", "逆向工程", "喵窝计账", "应用破解"]
---

## 0x1 首先打开软件


![0809-12_8df7b73a](https://r2.baili.cfd/0809-12_8df7b73a.webp)
在『计账』界面，可以看到「未订阅」三个字，因此判断存在一个方法用于判断订阅状态：若为会员则显示「xx 会员」，否则显示「未订阅」。从「未订阅」入手。

## 0x2 在 resources.arsc 中搜索

![0809-11_62bf1edb](https://r2.baili.cfd/0809-11_62bf1edb.webp)
![0809-10_ae566253](https://r2.baili.cfd/0809-10_ae566253.webp)
![0809-9_30e62fdd](https://r2.baili.cfd/0809-9_30e62fdd.webp)
![0809-8_8cda81fc](https://r2.baili.cfd/0809-8_8cda81fc.webp)

搜索「未订阅」，找到一个，长按属性复制，得到字符串 `vip_type_unsubscribed`。

## 0x3 在 Dex 编辑器++ 中搜索
![0809-6_18e29998](https://r2.baili.cfd/0809-6_18e29998.webp)

搜索 `vip_type_unsubscribed`，类型为字符串，共三条结果；凭直觉选择中间一条进入。

## 0x4 定位到方法
![0809-5_032b2cc9](https://r2.baili.cfd/0809-5_032b2cc9.webp)

定位到 `com.glgjing.pig.ui.common.VipActivity.v` 方法。Smali 难以阅读，用 AI 转成 Java，代码如下：


```java
package com.glgjing.pig.ui.common;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.view.View;
import android.widget.TextView;

import com.glgjing.pig.R;
import com.glgjing.walkr.base.BaseListActivity;
import com.glgjing.walkr.theme.ThemeRectColorView;
import com.glgjing.walkr.view.WRecyclerView;

import java.lang.ref.WeakReference;
import java.util.Arrays;

import c0.i;
import c0.k;
import i.a;
import kotlin.jvm.internal.g;
import q.e;
import x2.d;
import x6.g;
import z0.b;

public final class VipActivity extends BaseListActivity {

    public final void v() {
        // 1. 计算 54dp -> px
        int px = g.n(this, 54f);

        // 2. 刷新列表头部
        WRecyclerView.Adapter adapter = u();
        b header = new b(px, 1, 8, false, kotlin.reflect.v.b);
        adapter.k(header);

        // 3. 关闭按钮
        findViewById(R.id.button_close).setOnClickListener(new i(this, 0));

        // 4. 根据订阅状态设置 vip_type TextView
        TextView tvType = findViewById(R.id.vip_type);
        String status = a.J();
        switch (status.hashCode()) {
            case 0x639ba539:            // "sub_vip_none"
                if ("sub_vip_none".equals(status)) {
                    tvType.setText(R.string.vip_type_unsubscribed);
                }
                break;
            case 0x48c24e6c:            // "sub_vip_monthly"
                if ("sub_vip_monthly".equals(status)) {
                    tvType.setText(R.string.vip_type_monthly);
                }
                break;
            case -0x2af59460:           // "sub_vip_annual"
                if ("sub_vip_annual".equals(status)) {
                    tvType.setText(R.string.vip_type_annual);
                }
                break;
            case -0x695108b3:           // "sub_vip_permanent"
                if ("sub_vip_permanent".equals(status)) {
                    tvType.setText(R.string.vip_type_permanent);
                }
                break;
        }

        // 5. 设置 vip_bg 主题色
        ThemeRectColorView bg = findViewById(R.id.vip_bg);
        if (!"sub_vip_none".equals(status) && status.length() != 0) {
            bg.setColorMode(5);         // v0 = 0x5
        } else {
            bg.setColorMode(2);         // v1 = 0x2
        }

        // 6. 如果已订阅永久版，隐藏底部购买区
        if (!a.R()) {
            findViewById(R.id.bottom_container).setVisibility(View.GONE);
            return;
        }

        // 7. 初始化价格信息
        SharedPreferences sp = d.c;
        if (sp == null) {
            g.j("sp");
            throw null;
        }

        // 7-1. 折扣价
        ((TextView) findViewById(R.id.desc_discount))
                .setText(sp.getString("KEY_VIP_DISCOUNT_PRICE", "$11.9"));

        // 7-2. 原价并加删除线
        TextView origin = findViewById(R.id.desc_origin);
        origin.setText(sp.getString("KEY_VIP_PERMANENT_PRICE", "$14.9"));
        origin.getPaint().setFlags(Paint.STRIKE_THRU_TEXT_FLAG);

        // 7-3. 各类价格
        ((TextView) findViewById(R.id.discount_price))
                .setText(sp.getString("KEY_VIP_DISCOUNT_PRICE", "$11.9"));

        ((TextView) findViewById(R.id.yearly_price))
                .setText(sp.getString("KEY_VIP_ANNUAL_PRICE", "$9.9"));

        ((TextView) findViewById(R.id.monthly_price))
                .setText(sp.getString("KEY_VIP_MONTHLY_PRICE", "$0.99"));

        // 7-4. 订阅提示文本
        TextView tip = findViewById(R.id.subscription_tip);
        String template = getString(R.string.vip_subscription_tip);
        String monthly = sp.getString("KEY_VIP_MONTHLY_PRICE", "$0.99");
        String yearly  = sp.getString("KEY_VIP_ANNUAL_PRICE",  "$9.9");
        tip.setText(String.format(template, monthly, yearly));

        // 8. 注册监听器
        k listener = this.r;
        g.e(listener, "listener");
        e.c.add(new WeakReference<>(listener));

        // 9. 三个购买按钮
        findViewById(R.id.sub_monthly).setOnClickListener(new i(this, 1));
        findViewById(R.id.sub_yearly) .setOnClickListener(new i(this, 2));
        findViewById(R.id.sub_permanent).setOnClickListener(new i(this, 3));

        // 10. 隐私和条款链接
        findViewById(R.id.privacy_link).setOnClickListener(new i(this, 4));
        findViewById(R.id.terms_link)  .setOnClickListener(new i(this, 5));
    }
}
```

由代码可见，会员状态由 `i.a.J()` 返回的字符串决定。因此修改思路：直接让该方法返回 `"sub_vip_permanent"`（永久会员）。

## 0x5 修改 `i.a.J()`
![0809-4_d0096ec6](https://r2.baili.cfd/0809-4_d0096ec6.webp)
![0809-3_799bad5a](https://r2.baili.cfd/0809-3_799bad5a.webp)
![0809-2_156005c5](https://r2.baili.cfd/0809-2_156005c5.webp)

跳转到 `i.a.J()` 方法，清空代码，使其始终返回 `"sub_vip_permanent"`：


```txt
.method public static J()Ljava/lang/String;
    .registers 1

    const-string v0, "sub_vip_permanent"
    return-object v0
.end method
```

你以为本篇教程就这么结束了吗？当然不可能。

保存打包后发现：界面从「未订阅」变成了「永久会员」，但会员功能仍无法使用。

## 0x6 账本弹窗分析
![0809-1_f3ccdd27](https://r2.baili.cfd/0809-1_f3ccdd27.webp)

添加账本时出现文字弹窗。沿用前述步骤，对弹窗内容 `ledger_vip_tip` 进行分析，定位到 `a1.b.onClick` 方法。再用 AI 转 Java，关键代码如下：


```java
/* 这是 onClick(View v) 的 switch-case 主框架 */
public final void onClick(View view) {
    switch (this.c) {           // 0x0 ~ 0x1c 共 29 个分支
        case 0x1a:              // 导出功能
            boolean isVip = PigApp.a();   // 唯一判断点
            if (isVip) {
                Intent intent = new Intent(fragment.getContext(), VipActivity.class);
                intent.putExtra("ITEM_POSITION", 4);
                fragment.startActivity(intent);
            } else {
                showNeedVipDialog(fragment, R.string.setting_export_confirm);
            }
            break;

        case 0x15:              // 重复记账
            isVip = PigApp.a(); // 再次调用
            if (isVip && ((RepeatFragment) fragment).r > 0) {
                showNeedVipDialog(fragment, R.string.record_repeat_non_vip_tip);
            } else {
                fragment.startActivity(new Intent(fragment.getContext(), RepeatAddActivity.class));
            }
            break;

        case 0x10:              // 账本
            isVip = PigApp.a(); // 第三次调用
            if (isVip) {
                showNeedVipDialog(fragment, R.string.ledger_vip_tip);
            } else {
                fragment.startActivity(new Intent(fragment.getContext(), LedgerAddActivity.class));
            }
            break;

        /* 其余 0x11、0x12、… 等分支与会员完全无关，省略 */
    }
}
```

可定位到 `com.glgjing.pig.PigApp.a`，强制使其返回 `true`：

```txt
.method public static a()Z
    .registers 1

    const/4 v0, 0x1

    return v0
.end method
```

打包安装测试后，会员功能依旧未解锁。

## 0x7 继续逆向

对其他会员功能进行逆向分析后发现，无论如何都会回到 `a1.b.onClick` 方法。先鸽一下。
