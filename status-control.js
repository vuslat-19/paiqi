(() => {
  const key = 'yanshou-db';
  const labels = { open: '待处理', working: '修复中', fixed: '已修复' };

  const sync = () => {
    document.querySelectorAll('#issueList .issue').forEach(row => {
      if (row.querySelector('.status-select')) return;
      const title = row.querySelector('b')?.textContent;
      const statusLabel = row.querySelector('.status');
      if (!title || !statusLabel) return;
      const select = document.createElement('select');
      select.className = 'status-select';
      select.setAttribute('aria-label', `更新「${title}」的状态`);
      const current = Object.entries(labels).find(([, label]) => label === statusLabel.textContent.trim())?.[0] || 'open';
      select.innerHTML = Object.entries(labels).map(([value, label]) => `<option value="${value}"${value === current ? ' selected' : ''}>${label}</option>`).join('');
      statusLabel.replaceWith(select);
      select.addEventListener('change', () => {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const issue = data.issues?.find(item => item.title === title);
        if (!issue) return;
        issue.status = select.value;
        localStorage.setItem(key, JSON.stringify(data));
        /* Keep the active filter selected and redraw only the issue board. */
        if (typeof db !== 'undefined') {
          const liveIssue = db.issues?.find(item => item.title === title);
          if (liveIssue) liveIssue.status = select.value;
          render();
        } else {
          location.reload();
        }
      });
    });
  };

  new MutationObserver(sync).observe(document.querySelector('#issueList'), { childList: true });
  sync();
})();
