(()=>{
 const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
 const project=r=>{
  if(normalize(r.firm)!=='oikos')return null;
  const name=normalize(r.project).replace(/^the /,'');
  return name==='meridia'||name==='boulevard'?name:null;
 };
 const available=r=>!!project(r)&&normalize(r.status)==='available';
 // Shared by portfolio cards, map popups and comparison offers. Rates are
 // percentages of the sale price; the supported buyer rate is set separately.
 const minRate=9,maxRate=11;
 const estimate=r=>{
  const price=Number(r.price);
  if(!Number.isFinite(price)||price<=0)return null;
  const min=price*minRate/100,max=price*maxRate/100,name=project(r);
  let support=null;
  if(name){
   const payableRate=name==='meridia'?0:3;
   support={project:name,original:max,payable:price*payableRate/100,payableRate,covered:name==='meridia'?100:70};
  }
  return {min,max,support};
 };
 globalThis.PVPurchaseCosts={estimate,minRate,maxRate};
 globalThis.PVBonus={project,available,expenses:r=>estimate(r)?.support??null};
})();
