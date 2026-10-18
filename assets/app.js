'use strict';
const repo = 'elarazju/elarazju.github.io';
const prompt = '请把生成的 HTML 发布到 GitHub 仓库 elarazju/elarazju.github.io 的 main 分支，放在 pages/ 文件夹下，使用唯一的英文文件名，不要覆盖已有文件。静态资源一起上传并使用相对路径。保留首页和其他内容。提交后检查 GitHub Pages 部署成功，并返回 https://elarazju.github.io/pages/文件名.html 。需要已授权的 GitHub 仓库写入权限；不要将令牌或敏感信息写入网页。';
document.getElementById('copy-prompt').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText(prompt); status.textContent = '已复制，粘贴给 AI 即可。'; }
  catch { status.textContent = prompt; }
});
async function loadPages() {
  const status = document.getElementById('list-status');
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('目录暂时不可用');
    const data = await response.json();
    if (!Array.isArray(data.tree)) throw new Error('目录格式异常');
    const pages = data.tree.filter(item => item.type === 'blob' && item.path.startsWith('pages/') && /\.html?$/i.test(item.path)).sort((a,b) => a.path.localeCompare(b.path));
    const list = document.getElementById('page-list');
    list.replaceChildren();
    for (const file of pages) {
      const link = document.createElement('a'); link.className = 'page-row';
      link.href = file.path.split('/').map(encodeURIComponent).join('/');
      const icon = document.createElement('span'); icon.className = 'file-icon'; icon.setAttribute('aria-hidden','true'); icon.textContent = '</>';
      const info = document.createElement('span'); info.className = 'page-info';
      const title = document.createElement('strong'); title.textContent = file.path.slice(6);
      const description = document.createElement('span'); description.textContent = file.path === 'pages/hello.html' ? '发布示例 · 从这里开始' : '打开网页';
      info.append(title, description);
      const arrow = document.createElement('span'); arrow.className = 'row-arrow'; arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↗';
      link.append(icon, info, arrow); list.append(link);
    }
    document.getElementById('page-count').textContent = `${pages.length} 个网页`;
    status.textContent = data.truncated ? '目录较大，完整列表请查看 GitHub 仓库。' : '目录来自 GitHub。新上传的网页需等待部署完成后才能打开。';
  } catch {
    status.replaceChildren(document.createTextNode('目录暂时无法同步，示例仍可访问。'));
    const link = document.createElement('a'); link.href = `https://github.com/${repo}/tree/main/pages`; link.textContent = ' 查看全部文件 ↗'; status.append(link);
  }
}
loadPages();
