/* Embed the extracted original opportunity front end in an isolated local frame. */
(() => {
  const host=document.getElementById('quantOpportunities');
  if(!host||host.dataset.ready)return;
  host.dataset.ready='true';
  const frame=document.createElement('iframe');
  frame.src='/assets/quant-demo/index.html';
  frame.title='量化机会 · 原版前端快照 Demo';
  frame.id='quantDemoFrame';
  frame.style.cssText='display:block;width:100%;min-height:520px;border:0;background:transparent';
  host.replaceChildren(frame);
  frame.addEventListener('load',()=>{
    const doc=frame.contentDocument;if(!doc)return;
    const theme=()=>doc.documentElement.setAttribute('data-theme',document.documentElement.getAttribute('data-theme')||'light');
    theme();const themeObserver=new MutationObserver(theme);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    const resize=()=>{const height=Math.ceil(doc.body.getBoundingClientRect().height);if(height>0)frame.style.height=height+'px';};
    const observer=new ResizeObserver(resize);observer.observe(doc.body);resize();
    window.addEventListener('pagehide',()=>{observer.disconnect();themeObserver.disconnect();},{once:true});
  });
})();
