'use strict';
const repo = 'elarazju/elarazju.github.io';
const prompt = '请把当天的 AI 日报生成独立 HTML，发布到 elarazju/elarazju.github.io 仓库 main 分支的 pages/YYYY-MM-DD.html，日期按 Asia/Shanghai 时区确定。样式尽量内嵌，保留新闻来源链接。只使用核实的内容。保留首页和历史日报。同日重发时更新当天文件，调用 GitHub Contents API 更新需提供现有文件 SHA。提交后检查 Pages 部署成功，返回公开网址。通过 GitHub 发布需要已授权的仓库写入权限；如果配置了 Make webhook，则按该接口的格式发送，不要把 GitHub 令牌写入日报。';
document.getElementById('copy-prompt').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText(prompt); status.textContent = '已复制，粘贴给 AI 即可。'; }
  catch { status.textContent = prompt; }
});
async function loadPages() {
  const status = document.getElementById('list-status');
  try {
    const response = await fetch('pages.json', { cache: 'no-cache', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('目录暂时不可用');
    const data = await response.json();
    if (!Array.isArray(data.pages)) throw new Error('目录格式异常');
    const pages = data.pages.filter(path => typeof path === 'string' && path.startsWith('pages/') && /\.html?$/i.test(path)).sort((a,b) => { const dated = path => /\/\d{4}-\d{2}-\d{2}\.html?$/i.test(path); return Number(dated(b))-Number(dated(a)) || b.localeCompare(a); }).map(path => ({path}));
    const list = document.getElementById('page-list');
    list.replaceChildren();
    for (const file of pages) {
      const link = document.createElement('a'); link.className = 'page-row';
      link.href = file.path.split('/').map(encodeURIComponent).join('/');
      const icon = document.createElement('span'); icon.className = 'file-icon'; icon.setAttribute('aria-hidden','true'); icon.textContent = '</>';
      const info = document.createElement('span'); info.className = 'page-info';
      const title = document.createElement('strong'); title.textContent = /\/\d{4}-\d{2}-\d{2}\.html?$/i.test(file.path) ? file.path.split('/').pop().replace(/\.html?$/i, '') + ' · AI 日报' : file.path.slice(6);
      const description = document.createElement('span'); description.textContent = file.path === 'pages/hello.html' ? '发布示例 · 从这里开始' : '阅读日报';
      info.append(title, description);
      const arrow = document.createElement('span'); arrow.className = 'row-arrow'; arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↗';
      link.append(icon, info, arrow); list.append(link);
    }
    document.getElementById('page-count').textContent = `${pages.length} 个文件`;
    status.textContent = '目录随网页一起发布。新上传的网页会在部署完成后显示。';
  } catch (error) {
    console.warn('Directory sync failed:', error);
    status.replaceChildren(document.createTextNode('目录暂时无法同步，示例仍可访问。'));
    const link = document.createElement('a'); link.href = `https://github.com/${repo}/tree/main/pages`; link.textContent = ' 查看全部文件 ↗'; status.append(link);
  }
}
loadPages();
