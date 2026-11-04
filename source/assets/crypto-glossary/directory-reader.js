/* Read the complete server-rendered dictionary without duplicating its content.
 * Move original nodes, not copies, so animation event handlers and IDs survive. */
(() => {
  function mount() {
    const root = document.querySelector('#article-container:has(#crypto-glossary)');
    if (!root || root.dataset.directoryReady) return;
    if (root.dataset.nativeMotion !== 'ready') {
      const observer = new MutationObserver(() => {
        if (root.dataset.nativeMotion === 'ready') { observer.disconnect(); mount(); }
        if (root.dataset.nativeMotion === 'failed') observer.disconnect();
      });
      observer.observe(root, {attributes: true, attributeFilter: ['data-native-motion']});
      return;
    }
    root.dataset.directoryReady = 'true';
    let entries = [];
    let topic = '', professionalTopic = '';
    const headings = Array.from(root.querySelectorAll('h2,h3,h4'));
    for (const heading of headings) {
      if (heading.closest('dialog')) continue;
      if (heading.tagName === 'H2') {
        topic = heading.textContent.trim();
        const introduction = [heading];
        let sibling = heading.nextElementSibling;
        while (sibling && !/^H[234]$/.test(sibling.tagName)) {
          if (!sibling.matches('script,style,link,dialog,#professional-dictionary')) introduction.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        if (introduction.length > 1) entries.push({title:topic+' · 章节说明',id:heading.id,category:topic,professional:false,nodes:introduction,text:introduction.map(n=>n.textContent).join(' ').toLowerCase()});
        continue;
      }
      const professional = !!heading.closest('#professional-dictionary');
      if (professional && heading.tagName === 'H4') professionalTopic = heading.textContent.trim();
      if (heading.tagName === 'H4' && !professional) continue;
      const nodes = [heading];
      let next = heading.nextElementSibling;
      while (next && !/^H[234]$/.test(next.tagName)) {
        // Nested row records have their own entries; never move them twice.
        if (!next.matches('script,style,link,dialog') && !next.querySelector('.professional-record')) nodes.push(next);
        next = next.nextElementSibling;
      }
      if (heading.tagName === 'H4' && nodes.length === 1) continue;
      const title = heading.textContent.trim();
      entries.push({title, id: heading.id || 'dictionary-section-' + entries.length,
        category: professional ? '专业词典 · ' + (professionalTopic || '使用说明') : topic,
        professional, nodes, text: nodes.map(n => n.textContent).join(' ').toLowerCase()});
    }
    // Keep the supplied dictionary's preamble, caveats and initial source notes visible.
    const professional = root.querySelector('#professional-dictionary');
    const preamble = [];
    for (const node of Array.from(professional.children)) {
      if (node.tagName === 'H4') break;
      if (node.tagName !== 'SUMMARY') preamble.push(node);
    }
    if (preamble.length) entries.push({title:'专业词典使用说明与核实状态',id:'dictionary-source-notes',category:'专业词典 · 使用说明',professional:true,nodes:preamble,text:preamble.map(n=>n.textContent).join(' ').toLowerCase()});
    const referenceConcepts={F1:'资金费率',F2:'U 本位杠杆与保证金',F3:'币本位杠杆与保证金',F4:'风险限额 / 杠杆分层',F5:'合约计算器',F6:'强平价格',F7:'强平价格',F8:'强平 / 爆仓',F9:'保险基金',F10:'自动减仓',F11:'标记价格',F12:'标记价格',F13:'标记价格',F14:'季度合约标记价格',F15:'收益率',F16:'交易手续费',F17:'统一账户保证金率',F18:'组合保证金率',F19:'多资产模式保证金率',F20:'杠杆借贷强平价格',F21:'价格保护与交易规则',F22:'交易接口与规则文档'};
    const label=window.GlossaryConcepts.displayTitle;
    for(const entry of entries){
      const code=entry.title.trim();
      if(/^F\d+$/.test(code)){
        let sourceTopic='';
        for(const node of entry.nodes)for(const dt of node.querySelectorAll('dt'))if(dt.textContent.trim()==='主题')sourceTopic=dt.nextElementSibling?.textContent||'';
        entry.title=referenceConcepts[code]||label(code,sourceTopic);
        entry.referenceTopic=sourceTopic||entry.title;
        entry.referenceOnly=true;
      }else entry.title=label(entry.title);
      entry.category=label(entry.category);
      if(/强平价格/.test(entry.category)&&/^(WB|TMM1|UPNL1|cumB|MMRB|Side1BOTH|Position1BOTH|EP1BOTH)/i.test(entry.title))entry.title='强平价格';
    }
    const rawCount=entries.length;
    entries=window.GlossaryConcepts.mergeEntries(entries);
    function entryCopy(entry){
      // Strong curated explanations win; the ID-based learner records repair
      // source rows without treating field names or caveats as definitions.
      return window.GlossaryEditorial.entries[entry.concept]
        ||window.GlossaryBeginnerTrading?.records[entry.id]
        ||window.GlossaryBeginnerFields?.records[entry.id];
    }
    for(const [concept,copy]of Object.entries(window.GlossaryEditorial.entries)){
      if(entries.some(entry=>entry.concept===concept))continue;
      entries.push({title:copy.title,concept,id:'concept-'+concept,aliasIds:['concept-'+concept],category:'合约与仓位',categories:['合约与仓位'],members:[],nodes:[],professional:false,text:JSON.stringify(copy).toLowerCase()});
    }
    function publicCategory(entry){
      if(entry.members.length&&entry.members.every(member=>member.nodes[0]?.tagName!=='H3'))return '资料与公式说明';
      if(/^(?:（|本项目|内部代码)|图片公式|专页|未取到|公式索引|档位表|页面$/.test(entry.title))return '资料与公式说明';
      const text=entry.title+' '+entry.category;
      if(/强平|破产|保证金|风险|速算|杠杆分层|自动减仓|保险基金/.test(text))return '保证金与强平';
      if(/资金费|手续费|费用|返佣|利率|溢价指数|冲击/.test(text))return '费用与资金费率';
      if(/价格|行情|盈亏|收益|基差|均价/.test(text))return '价格与盈亏';
      if(/订单|委托|下单|有效方式|撮合|成交/.test(text))return '现货与订单';
      if(/账户|钱包|余额|资产|权益/.test(text))return '基础与账户';
      if(/链上|钱包/.test(entry.category))return '链上与钱包';
      if(/合约|产品|持仓|命名/.test(text))return '合约与仓位';
      return entry.professional?'专业字段与命名':entry.category;
    }
    for(const entry of entries){
      entry.category=publicCategory(entry);entry.categories=[entry.category];
      const copy=entryCopy(entry);
      if(copy){entry.title=copy.title;entry.text+=' '+JSON.stringify(copy).toLowerCase();}
      // A source citation is not an article. Do not offer title-only entries.
      entry.hasBody=!!copy||entry.members.some(member=>!member.referenceOnly&&member.nodes.some(node=>{
        const draft=/页面.{0,20}(未读|没读|缺失)|本次未|抓取|见第|本文未|F\d+|^查词|来源标记/;
        if(!member.professional&&node.tagName==='P'&&node.textContent.trim().length>10&&!draft.test(node.textContent))return true;
        return [...node.querySelectorAll('dt')].some(dt=>/^(含义|说明|备注|注解|币安中文|OKX 中文|中文)$/.test(dt.textContent.trim())&&dt.nextElementSibling?.textContent.trim().length>1&&!draft.test(dt.nextElementSibling.textContent));
      }));
    }
    const bank = document.createElement('div'); bank.hidden = true; bank.className = 'dictionary-original';
    while (root.firstChild) bank.append(root.firstChild);
    root.append(bank);
    const app = document.createElement('section'); app.className = 'dictionary-reader';
    app.innerHTML = `<header class="dr-header"><div><span class="dr-kicker">币圈指南 / TRADING LEXICON</span><h1>交易术语字典</h1><p>概念、机制与专业字段，每次读懂一个词。</p></div><label class="dr-search"><span>搜索词条与字段</span><input type="search" placeholder="中文 / English / fundingRate" aria-label="搜索完整词典"></label></header><div class="dr-workspace"><aside class="dr-sidebar"><label class="dr-category-label">分类导航<select aria-label="选择词典分类"></select></label><div class="dr-nav-count" aria-live="polite"></div><nav class="dr-terms" aria-label="术语目录"></nav></aside><div class="dr-main"><div class="dr-breadcrumb"></div><div class="dr-content"></div><section class="dr-evidence"><span>阅读与核对</span><div class="dr-source-links"></div><p>数字算例仅用于解释，并非实时行情或接口返回。原词典“建议命名、未核实、未抓取”等状态保留，不视为当前规则确认。</p></section><footer class="dr-paging"><button type="button" class="dr-prev">← 上一个词条</button><span></span><button type="button" class="dr-next">下一个词条 →</button></footer></div></div>`;
    root.append(app);
    const input=app.querySelector('input'), select=app.querySelector('select'), nav=app.querySelector('nav');
    const content=app.querySelector('.dr-content'), evidence=app.querySelector('.dr-source-links');
    const categories=[...new Set(entries.flatMap(e=>e.categories))];
    for(const name of ['全部分类',...categories]) { const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option); }
    let shown=entries.slice(), current=null, moved=[];
    function restore(){for(const item of moved)item.placeholder.replaceWith(item.node);moved=[];}
    function sourceLink(label,url){const a=document.createElement('a');a.textContent=label.replace(/\bF\d+\b/g,code=>referenceConcepts[code]||'官方资料')+' ↗';a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
    function move(node,target){const placeholder=document.createComment('dictionary-reader-position');node.replaceWith(placeholder);moved.push({node,placeholder});target.append(node);}
    function renderConcept(entry){
      const normalize=value=>value.replace(/\s+/g,' ').trim();
      const copy=entryCopy(entry);
      const sourceRows=[];
      for(const member of entry.members)for(const node of member.nodes)for(const dt of node.querySelectorAll('dl > dt')){
        const dd=dt.nextElementSibling;if(dd)sourceRows.push({label:normalize(dt.textContent),value:normalize(dd.textContent),html:dd.innerHTML,context:member.referenceTopic||member.title});
      }
      const cleanTitle=entry.title.replace(/（[^）]*）|\([^)]*\)/g,'').replace(/ · 章节说明$/,'').trim();
      const heading=document.createElement('h3');heading.textContent=copy?.title||cleanTitle;content.append(heading);
      const english=copy?.english||(entry.title.match(/（([^）]+)）|\(([^)]+)\)/)?.slice(1).find(Boolean))||sourceRows.find(row=>/^(English|英文|币安英文)$/.test(row.label))?.value;
      if(english){const subtitle=document.createElement('div');subtitle.className='dr-english';subtitle.textContent=english;content.append(subtitle);}
      function section(title){const region=document.createElement('section');region.className='dr-editorial-section';const h=document.createElement('h4');h.textContent=title;region.append(h);content.append(region);return region;}
      const publishedCopy=new Set();
      function paragraph(target,text,className=''){if(!text)return;const key=window.GlossaryCopy.key(text);if(publishedCopy.has(key))return;publishedCopy.add(key);const p=document.createElement('p');p.className=className;p.textContent=text;target.append(p);}
      const draftNote=text=>/页面.{0,20}(未读|没读|缺失)|本次未|抓取|见第|本文未|F\d+|^查词|来源标记/.test(text);
      const lead=entry.members.filter(member=>!member.professional).flatMap(member=>member.nodes).find(node=>node.tagName==='P'&&!draftNote(node.textContent));
      const candidates=sourceRows.filter(row=>/^(含义|说明|备注|注解|币安中文|OKX 中文|中文)$/.test(row.label)&&row.value&&row.value!=='—'&&!draftNote(row.value));
      const definition=copy?.definition||lead?.textContent.trim()||candidates.find(row=>row.value.length>12)?.value||candidates[0]?.value;
      if(definition)paragraph(content,definition,'dr-definition');
      const scope=copy?.scope;
      if(scope)paragraph(section('这个例子适用于什么情况'),scope);
      if(copy?.verifiedAt)paragraph(content,'资料核对：'+copy.verifiedAt,'dr-research-date');
      // Original animation elements keep all of their existing listeners.
      const animations=new Set();
      for(const member of entry.members)for(const node of member.nodes){
        if(node.matches('.gm-expand,.gm,.anim'))animations.add(node);
        else for(const figure of node.querySelectorAll('.gm-expand,.anim,.gm'))if(!figure.closest('.gm-expand')||figure.matches('.gm-expand'))animations.add(figure);
      }
      for(const node of animations)move(node,content);
      const calculator=document.createElement('div');
      calculator.className='dr-calculator-slot';
      content.append(calculator);
      if(!window.GlossaryCalculators?.mount(calculator,{concept:entry.concept,id:entry.id,calculator:copy?.calculator}))calculator.remove();
      for(const sectionCopy of copy?.sections||[]){
        const region=section(sectionCopy.title);
        for(const text of sectionCopy.paragraphs)paragraph(region,text);
        const citations=document.createElement('div');citations.className='dr-section-sources';
        for(const [label,url]of sectionCopy.sources||[])citations.append(sourceLink(label,url));
        if(citations.childNodes.length)region.append(citations);
      }
      if(copy?.example){const example=section('先看一个例子');example.classList.add('dr-example');paragraph(example,copy.example);}
      if(copy?.formulas?.length){
        const region=section('怎么计算');region.classList.add('dr-formulas');
        for(const formula of copy.formulas){
          let target=region;
          if(formula.advanced){const detail=document.createElement('details');detail.className='dr-advanced-formula';const summary=document.createElement('summary');summary.textContent='进阶算法：需要时再看';detail.append(summary);region.append(detail);target=detail;}
          const box=document.createElement('div');box.className='dr-formula';
          const label=document.createElement('div');label.className='dr-formula-label';label.textContent=formula.name;box.append(label);
          const pre=document.createElement('pre');pre.textContent=formula.expression;box.append(pre);target.append(box);
          paragraph(target,formula.scope,'dr-formula-scope');
          const dl=document.createElement('dl');dl.className='dr-variables';
          for(const [name,meaning]of formula.variables){const dt=document.createElement('dt');dt.textContent=name;const dd=document.createElement('dd');dd.textContent=meaning;dl.append(dt,dd);}target.append(dl);
        }
      }
      const fieldLabels=/^(币安字段|币安 英文 \/ 字段|OKX 字段|OKX 英文 \/ 字段|本项目字段|本项目对应|字段参考|💡 字段建议|OKX 账户级含义|OKX 持仓级含义)$/;
      const fields=new Map();
      for(const row of sourceRows){
        if(!fieldLabels.test(row.label)||!row.value||row.value==='—'||draftNote(row.value))continue;
        let label=row.label.replace(/^币安 英文 \/ 字段$/,'币安字段').replace(/^OKX 英文 \/ 字段$/,'OKX 字段');
        if(/本项目|建议|字段参考/.test(label))label='项目命名参考';
        // Compare the rendered text, not markup: <strong> and <code> are the
        // same wording. Preserve account/position scope even for the same code.
        const key=window.GlossaryCopy.key(label+'|'+row.value.replace(/[（(]估算值[）)]/g,''));
        if(!fields.has(key))fields.set(key,{...row,label});
      }
      if(fields.size){
        const region=document.createElement('details');region.className='dr-technical-fields';
        const summary=document.createElement('summary');summary.textContent='接口字段对照（给开发者，可跳过）';region.append(summary);content.append(region);
        const table=document.createElement('table');table.className='dr-field-table';table.innerHTML='<thead><tr><th>来源 / 范围</th><th>字段或命名</th></tr></thead>';
        const tbody=document.createElement('tbody');
        for(const field of fields.values()){const tr=document.createElement('tr');const label=document.createElement('td');label.textContent=field.label;const value=document.createElement('td');value.innerHTML=field.html;tr.append(label,value);tbody.append(tr);}table.append(tbody);region.append(table);
      }
      const warnings=window.GlossaryCopy.uniqueCopy(copy?.cautions||sourceRows.filter(row=>/注解|备注|区别|差异|注意/.test(row.label)&&/不能|不代表|不适用|不同|不含|仅|未验证|未核实/.test(row.value)).map(row=>row.value),[definition,scope,copy?.example,...(copy?.formulas||[]).map(f=>f.scope)]);
      if(warnings.length){const region=section('容易混淆的地方');const ul=document.createElement('ul');for(const text of warnings){const li=document.createElement('li');li.textContent=text;ul.append(li);}region.append(ul);}
      if(copy?.basis)paragraph(content,copy.basis,'dr-model-basis');
      if(copy?.related?.length){
        const region=section('接着看这些词');const links=document.createElement('div');links.className='dr-related-links';
        for(const concept of copy.related){
          const relatedEntry=entries.find(candidate=>candidate.concept===window.GlossaryConcepts.canonical(concept)&&candidate.hasBody);
          if(!relatedEntry||relatedEntry===entry)continue;
          const link=document.createElement('a');link.href='#'+encodeURIComponent(relatedEntry.id);link.textContent=relatedEntry.title;links.append(link);
        }
        if(links.childNodes.length)region.append(links);else region.remove();
      }
      // The reader is not a second copy of the source document. Only unique,
      // useful supplementary prose is promoted; original files remain untouched.
      if(!copy){
        const extraParagraphs=entry.members.filter(member=>!member.professional).flatMap(member=>member.nodes).filter(node=>node.tagName==='P'&&!draftNote(node.textContent)).map(node=>node.textContent);
        const extraNotes=candidates.filter(row=>/含义|说明|备注|注解/.test(row.label)&&row.value.length>12).map(row=>row.value);
        const extras=window.GlossaryCopy.uniqueCopy([...extraParagraphs,...extraNotes],[definition,scope,...warnings]);
        if(extras.length){const region=section('补充说明');for(const text of extras)paragraph(region,text);}
      }
      for(const [label,url]of copy?.sources||[])evidence.append(sourceLink(label,url));
      content.querySelectorAll('details').forEach(detail=>{if(!detail.closest('.dr-calculator-slot'))detail.open=true;});
    }
    function show(entry,updateHash=true){
      restore();content.replaceChildren();evidence.replaceChildren();current=entry;
      if(!entry||!entry.hasBody){content.textContent='没有找到有完整说明的匹配词条，请更换关键词或选择全部分类。';app.querySelector('.dr-breadcrumb').textContent='搜索结果';app.querySelector('.dr-prev').disabled=true;app.querySelector('.dr-next').disabled=true;app.querySelector('.dr-paging span').textContent='';return;}
      renderConcept(entry);
      content.classList.toggle('professional-record',entry.professional);
      app.querySelector('.dr-breadcrumb').textContent=entry.category;
      const existing=entry.nodes.flatMap(node=>[...node.querySelectorAll('a[href]')]).filter(a=>{try{return /(^|\.)(okx\.com|binance\.com|binance\.info)$/.test(new URL(a.href).hostname);}catch(_){return false;}});
      const unique=new Map([...evidence.querySelectorAll('a')].map(a=>[a.href,a.textContent.trim().replace(/ ↗$/,'')]));
      for(const a of existing)if(!unique.has(a.href))unique.set(a.href,a.textContent.trim());
      evidence.replaceChildren();
      for(const [url,label]of unique)evidence.append(sourceLink(label||'词条原文官方来源',url));
      if(!unique.size){
        // Label general indexes as further reading, not as a verified citation for every claim.
        evidence.append(sourceLink('OKX API v5 · 延伸核对入口','https://www.okx.com/docs-v5/en/'));
        evidence.append(sourceLink('Binance 开发文档 · 延伸核对入口','https://developers.binance.com/'));
      }
      if(entry.title.includes('USDT'))evidence.append(sourceLink('OKX · USDT 介绍','https://www.okx.com/learn/what-is-usdt'));
      if(entry.title.includes('C2C')||entry.title.includes('P2P'))evidence.append(sourceLink('OKX · P2P 交易流程','https://www.okx.com/help/what-is-p2p-trading'));
      nav.querySelectorAll('button').forEach(b=>{const active=b.dataset.id===entry.id;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
      const i=shown.indexOf(entry);app.querySelector('.dr-paging span').textContent='共 '+shown.length+' 个匹配概念';
      app.querySelector('.dr-prev').disabled=i<=0;app.querySelector('.dr-next').disabled=i<0||i>=shown.length-1;
      if(updateHash)history.replaceState(null,'','#'+encodeURIComponent(entry.id));
      // Original SVG animations restart when their original element is displayed.
      content.querySelectorAll('.anim').forEach(figure=>{figure.classList.remove('play');requestAnimationFrame(()=>figure.classList.add('play'));});
    }
    function filter(){
      const query=input.value.trim().toLowerCase(), category=select.value;
      shown=entries.filter(e=>e.hasBody&&(category==='全部分类'?(query||e.category!=='资料与公式说明'):e.categories.includes(category))&&(!query||e.text.includes(query)));
      if(query)shown.sort((a,b)=>Number(b.title.toLowerCase().includes(query))-Number(a.title.toLowerCase().includes(query)));
      nav.replaceChildren();app.querySelector('.dr-nav-count').textContent=shown.length+' 个词条 / 章节';
      for(const entry of shown){const b=document.createElement('button');b.type='button';b.textContent=entry.title;b.title=entry.title;b.dataset.id=entry.id;b.onclick=()=>show(entry);nav.append(b);}
      show(shown.includes(current)?current:shown[0],false);
    }
    input.addEventListener('input',filter);select.addEventListener('change',filter);
    app.querySelector('.dr-prev').onclick=()=>show(shown[shown.indexOf(current)-1]);
    app.querySelector('.dr-next').onclick=()=>show(shown[shown.indexOf(current)+1]);
    // Internal glossary links select the corresponding entry instead of scrolling hidden text.
    content.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a)return;let id;try{id=decodeURIComponent(a.hash.slice(1));}catch(_){return;}const entry=entries.find(e=>e.aliasIds.includes(id)||e.nodes.some(n=>n.id===id||Array.from(n.querySelectorAll('[id]')).some(x=>x.id===id)));if(entry){event.preventDefault();select.value='全部分类';input.value='';filter();show(entry);}});
    filter();
    let hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch(_){hash='';}
    show(entries.find(e=>e.hasBody&&e.aliasIds.includes(hash))||entries.find(e=>e.title.includes('USDT / U'))||shown[0],false);
    root.dataset.directoryEntries=String(entries.length);
    root.dataset.directoryRawEntries=String(rawCount);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
  document.addEventListener('pjax:complete',mount);
})();
