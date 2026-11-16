(() => {
  'use strict';
  const base='/assets/uni-review/';
  const cache={};
  const fmt=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const safe=(n,d=4)=>Number(n).toFixed(d);
  const load=async period=>{
    if(!cache[period]){
      const url=base+(period==='minute'?'minutes-20261016.json':'daily-20261007-1116.json');
      const res=await fetch(url);if(!res.ok)throw new Error('行情数据加载失败');
      cache[period]=await res.json();
    }
    return cache[period];
  };
  const align=data=>{
    const swaps=new Map(data.swap.map(x=>[x[0],x])),fxs=new Map(data.fx.map(x=>[x[0],x]));
    return data.spot.filter(x=>swaps.has(x[0])&&fxs.has(x[0])).map(spot=>({t:spot[0],spot,swap:swaps.get(spot[0]),fx:fxs.get(spot[0])}));
  };
  function setup(el){
    if(el.dataset.initialized)return;el.dataset.initialized='1';
    const kind=el.dataset.kind, canvas=el.querySelector('canvas'), tip=el.querySelector('.uni-chart-tip'),status=el.querySelector('.uni-chart-status');let rows=[],selected=-1,geometry=null;
    function render(){
      if(!rows.length)return;
      const ratio=window.devicePixelRatio||1,w=canvas.clientWidth,h=canvas.clientHeight;
      canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);const c=canvas.getContext('2d');c.scale(ratio,ratio);c.clearRect(0,0,w,h);
      const left=12,right=62,top=12,bottom=26,width=w-left-right;const priceBottom=kind==='compare'?h*.70:h-bottom;
      const values=rows.flatMap(r=>kind==='compare'?[r.spot[4],r.swap[4]]:[r.fx[4]]);let min=Math.min(...values),max=Math.max(...values);let pad=(max-min)*.12||.0001;min-=pad;max+=pad;
      const px=i=>left+i*width/Math.max(rows.length-1,1),py=v=>top+(max-v)/(max-min)*(priceBottom-top);
      c.font='11px system-ui';c.textAlign='left';c.textBaseline='middle';
      for(let i=0;i<=4;i++){const y=top+(priceBottom-top)*i/4,v=max-(max-min)*i/4;c.strokeStyle='#34414e';c.beginPath();c.moveTo(left,y);c.lineTo(left+width,y);c.stroke();c.fillStyle='#aabac9';c.fillText(v.toFixed(kind==='fx'?5:3),left+width+5,y)}
      function line(get,color){c.beginPath();rows.forEach((r,i)=>{const y=py(get(r));i?c.lineTo(px(i),y):c.moveTo(px(i),y)});c.strokeStyle=color;c.lineWidth=1.4;c.stroke()}
      if(kind==='compare'){
        line(r=>r.swap[4],'#59aaff');line(r=>r.spot[4],'#ff9857');
        const spreads=rows.map(r=>(r.swap[4]/r.spot[4]-1)*10000),abs=Math.max(1,...spreads.map(Math.abs)),mid=h*.82,amp=h*.085;
        c.strokeStyle='#647482';c.beginPath();c.moveTo(left,mid);c.lineTo(left+width,mid);c.stroke();c.beginPath();spreads.forEach((v,i)=>{let x=px(i),y=mid-v/abs*amp;i?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle='#ff7277';c.lineWidth=1;c.stroke();c.fillStyle='#b6c4d1';c.fillText('0',left+width+5,mid);
      } else line(r=>r.fx[4],'#7ac5ff');
      c.fillStyle='#aabac9';c.textBaseline='alphabetic';c.textAlign='left';c.fillText(fmt.format(rows[0].t),left,h-5);c.textAlign='right';c.fillText(fmt.format(rows[rows.length-1].t),left+width,h-5);
      geometry={left,width,h,px,py,priceBottom};
      if(selected>=0){const x=px(selected);c.strokeStyle='#8c9aaa';c.setLineDash([3,3]);c.beginPath();c.moveTo(x,top);c.lineTo(x,h-bottom);c.stroke();c.setLineDash([])}
    }
    function show(i){
      if(!rows.length)return;selected=Math.max(0,Math.min(rows.length-1,i));render();const r=rows[selected];
      const time=fmt.format(r.t)+(el.dataset.period==='daily'?' JST（UTC日线开盘时刻）':' JST');
      if(kind==='compare'){
        const raw=(r.swap[4]/r.spot[4]-1)*100,usd=r.spot[4]*r.fx[4],adjusted=(r.swap[4]/usd-1)*100;
        tip.innerHTML=`<strong>${time}</strong><br>合约收盘：${safe(r.swap[4])} USD<br>现货收盘：${safe(r.spot[4])} USDT<br>USDT/USD：${safe(r.fx[4],5)}<br>直接报价差：${safe(raw,4)}%<br>换算美元后：${safe(adjusted,4)}%`;
      }else tip.innerHTML=`<strong>${time}</strong><br>开盘：${safe(r.fx[1],5)} USD<br>最高：${safe(r.fx[2],5)} USD<br>最低：${safe(r.fx[3],5)} USD<br>收盘：${safe(r.fx[4],5)} USD<br>偏离 1 美元：${safe((r.fx[4]-1)*100,4)}%`;
      tip.style.display='block';const rct=canvas.getBoundingClientRect(),parent=el.getBoundingClientRect();let x=rct.left-parent.left+geometry.px(selected)+12;tip.style.left=Math.max(6,Math.min(x,el.clientWidth-tip.offsetWidth-8))+'px';tip.style.top=(rct.top-parent.top+12)+'px';
    }
    canvas.addEventListener('pointermove',e=>{if(!geometry)return;const r=canvas.getBoundingClientRect();show(Math.round((e.clientX-r.left-geometry.left)/geometry.width*(rows.length-1)))});
    canvas.addEventListener('pointerleave',()=>{selected=-1;tip.style.display='none';render()});
    canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(selected<0?0:selected+(e.key==='ArrowRight'?1:-1))}});
    async function select(period){el.dataset.period=period;el.querySelectorAll('button').forEach(b=>{const active=b.dataset.period===period;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});status.textContent='正在加载行情…';tip.style.display='none';selected=-1;try{rows=align(await load(period));if(!rows.length)throw Error('没有匹配的行情数据');status.textContent=period==='minute'?'2026-10-16 日本时间全天 · 1 分钟':'2026-10-07 至 11-16 · UTC 日线（末日未收盘）';render()}catch(e){status.textContent='行情数据加载失败，请刷新重试。'}}
    el.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>select(b.dataset.period)));new ResizeObserver(render).observe(canvas);select('minute');
  }
  function init(){document.querySelectorAll('.uni-interactive').forEach(setup)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  document.addEventListener('pjax:complete',init);
})();
