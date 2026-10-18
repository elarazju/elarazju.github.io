'use strict';

const datedPath = /^pages\/(?:[^/]+\/)*(\d{4}-\d{2}-\d{2})\.html?$/i;

async function loadReports() {
  const status = document.getElementById('list-status');
  const list = document.getElementById('report-list');
  const count = document.getElementById('report-count');
  status.textContent = '加载中…';
  try {
    const response = await fetch('pages.json', { cache: 'no-cache', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Could not load report directory');
    const data = await response.json();
    const source = Array.isArray(data.reports) ? data.reports : (Array.isArray(data.pages) ? data.pages.map(path => ({ path })) : null);
    if (!source) throw new Error('Invalid report directory');
    const reports = source.filter(report => report && typeof report.path === 'string' && datedPath.test(report.path)).map(report => ({
      path: report.path,
      date: report.path.match(datedPath)[1],
      title: typeof report.title === 'string' && report.title.trim() ? report.title.trim() : 'AI 日报'
    })).sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path));

    const content = document.createDocumentFragment();
    let currentYear;
    let rows;
    for (const report of reports) {
      const year = report.date.slice(0, 4);
      if (year !== currentYear) {
        currentYear = year;
        const section = document.createElement('section');
        section.className = 'year-section';
        const heading = document.createElement('h2');
        heading.className = 'year-heading';
        heading.textContent = year;
        rows = document.createElement('ul');
        rows.className = 'report-rows';
        section.append(heading, rows);
        content.append(section);
      }
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'report-row';
      link.href = report.path.split('/').map(encodeURIComponent).join('/');
      const date = document.createElement('time');
      date.className = 'report-date';
      date.dateTime = report.date;
      date.textContent = report.date.slice(5).replace('-', '.');
      date.setAttribute('aria-label', report.date);
      const title = document.createElement('span');
      title.className = 'report-title';
      title.textContent = report.title;
      const arrow = document.createElement('span');
      arrow.className = 'report-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.append(date, title, arrow);
      item.append(link);
      rows.append(item);
    }
    list.replaceChildren(content);
    count.textContent = reports.length ? `${reports.length} 篇` : '';
    status.textContent = reports.length ? '' : '暂无日报';
  } catch (error) {
    console.warn('Report directory could not be loaded:', error);
    status.textContent = '暂时无法加载';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = '重试';
    retry.addEventListener('click', loadReports);
    status.append(retry);
  }
}

loadReports();
