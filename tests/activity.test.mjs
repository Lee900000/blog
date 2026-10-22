import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
test('activity separates publication, explicit updates and maintenance without leaking held articles', () => {
  const { summarize } = require('../tools/activity.cjs');
  const result = summarize([
    {source:'source/_posts/a.md', date:'2025-01-02', updated:'2025-01-03', categories:['技术']},
    {source:'source/_posts/b.md', date:'2025-01-03', categories:['随笔']},
    {source:'source/_posts/237.md', legacy_id:237, date:'2025-01-03'}
  ], [
    {date:'2025-01-03', files:[['M','source/_posts/a.md'],['M','source/css/leon.css']]},
    {date:'2025-01-03', files:[['M','source/_posts/a.md']]},
    {date:'2025-01-04', files:[['M','tests/test.mjs']]}
  ], '2025-01-05');
  assert.equal(result.articles,2);
  assert.deepEqual(result.days['2025-01-03'],{publish:1,update:2,maintenance:1});
  assert.equal(result.days['2025-01-04'],undefined);
});
test('same-day explicit update counts separately; future and equal timestamps do not', () => {
  const { summarize } = require('../tools/activity.cjs');
  const result=summarize([
    {source:'a',date:'2025-01-01 09:00:00',updated:'2025-01-01 10:00:00'},
    {source:'b',date:'2025-01-02',updated:'2025-01-02'},
    {source:'c',date:'2030-01-01'}
  ],[], '2025-01-05');
  assert.deepEqual(result.days['2025-01-01'],{publish:1,update:1,maintenance:0});
  assert.equal(result.days['2025-01-02'].update,0);
  assert.equal(result.days['2030-01-01'],undefined);
});
test('mass migrations count once as maintenance, not as individual writing updates', () => {
  const { summarize } = require('../tools/activity.cjs');
  const posts=Array.from({length:51},(_,i)=>({source:`source/_posts/${i}.md`,date:'2020-01-01'}));
  const result=summarize(posts,[{date:'2025-01-01',files:posts.map(p=>['M',p.source])}],'2025-01-02');
  assert.deepEqual(result.days['2025-01-01'],{publish:0,update:0,maintenance:1});
});
