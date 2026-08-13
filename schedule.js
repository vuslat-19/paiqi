(() => {
  const count = document.querySelector('#requirementCount');
  const refresh = () => { if (count) count.textContent = document.querySelectorAll('#planRows .planrow').length; };
  refresh();
  new MutationObserver(refresh).observe(document.querySelector('#planRows'), { childList: true });
  window.addEventListener('hashchange', () => setTimeout(refresh, 0));
  document.querySelectorAll('.filter-plan').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-plan').forEach(item => item.classList.remove('chosen'));
    button.classList.add('chosen');
    const stage = button.textContent.trim();
    document.querySelectorAll('#planRows .planrow').forEach(row => {
      row.hidden = stage !== '全部' && !row.textContent.includes(stage);
    });
  }));
})();
