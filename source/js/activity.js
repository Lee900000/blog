(() => {
  'use strict';
  const labels = {publish:'发布',update:'文章更新',maintenance:'站点维护'};
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function heatmap(parent, year, counts, describe) {
    const wrap = el('div', 'activity-scroll');
    wrap.tabIndex = 0;
    wrap.setAttribute('aria-label', `${year} 年每日活跃图，可横向滚动`);
    const grid = el('div', 'activity-grid');
    const detail = el('p', 'activity-detail', '点击或聚焦日期格，查看当天记录。');
    const first = new Date(Date.UTC(year,0,1));
    const offset = first.getUTCDay();
    const end = new Date(Date.UTC(year+1,0,1));
    const values = Object.values(counts);
    const max = Math.max(1,...values);
    for (let i=0; i<offset; i++) grid.append(el('span','activity-cell empty'));
    const now = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    for (let d=first; d<end; d=new Date(d.getTime()+86400000)) {
      const date = d.toISOString().slice(0,10), n = counts[date] || 0;
      const cell = el('button','activity-cell');
      cell.type = 'button';
      cell.dataset.level = n ? Math.min(4,Math.ceil(n/max*4)) : 0;
      cell.title = describe(date,n);
      cell.setAttribute('aria-label',cell.title);
      if (date > now) { cell.disabled = true; cell.classList.add('future'); }
      cell.addEventListener('click',()=>{detail.textContent=cell.title;});
      cell.addEventListener('focus',()=>{detail.textContent=cell.title;});
      grid.append(cell);
    }
    const months=el('div','activity-months');
    for(let m=1;m<=12;m++)months.append(el('span','',`${m}月`));
    wrap.append(months,grid);
    const legend=el('div','activity-legend','少 ');
    for(let level=0;level<=4;level++){const dot=el('i','activity-cell');dot.dataset.level=level;legend.append(dot);}
    legend.append(document.createTextNode(' 多'));
    parent.append(wrap,legend,detail);
  }
  function panel(root,title,subtitle,years,render) {
    const section=el('section','activity-panel');
    const header=el('div','activity-heading');
    const text=el('div');text.append(el('h3','',title),el('p','activity-note',subtitle));
    const select=el('select','activity-year');select.setAttribute('aria-label',`${title}年份`);
    years.forEach(y=>{const option=el('option','',`${y} 年`);option.value=y;select.append(option);});
    const body=el('div');
    header.append(text,select);section.append(header,body);root.append(section);
    const update=()=>{body.replaceChildren();render(body,select.value);};
    select.addEventListener('change',update);update();
  }
  async function init() {
    const root=document.getElementById('about-activity');
    if(!root || root.dataset.loaded)return;
    root.dataset.loaded='true';
    try {
      const response=await fetch('/assets/activity.json');
      if(!response.ok)throw new Error('unavailable');
      const {blog}=await response.json();root.replaceChildren();
      const years=[...new Set(Object.keys(blog.days).map(d=>d.slice(0,4)))].sort().reverse();
      if(!years.length){root.append(el('p','','暂无博客维护记录。'));return;}
      panel(root,'博客创作与维护',`${blog.articles} 篇公开文章 · 发布、修改与站点调整分别记录`,years,(body,year)=>{
        const days=Object.fromEntries(Object.entries(blog.days).filter(([d])=>d.startsWith(year)));
        const totals={publish:0,update:0,maintenance:0},counts={};
        for(const [d,v] of Object.entries(days)){counts[d]=Object.values(v).reduce((a,b)=>a+b,0);for(const key in totals)totals[key]+=v[key];}
        const stats=el('div','activity-stats');
        for(const [key,n] of Object.entries(totals)){const card=el('div');card.append(el('strong','',String(n)),el('span','',labels[key]));stats.append(card);}
        body.append(stats);
        heatmap(body,Number(year),counts,(date)=>{const v=days[date]||{publish:0,update:0,maintenance:0};return `${date} · 发布 ${v.publish} · 文章更新 ${v.update} · 站点维护 ${v.maintenance}`;});
      });
      root.append(el('p','activity-note','统计口径：按日本时间归日。发布日期计一次；显式更新时间作为历史补充，与同日 Git 更新去重；不同提交的文章更新分别计数。样式、页面文案等按每次提交计一次站点维护，未提交修改暂不计入。批量迁移（单次超过 50 篇）记为站点维护。无可靠记录的历史调整不补造。'));
    } catch {root.replaceChildren(el('p','','记录暂时加载失败，请刷新页面重试。'));delete root.dataset.loaded;}
  }
  init();document.addEventListener('pjax:complete',init);
})();
