/**
 * 网站运行时间计算脚本
 * 用于计算和显示网站运行时间
 */

class WebsiteRuntime {
	constructor(startDate) {
		this.startDate = new Date(startDate);
		this.elementId = "runtime";
	}

	/**
	 * 格式化运行时间显示
	 * @returns {string} 格式化后的时间字符串
	 */
	formatRuntime() {
		const now = new Date();
		const diff = now - this.startDate;
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		return `⏱️${days}天`;
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

		// 每小时更新一次显示
		setInterval(() => {
			this.updateDisplay();
		}, 3600000); // 每小时更新一次（原代码中的36e5）
	}
}

// DOM就绪后初始化运行时间显示
function initRuntime() {
	// 确保只初始化一次
	if (window.runtimeInitialized) return;
	window.runtimeInitialized = true;

	// 创建运行时间实例（使用页脚中定义的建站日期）
	const runtime = new WebsiteRuntime(new Date(2025, 6, 22, 8, 0, 0));
	runtime.init();
}

// 多种方式确保脚本在移动端也能正确执行
document.addEventListener("DOMContentLoaded", initRuntime);

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initRuntime);
} else {
	// DOM已经加载完成
	initRuntime();
}

// 页面加载完成后再次尝试初始化
window.addEventListener("load", initRuntime);

// 页面显示时尝试初始化（处理移动端页面切换）
window.addEventListener("pageshow", initRuntime);

// 页面从后台切换到前台时尝试初始化
document.addEventListener("visibilitychange", () => {
	if (!document.hidden) {
		initRuntime();
	}
});
