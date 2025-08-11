import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import astroCompress from "astro-compress";
import { compress } from "@playform/compress";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";

// Define a custom grammar for Smali
const smaliGrammar = {
	name: "smali",
	scopeName: "source.smali",
	patterns: [
		{
			match:
				"\.(class|super|implements|field|method|end\\s+(method|class|field|annotation|subannotation|enum))\\b",
			name: "keyword.control.smali",
		},
		{
			match:
				"\\b(register|locals|param|local|prologue|epilogue|source|line|restart)\\b",
			name: "storage.type.smali",
		},
		{
			match: "\\b(v[0-9]+|p[0-9]+)\\b",
			name: "variable.parameter.smali",
		},
		{
			match:
				"\\b(\\.locals|\\.registers|\\.array-data|\\.packed-switch|\\.sparse-switch|\\.catch|\\.catchall|\\.parameter|\\.local|\\.prologue|\\.epilogue|\\.source|\\.line|\\.restart|\\.annotation|\\.subannotation|\\.enum)\\b",
			name: "keyword.other.smali",
		},
		{
			match:
				"(\\b(const|const-wide|const-string|move|move-wide|move-object|add|sub|mul|div|rem|and|or|xor|shl|shr|ushr|not|neg|check-cast|instance-of|new-instance|new-array|filled-new-array|invoke|return|goto|if|aget|aput|iget|iput|sget|sput|array-length|throw|monitor-enter|monitor-exit|cmp|cmpl|cmpg|fill-array-data|execute-inline|invoke-direct-empty|iget-quick|invoke-virtual-quick|invoke-super-quick)\\b)",
			name: "support.function.smali",
		},
		{
			match: '"[^"]*"',
			name: "string.quoted.double.smali",
		},
		{
			match: "#.*$",
			name: "comment.line.number-sign.smali",
		},
		{
			match: "\\b(true|false|null)\\b",
			name: "constant.language.smali",
		},
		{
			match: "\\b(0x[0-9a-fA-F]+|[0-9]+)\\b",
			name: "constant.numeric.smali",
		},
	],
};

	// https://astro.build/config
export default defineConfig({
	site: "https://blog.my0811.cn",
	base: "/",
	trailingSlash: "always",
	integrations: [
		astroCompress({
			css: true,
			html: true,
			js: true,
			img: {
				webp: true,
				png: {
					quality: 80,
				},
				jpeg: {
					quality: 80,
				},
			},
			svg: true,
		}),
		compress({
			css: true,
			html: true,
			js: true,
			image: true,
		}),
		tailwind({
			nesting: true,
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: ["main", "#toc"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
		}),
		icon({
			include: {
				"preprocess: vitePreprocess(),": ["*"],
				"fa6-brands": ["*"],
				"fa6-regular": ["*"],
				"fa6-solid": ["*"],
				ic: ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			langs: [smaliGrammar], // Add the custom Smali grammar
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte(),
		sitemap(),
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkGithubAdmonitionsToDirectives,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
		],
		rehypePlugins: [
			rehypeKatex,
			rehypeSlug,
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [
							{
								type: "text",
								value: "#",
							},
						],
					},
				},
			],
		],
	},
	vite: {
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	},
});
