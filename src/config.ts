import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "百里博客",
	subtitle: "一个高中生的博客",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 230, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "https://t.alcy.cc/ys", // 修正：移除了末尾的空格
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "Tech otakus save the world.", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "https://r2.baili.cfd/favicon.ico", // 修正：移除了末尾的空格
			//theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			sizes: "256x256", // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		LinkPreset.Friends, // 添加友链页面链接
		LinkPreset.Bangumi, // 添加Bangumi页面链接
		{
			name: "统计",
			url: "https://cloud.umami.is/share/R6X4yAVAANX0pcH9/blog.my0811.cn", // 修正：移除了末尾的空格
			external: true, // 修正：GitHub 链接应为外部链接，设置为 true
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://r2.baili.cfd/avatar.png", // 修正：移除了末尾的空格
	name: "百里修行",
	bio: "Tech otakus save the world.",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/   for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://twitter.com", // 修正：移除了末尾的空格
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com", // 修正：移除了末尾的空格
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/baili08", // 修正：移除了末尾的空格
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/", // 修正：移除了末尾的空格
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
