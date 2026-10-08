import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source = () => readFileSync('source/js/works.js', 'utf8');
const api = () => { const context = {URL, AbortSignal}; vm.runInNewContext(source(), context); return context.LeonWorks; };
test('works only includes selected public projects sorted by stars then selection order', () => {
  const repos = [{name:'monitor',private:false,stargazers_count:2}, {name:'LazyCat',private:false,stargazers_count:8}, {name:'other',private:false,stargazers_count:999}, {name:'quant-tool',private:true,stargazers_count:100}, {name:'go-skill',private:false,stargazers_count:2}];
  assert.equal(api().select(repos).map(r => r.name).join(','), 'LazyCat,go-skill,monitor');
  assert.equal(api().selected.length, 15);
});
test('works loads all public repository pages and rejects API failures', async () => {
  const urls = [];
  const result = await api().load(async url => { urls.push(url); return {ok:true,json:async () => urls.length === 1 ? Array.from({length:100}, () => ({name:'repo'})) : [{name:'last'}]}; });
  assert.equal(result.length, 101);
  assert.match(urls[1], /page=2/);
  await assert.rejects(api().load(async () => ({ok:false,status:403})), /403/);
});
test('works page and profile are connected without changing publishing identity', () => {
  assert.match(readFileSync('source/works/index.md','utf8'), /id="works-grid"/);
  assert.match(readFileSync('_config.butterfly.yml','utf8'), /代表作品: \/works\//);
  assert.match(readFileSync('source/about/index.md','utf8'), /GitHub：\[github.com\/kary2999\]/);
  assert.match(readFileSync('tools/publish-leon-root.mjs','utf8'), /EXPECTED_ACCOUNT = 'leon-book'/);
});
