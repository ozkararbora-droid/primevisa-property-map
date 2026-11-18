// Run from any directory: node --test manual-stock/portfolio.test.cjs
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(root,'portfolio-data.js'),'utf8');
const snapshot={generatedAt:'2026-11-18T13:10:58Z',unitCount:2,records:['A','B'].map(id=>({id,firm:'Firm',project:'Project',lat:38,lng:24,status:'Available'}))};
function api(fetch){const context=vm.createContext({fetch,console:{warn(){}}});vm.runInContext(src,context);return context.PVPortfolio;}
const reply=s=>({ok:true,json:async()=>JSON.parse(s)});
test('both published inventories are whole, valid JSON blobs',()=>{
 const a=api();
 for(const file of ['data.json','data.last-good.json']){
  const raw=fs.readFileSync(path.join(root,file),'utf8');
  assert.doesNotMatch(raw,/Warning: truncated output|…\d+ tokens truncated…|\.\.\. \d+ bytes omitted \.\.\./);
  a.validate(JSON.parse(raw));
 }
});
test('a good live inventory is used without consulting the fallback',async()=>{
 let calls=0;const a=api(async()=>{calls++;return reply(JSON.stringify(snapshot));});
 const {data,notice}=await a.load();assert.equal(notice,'');assert.equal(data.records.length,2);assert.equal(calls,1);
});
test('both malformed JSON and valid but incomplete JSON lead to a dated recovery notice',async()=>{
 for(const damaged of ['Warning: truncated output',JSON.stringify({...snapshot,records:snapshot.records.slice(0,1)}),JSON.stringify({...snapshot,records:[snapshot.records[0],snapshot.records[0]]})]){
  const a=api(async url=>reply(url.includes('last-good')?JSON.stringify(snapshot):damaged));
  const {data,notice}=await a.load();assert.equal(data.records.length,2);assert.match(notice,/Son doğrulanmış.*2026/);
 }
});
test('if neither copy is usable, the load fails rather than displaying an empty portfolio',async()=>{
 await assert.rejects(api(async()=>reply('{}')).load());
});
test('a manual check is all-or-nothing, even when one status would change',()=>{
 const a=api(),records=structuredClone(snapshot.records),original=structuredClone(records);
 for(const units of [
  [{id:'A',status:'Sold'}],
  [{id:'A',status:'Sold'},{id:'A',status:'Reserved'}],
  [{id:'A',status:'Sold'},{id:'B',status:'unknown'}],
  [{id:'A',status:'Sold'},{id:'B',status:'Reserved'},{id:'C',status:'Available'}],
 ]){
  assert.throws(()=>a.applyStatuses(records,units));assert.deepEqual(records,original);
 }
 assert.equal(a.applyStatuses(records,[{id:'A',status:'Sold'},{id:'B',status:'Check'}]),2);
 assert.deepEqual(records.map(r=>r.status),['Sold','Check']);
});
