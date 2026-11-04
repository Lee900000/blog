// Read-only editorial audit. Run the reader's extraction/merging phase against
// generated HTML; do not invent a second notion of which entries are visible.
const fs=require('node:fs');
const vm=require('node:vm');
const {load}=require('cheerio');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
function inventory(){
  const $=load(fs.readFileSync(path.join(base,'public/archives/5596f036.html'),'utf8'));
  const cache=new Map();
  function wrap(node){
    if(!node)return null;if(cache.has(node))return cache.get(node);
    const element={get tagName(){return node.tagName?.toUpperCase()},get textContent(){return $(node).text()},get id(){return $(node).attr('id')||''},get children(){return $(node).children().toArray().map(wrap)},get nextElementSibling(){return wrap($(node).next()[0])},querySelectorAll(selector){return $(node).find(selector).toArray().map(wrap)},querySelector(selector){return wrap($(node).find(selector)[0])},matches(selector){return $(node).is(selector)},closest(selector){return wrap($(node).closest(selector)[0])},dataset:{}};
    cache.set(node,element);return element;
  }
  const root=wrap($('#article-container')[0]);root.dataset.nativeMotion='ready';
  const document={querySelector(){return root},readyState:'complete',addEventListener(){}};
  const editorial=require('../source/assets/crypto-glossary/editorial.js');
  const window={GlossaryConcepts:require('../source/assets/crypto-glossary/concepts.js'),GlossaryEditorial:editorial};
  for(const [name,file]of [['GlossaryBeginnerTrading','beginner-trading.js'],['GlossaryBeginnerFields','beginner-fields.js']]){
    const location=path.join(base,'source/assets/crypto-glossary',file);
    if(fs.existsSync(location))window[name]=require(location);
  }
  let source=fs.readFileSync(path.join(base,'source/assets/crypto-glossary/directory-reader.js'),'utf8');
  const stop=source.indexOf('    const bank =');if(stop<0)throw Error('Reader extraction boundary changed');
  source=source.slice(0,stop)+'    result.entries=entries;result.entryCopy=typeof entryCopy===\'function\'?entryCopy:null;\n  }\n  mount();\n})();';
  const result={};vm.runInNewContext(source,{document,window,result});
  return result.entries.filter(e=>e.hasBody).map(entry=>({
    id:entry.id,concept:entry.concept,title:entry.title,category:entry.category,
    aliases:entry.aliasIds,curated:!!editorial.entries[entry.concept],
    copy:result.entryCopy?result.entryCopy(entry):editorial.entries[entry.concept]||null,
    rows:entry.members.flatMap(member=>member.nodes).flatMap(node=>node.querySelectorAll('dt')).map(dt=>({label:dt.textContent,value:dt.nextElementSibling?.textContent||''})),
    paragraphs:entry.members.filter(member=>!member.professional).flatMap(member=>member.nodes).filter(node=>node.tagName==='P').map(node=>node.textContent)
  }));
}
module.exports={inventory};
if(require.main===module)console.log(JSON.stringify(inventory(),null,2));
