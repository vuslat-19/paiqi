(() => {
  const key = 'yanshou-db';
  const database = JSON.parse(localStorage.getItem(key) || '{}');
  database.ideas ||= [
    {id:1,title:'支持保存未提交的表单内容',desc:'用户切换页面后不应丢失填写进度。',type:'用户体验',planned:false},
    {id:2,title:'案例页增加行业筛选',desc:'让访客更快找到与自己相关的案例。',type:'增长',planned:false},
    {id:3,title:'官网增加深色阅读模式',desc:'为夜间浏览提供更舒适的视觉体验。',type:'内容',planned:false}
  ];
  database.plans ||= [
    {id:1,title:'首页首屏视觉优化',owner:'陈晨',stage:'设计稿确认',color:'#8479cf',left:28,width:31},
    {id:2,title:'商品详情页改版',owner:'李岩',stage:'开发中',color:'#c7803e',left:43,width:35},
    {id:3,title:'移动端表单体验',owner:'你',stage:'待验收',color:'#4a8c79',left:58,width:26}
  ];
  database.issues ||= [
    {id:1,title:'移动端首屏文案被遮挡',desc:'iPhone 14 Safari 下，标题最后一行超出安全区域。',priority:'blocker',owner:'李岩',status:'open',image:''},
    {id:2,title:'提交按钮加载状态缺失',desc:'点击后没有反馈，用户容易重复提交。',priority:'major',owner:'陈晨',status:'working',image:''},
    {id:3,title:'卡片悬停动画不一致',desc:'第三张案例卡片的阴影与其余卡片不同。',priority:'minor',owner:'李岩',status:'open',image:''}
  ];
  if (database.issues.filter(item => item.source === '走查.xlsx').length >= 34) return;
  const rows = [
    ['P0','电脑','主页','画面前后色差太大；画面容器色值应为 #FFF1E3，垫的纹理图透明度为 70%'],['P0','电脑','类型-main','去掉下方指示器 bar'],['P0','电脑','全局','大小字号应为 15'],['P1','电脑','类型-main','初始态默认选中选项'],['P0','电脑','类型-main','风格默认不选中，不给样式'],['P0','电脑','类型-main','调整 A 图风格时 B 图不应加载闪烁，调整 B 图同理'],['P0','电脑','类型-main','凸显图形需受容器边界约束，不能破坏圆角裁切'],['P0','电脑','类型-main','纵向时菱形和圆形拖动区域只能在容器内，最大宽度受容器限制'],['P0','电脑','类型-main','图形缩放锚点固定为中心，不做其他锚点缩放'],['P0','电脑','类型-main','下载按钮字色 #2E211A，默认 60% 透明度，点击态 100%'],['P0','电脑','类型-main','图片导出前后不一致'],['P1','电脑','类型-main','导出媒介调整为浏览器下载'],['P0','电脑','类型-main','上传图片后周围不要有小虚线'],['P1','电脑','类型-main','从 pool 区拖来的显示区域大小应与图片容器一致'],['P1','电脑','类型-main','pool 区图片长按 500ms 触发拖动，并在右上角显示添加图标'],['P0','电脑','类型-main','装饰条位置 X:0、Y:95，不遮挡图片也不被图片遮住'],['P0','电脑','类型-main','位置和图片均不正确，需要重新调整'],['P0','电脑','类型-diary','边框丢失，需要替换切图'],['P0','电脑','类型-diary','切图错误且位置错误（复用项）'],['P1','电脑','类型-diary','该区域不要滚动，高度自适配'],['P0','安卓／苹果','类型-diary','位置不对，布局与文字下方内容不对应；文字 Tab 下内容居中对齐'],['P0','电脑','类型-diary','缩放锚点为中心，做中心缩放'],['P1','电脑','类型-diary','切图太糊，调整为 77×57'],['P0','电脑','类型-diary','不做永久选中，只保留点击态选中'],['P1','电脑','类型-diary','文字控制框左右间距一致；输入文字最大宽度受图片容器约束'],['P1','电脑','类型-diary','hover 色块时鼠标指示器应为小手'],['P1','全端','全局','选中态增加 1px 描边，颜色 #4991AA、80% 透明度'],['P0','安卓／苹果','全局','手机端下载有问题：风格样式未显示且位置大小变化；安卓无法下载，建议使用截图导出'],['P1','安卓／苹果','全局','检查能否禁止复制，避免长按误触触发复制'],['P0','安卓','类型-main','点击移动方块后移动非常卡顿'],['P0','安卓','类型-main','pool 区无法移动替换，无法唤起'],['P0','安卓','类型-diary','pool 区长按会拉出保存图片'],['P0','安卓','类型-diary','移动方块按钮文字不是默认字体'],['P1','安卓／苹果','全局','“移动方块”改名为“移动图形”更合理']
  ];
  const isMobile = platform => /安卓|苹果/.test(platform);
  const issues = rows.map((row, index) => ({
    id: `walkthrough-${index + 1}`, source: '走查.xlsx',
    title: `${isMobile(row[1]) ? '【移动端优先】' : ''}${row[2]}：${row[3].split(/[；，]/)[0]}`,
    desc: `${row[3]}（测试端：${row[1]}；来源：走查.xlsx 第 ${index + 2} 行）`,
    priority: row[0] === 'P0' ? 'blocker' : 'major', owner: isMobile(row[1]) ? '移动端开发' : '待指派',
    status: 'open', image: '', platform: row[1], mobilePriority: isMobile(row[1])
  }));
  database.issues = [...issues.filter(item => item.mobilePriority), ...issues.filter(item => !item.mobilePriority), ...database.issues.filter(item => item.source !== '走查.xlsx')];
  localStorage.setItem(key, JSON.stringify(database));
})();
