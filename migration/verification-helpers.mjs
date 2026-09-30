import hexoUtil from 'hexo-util';
const {stripIndent}=hexoUtil;
export const expectedHighlightedCode=text=>stripIndent(text).replace(/\n+$/,'');
export const renderedCode=($,element)=>$(element).find('span.line').map((i,e)=>$(e).text()).get().join('\n').replace(/\n+$/,'');
export function markdownCodes(source){
 return [...source.matchAll(/^([ \t>]*)(`{3,})([^\n]*)\n([\s\S]*?)\n\1\2[ \t]*$/gm)].filter(m=>m[3]!=='mermaid').map(m=>m[4].split('\n').map(line=>line.startsWith(m[1])?line.slice(m[1].length):line).join('\n'));
}
