/* Same-building alternatives; raw source statuses remain unchanged. */
(()=> {
 const norm=v=>String(v??'').normalize('NFKC').trim().toLocaleLowerCase('tr-TR').replace(/\s+/g,' ');
 const building=r=>r.buildingId??r.building??r.block??'';
 const sameBuilding=(a,b)=>{
  if(!norm(a.firm)||!norm(a.project)||norm(a.firm)!==norm(b.firm)||norm(a.project)!==norm(b.project))return false;
  if(norm(building(a))!==norm(building(b)))return false;
  if(norm(a.address)&&norm(b.address)&&norm(a.address)!==norm(b.address))return false;
  return true;
 };
 const find=(selected,records)=> {
  if(typeof selected.price!=='number'||!Number.isFinite(selected.price))return [];
  return records.filter(r=>r.id!==selected.id&&sameBuilding(selected,r)&&['Available','Check','Check Availability'].includes(r.status)&&typeof r.price==='number'&&Number.isFinite(r.price)&&r.price>=selected.price&&r.price<=selected.price+10000)
   .sort((a,b)=>a.price-b.price||String(a.unit??'').localeCompare(String(b.unit??''),'tr',{numeric:true}));
 };
 const extremes=(selected,records)=>{
 const list=records.filter(r=>norm(r.firm)&&norm(r.project)&&norm(r.firm)===norm(selected.firm)&&norm(r.project)===norm(selected.project)&&['Available','Check','Check Availability'].includes(r.status)&&typeof r.price==='number'&&Number.isFinite(r.price)).sort((a,b)=>a.price-b.price||String(a.unit??'').localeCompare(String(b.unit??''),'tr',{numeric:true}));
 return list.length?[list[0],list[list.length-1]]:[];
};
const api={find,sameBuilding,extremes};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else window.PVAlternatives=api;
})();