(() => {
  const key = 'yanshou-db';
  const existing = JSON.parse(localStorage.getItem(key) || '{}');
  if (!Array.isArray(existing.issues) || existing.issues.some(item => item.source === '走查.xlsx')) return;

  const rows = [
    ['P0','电脑','主页','画面前后色差太大；画面容器色值应为 #FFF1E3，垫的纹理图透明度为 70%'],
    ['P0','电脑','类型-main','去掉下方指示器 bar'],
    ['P0','电脑','全局','大小字号应为 15'],
    ['P1','电脑','类型-main','初始态默认选中选项'],
    ['P0','电脑','类型-main','风格默认不选中，不给样式'],
    ['P0','电脑','类型-main','调整 A 图风格时 B 图不应加载闪烁，调整 B 图同理'],
    ['P0','电脑','类型-main','凸显图形需受容器边界约束，不能破坏圆角裁切'],
    ['P0','电脑','类型-main','纵向时菱形和圆形拖动区域只能在容器内，最大宽度受容器限制'],
    ['P0','电脑','类型-main','图形缩放锚点固定为中心，不做其他锚点缩放'],
    ['P0','电脑','类型-main','下载按钮字色 #2E211A，默认 60% 透明度，点击态 100%'],
    ['P0','电脑','类型-main','图片导出前后不一致'],
    ['P1','电脑','类型-main','导出媒介调整为浏览器下载'],
    ['P0','电脑','类型-main','上传图片后周围不要有小虚线'],
    ['P1','电脑','类型-main','从 pool 区拖来的显示区域大小应与图片容器一致'],
    ['P1','电脑','类型-main','pool 区图片长按 500ms 触发拖动，并在右上角显示添加图标'],
    ['P0','电脑','类型-main','装饰条位置 X:0、Y:95，不遮挡图片也不被图片遮住'],
    ['P0','电脑','类型-main','位置和图片均不正确，需要重新调整'],
    ['P0','电脑','类型-diary','边框丢失，需要替换切图'],
    ['P0','电脑','类型-diary','切图错误且位置错误（复用项）'],
    ['P1','电脑','类型-diary','该区域不要滚动，高度自适配'],
    ['P0','安卓／苹果','类型-diary','位置不对，布局与文字下方内容不对应；文字 Tab 下内容居中对齐'],
    ['P0','电脑','类型-diary','缩放锚点为中心，做中心缩放'],
    ['P1','电脑','类型-diary','切图太糊，调整为 77×57'],
    ['P0','电脑','类型-diary','不做永久选中，只保留点击态选中'],
    ['P1','电脑','类型-diary','文字控制框左右间距一致；输入文字最大宽度受图片容器约束'],
    ['P1','电脑','类型-diary','hover 色块时鼠标指示器应为小手'],
    ['P1','全端','全局','选中态增加 1px 描边，颜色 #4991AA、80% 透明度'],
    ['P0','安卓／苹果','全局','手机端下载有问题：风格样式未显示且位置大小变化；安卓无法下载，建议使用截图导出'],
    ['P1','安卓／苹果','全局','检查能否禁止复制，避免长按误触触发复制'],
    ['P0','安卓','类型-main','点击移动方块后移动非常卡顿'],
    ['P0','安卓','类型-main','pool 区无法移动替换，无法唤起'],
    ['P0','安卓','类型-diary','pool 区长按会拉出保存图片'],
    ['P0','安卓','类型-diary','移动方块按钮文字不是默认字体'],
    ['P1','安卓／苹果','全局','“移动方块”改名为“移动图形”更合理']
  ];
  const mobile = platform => /安卓|苹果/.test(platform);
  const imported = rows.map((row, index) => ({
    id: `walkthrough-${index + 1}`,
    source: '走查.xlsx',
    title: `${mobile(row[1]) ? '【移动端优先】' : ''}${row[2]}：${row[3].split(/[；，]/)[0]}`,
    desc: `${row[3]}（测试端：${row[1]}；来源：走查.xlsx 第 ${index + 2} 行）`,
    priority: row[0] === 'P0' ? 'blocker' : 'major',
    owner: mobile(row[1]) ? '移动端开发' : '待指派',
    status: 'open',
    image: '',
    platform: row[1],
    mobilePriority: mobile(row[1])
  }));
  existing.issues = [...imported.filter(item => item.mobilePriority), ...imported.filter(item => !item.mobilePriority), ...(existing.issues || [])];
  localStorage.setItem(key, JSON.stringify(existing));
  location.reload();
})();
