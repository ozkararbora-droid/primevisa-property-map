/* Map and offer must use a whole portfolio. A partial set is not a stock update. */
(()=>{
 function validate(data){
  if(!data || !Array.isArray(data.records) || !Number.isSafeInteger(data.unitCount) ||
     data.unitCount<1 || data.records.length!==data.unitCount)throw Error('Eksik portföy.');
  const ids=new Set();
  for(const r of data.records){
   if(!r || typeof r.id!=='string' || !r.id.trim() || ids.has(r.id) ||
      typeof r.firm!=='string' || typeof r.project!=='string' ||
      !Number.isFinite(r.lat) || Math.abs(r.lat)>90 || !Number.isFinite(r.lng) || Math.abs(r.lng)>180)
    throw Error('Geçersiz portföy kaydı.');
   ids.add(r.id);
  }
  return data;
 }
 async function read(file){
  const response=await fetch('./'+file+'?v='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw Error('Portföy alınamadı: '+response.status);
  return validate(await response.json());
 }
 async function load(){
  try{return {data:await read('data.json'),notice:''}}catch(primaryError){
   console.warn('Güncel portföy okunamadı.',primaryError);
   const data=await read('data.last-good.json'),when=new Date(data.generatedAt);
   const date=Number.isFinite(when.getTime())?when.toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',dateStyle:'short',timeStyle:'short'}):'';
   return {data,notice:'Son doğrulanmış portföy gösteriliyor'+(date?' · '+date:'')+'.'};
  }
 }
 async function images(){
  try{
   const result=await fetch('./project-images.json',{cache:'no-cache'});
   if(result.ok){const manifest=await result.json();if(Array.isArray(manifest?.projects))return manifest.projects;}
  }catch{/* Optional; the UI provides fallback project images. */}
  return [];
 }
 // Check the whole master (including homes outside the presentation budget)
 // before changing a single record or allowing the green "current" state.
 function applyStatuses(records,units){
  const allowed=new Set(['Available','Reserved','Booked','On Hold','Under Offer','Locked','Sold','Check','Check Availability']);
  if(!Array.isArray(units)||!units.length)throw Error('Ana tablodan stok listesi alınamadı.');
  const byId=new Map();
  for(const u of units){
   if(!u||typeof u.id!=='string'||!u.id.trim()||byId.has(u.id)||!allowed.has(u.status))
    throw Error('Ana tabloda eksik, tekrarlanan veya tanınmayan durum var. Güncelleme uygulanmadı.');
   byId.set(u.id,u.status);
  }
  const missing=records.filter(r=>!byId.has(r.id));
  if(missing.length)throw Error(missing.length+' konut ana tabloda bulunamadı. Güncelleme uygulanmadı.');
  if(byId.size!==records.length)throw Error('Ana tablodaki ve yayımlanan portföydeki konut listeleri farklı. Güncelleme uygulanmadı.');
  for(const r of records)r.status=byId.get(r.id);
  return records.length;
 }
 globalThis.PVPortfolio={load,images,validate,applyStatuses};
})();
