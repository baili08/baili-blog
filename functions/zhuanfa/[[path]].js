// 强制用 GET，避免 405
export async function onRequest({ request }) {
	const host = request.headers.get("host");
	if (host !== "blog.my0811.cn")
		return new Response("Forbidden", { status: 403 });

	const url = new URL(request.url);
	if (!url.pathname.startsWith("/zhuanfa/")) return fetch(request);

	url.hostname = "www.clarity.ms";
	url.pathname = url.pathname.replace(/^\/zhuanfa/, "");

	// 强制 GET，防止 HEAD 405
	const newReq = new Request(url, { method: "GET" });
	return fetch(newReq);
}
