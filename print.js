/* Standalone, visible print document: no hidden print-only content. */
(()=>{
 const button=document.getElementById('printNow'),status=document.getElementById('printStatus');
 button.onclick=()=>{window.PVFitOfferPages?.();window.print()};
 window.addEventListener('load',async()=>{
  const pending=[...document.images].filter(image=>!image.complete);
  await Promise.race([Promise.all(pending.map(image=>new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true})}))),new Promise(resolve=>setTimeout(resolve,10000))]);
  if(document.fonts?.ready)await document.fonts.ready;
  const failed=[...document.images].filter(image=>!image.complete||!image.naturalWidth).length;
  status.textContent=failed?'Bazı görseller yüklenemedi. Teklif bilgileri yazdırılmaya hazır.':'Teklif hazır. Yazdır / PDF kaydet düğmesini kullanabilirsiniz.';
  button.disabled=false;
  // Let WebKit lay out the visible document before opening its print dialog.
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  window.PVFitOfferPages?.();
  if(!failed)window.print();
 },{once:true});
})();
