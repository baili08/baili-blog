// clarity-subdir.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 1. 只代理 /zhuanfa/ 及其子路径
  if (url.pathname.startsWith('/zhuanfa/')) {
    // 把 /zhuanfa/xxx 映射到 clarity.ms/xxx
    url.hostname = 'www.clarity.ms';
    url.pathname = url.pathname.replace(/^\/zhuanfa/, '');
    return fetch(url.toString(), request);
  }

  // 2. 其余路径直接回源（走静态站）
  return fetch(request);
}
