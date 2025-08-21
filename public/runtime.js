/**
 * 网站运行时间计算脚本
 * 用于计算和显示网站运行时间
 */

// 确保脚本只执行一次
if (window.WebsiteRuntimeInitialized) {
    // 已经初始化过，直接返回
    throw new Error('WebsiteRuntime already initialized');
}
window.WebsiteRuntimeInitialized = true;

// 定义WebsiteRuntime类
class WebsiteRuntime {
    constructor(startDate) {
        this.startDate = new Date(startDate);
        this.elementId = "runtime";
    }

    /**
     * 格式化运行时间显示，精确到秒
     * @returns {string} 格式化后的时间字符串
     */
    formatRuntime() {
        const now = new Date();
        const diff = now - this.startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `⏱️运行${days}天${hours}时${minutes}分${seconds}秒`;
    }

    /**
     * 更新运行时间显示
     */
    updateDisplay() {
        const element = document.getElementById(this.elementId);
        if (element) {
            element.textContent = this.formatRuntime();
        }
    }

    /**
     * 初始化运行时间显示
     */
    init() {
        // 立即更新一次显示
        this.updateDisplay();

        // 每秒更新一次显示，使时间更精确
        setInterval(() => {
            this.updateDisplay();
        }, 1000); // 每秒更新一次
    }
}

// 创建运行时间实例（使用页脚中定义的建站日期）
function initRuntime() {
    // 确保只初始化一次
    if (window.runtimeInitialized) return;
    window.runtimeInitialized = true;
    
    // 创建运行时间实例
    try {
        const runtime = new WebsiteRuntime(new Date(2025, 6, 22, 8, 0, 0));
        runtime.init();
    } catch (e) {
        console.error('Failed to initialize runtime:', e);
    }
}

// 多种方式确保脚本在移动端也能正确执行
document.addEventListener("DOMContentLoaded", initRuntime);
window.addEventListener("load", initRuntime);
window.addEventListener("pageshow", initRuntime);

// 页面从后台切换到前台时尝试初始化
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        initRuntime();
    }
});

// 针对移动端的特殊处理，增加延迟执行机制
setTimeout(initRuntime, 100);
setTimeout(initRuntime, 500);
setTimeout(initRuntime, 1000);
setTimeout(initRuntime, 3000);

// 最终保障，在1分钟后再次尝试初始化
setTimeout(initRuntime, 60000);

// 针对iOS设备的特殊处理
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    setTimeout(initRuntime, 5000);
}