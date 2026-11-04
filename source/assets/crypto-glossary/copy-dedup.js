(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GlossaryCopy=api;})(typeof window==='undefined'?globalThis:window,function(){
  // Exact text equivalence only. Do not erase qualifiers, negations or scope.
  function key(text){return String(text).normalize('NFKC').replace(/\s+/g,'').trim();}
  function uniqueCopy(candidates,existing=[]){
    const seen=new Set(existing.filter(Boolean).map(key)),result=[];
    for(const text of candidates){if(!text?.trim())continue;const normalized=key(text);if(seen.has(normalized))continue;seen.add(normalized);result.push(text.trim());}
    return result;
  }
  return {key,uniqueCopy};
});
