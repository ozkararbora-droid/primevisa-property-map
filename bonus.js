(()=>{
 const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
 const project=r=>{
  if(normalize(r.firm)!=='oikos')return null;
  const name=normalize(r.project).replace(/^the /,'');
  return name==='meridia'||name==='boulevard'?name:null;
 };
 const available=r=>!!project(r)&&normalize(r.status)==='available';
 const expenses=r=>{
  const name=project(r),price=Number(r.price);
  if(!name||!Number.isFinite(price)||price<=0)return null;
  return {project:name,original:price*.10,payable:name==='meridia'?0:price*.03,covered:name==='meridia'?100:70};
 };
 globalThis.PVBonus={project,available,expenses};
})();
