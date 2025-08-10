// /functions/zhuanfa/[[path]].js
export async function onRequest({ request }) {
  // 1. 只接受来自 blog.my0811.cn 的请求
  const host = request.headers.get('host');
  if (host !== 'blog.my0811.cn') {
    return new Response('Forbidden', { status: 403 });
  }

  // 2. 只代理 /zhuanfa/ 及其子路径
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/zhuanfa/')) {
    return fetch(request);          // 其余静态文件
  }

  // 3. 构造目标 URL 并转发
  url.hostname = 'www.clarity.ms';
  url.pathname = url.pathname.replace(/^\/zhuanfa/, '');
  return fetch(url.toString(), request);
}
