(() => {
  const key = 'yanshou-db';
  const attachButtons = () => document.querySelectorAll('#issueList .issue').forEach(row => {
    if (row.querySelector('.delete-issue')) return;
    const button = document.createElement('button');
    button.className = 'delete-issue';
    button.type = 'button';
    button.textContent = '删除';
    row.append(button);
  });
  const observer = new MutationObserver(attachButtons);
  const list = document.querySelector('#issueList');
  if (list) observer.observe(list, { childList: true });
  attachButtons();
  document.addEventListener('click', event => {
    const button = event.target.closest('.delete-issue');
    if (!button) return;
    const row = button.closest('.issue');
    const title = row.querySelector('b')?.textContent?.trim();
    if (!title || !confirm(`确认删除「${title}」吗？此操作不可撤销。`)) return;
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    data.issues = (data.issues || []).filter(item => item.title !== title);
    localStorage.setItem(key, JSON.stringify(data));
    location.reload();
  });
})();
