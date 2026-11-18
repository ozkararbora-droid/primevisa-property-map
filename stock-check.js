(()=>{
 const b=document.getElementById('stockCheckBtn');if(!b)return;
 const KEY='pv-master-endpoint';
 const valid=u=>/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(u);
 let endpoint='',applyStock=null,busy=false,editing=true,retryEndpoint='';
 try{endpoint=localStorage.getItem(KEY)||'';}catch{/* Keep the connection in this tab when storage is unavailable. */}
 const d=document.createElement('dialog');d.className='stock-check-dialog';d.setAttribute('aria-labelledby','stockDialogTitle');
 d.innerHTML='<h2 id="stockDialogTitle"></h2><label id="stockEndpointLabel">PrimeVisa Property Master için yayımlanan Google Apps Script adresi<input id="stockEndpoint" type="url" placeholder="https://script.google.com/macros/s/…/exec"></label><p id="stockSetupMessage" role="status"></p><button id="stockConnect" type="button"></button> <button id="stockClose" type="button">Kapat</button><p class="stock-note">Bu kontrol konutların satış durumunu ana tablodan okur.</p>';
 document.body.append(d);
 const title=d.querySelector('#stockDialogTitle'),label=d.querySelector('#stockEndpointLabel'),input=d.querySelector('#stockEndpoint'),message=d.querySelector('#stockSetupMessage'),connect=d.querySelector('#stockConnect');
 function openDialog(setup,url,detail=''){
  editing=setup;retryEndpoint=url;
  title.textContent=setup?'Portföy Güncelleme Bağlantısı':'Stok kontrolü tamamlanamadı';
  label.hidden=!setup;input.value=url;message.textContent=detail;
  connect.textContent=setup?'Bağlan ve kontrol et':'Tekrar dene';
  if(!d.open)d.showModal();
 }
 d.querySelector('#stockClose').onclick=()=>d.close();
 const jsonp=url=>new Promise((resolve,reject)=>{
  const name='pvStock_'+Date.now()+'_'+Math.random().toString(36).slice(2),s=document.createElement('script');
  let timer;
  const clean=()=>{clearTimeout(timer);s.remove();delete window[name]};
  window[name]=value=>{clean();resolve(value)};
  s.onerror=()=>{clean();reject(Error('Ana tabloya erişilemedi. Bağlantı adresini kontrol edin.'))};
  timer=setTimeout(()=>{clean();reject(Error('Ana tablo zamanında yanıt vermedi. Tekrar deneyin.'))},45000);
  s.src=url+'?callback='+name+'&_='+Date.now();document.head.append(s);
 });
 async function run(url=endpoint){
  if(!applyStock||busy)return;
  if(!valid(url)){openDialog(true,url);return;}
  busy=true;b.disabled=true;b.dataset.state='checking';b.textContent='↻ Kontrol ediliyor…';
  let sourceRead=false;
  try{
   const response=await jsonp(url);
   if(response?.ok!==true||!Array.isArray(response.units)||!response.units.length)throw Error(response?.error||'Ana tablodan geçerli bir stok listesi alınamadı.');
   sourceRead=true;
   endpoint=url;try{localStorage.setItem(KEY,url)}catch{}
   const count=applyStock(response.units);
   b.dataset.state='success';b.textContent='✓ Portföy Güncel';
   b.title=count+' konutun satış durumu ana tabloyla eşleştirildi · '+new Date().toLocaleTimeString('tr-TR',{timeZone:'Europe/Istanbul'})+' · Bu oturum için güncellendi';
  }catch(error){
   b.dataset.state='unavailable';b.textContent='⚠ Kontrol tamamlanamadı';b.title=error.message;
   openDialog(!sourceRead,url,error.message);
  }finally{busy=false;b.disabled=false;}
 }
 connect.onclick=()=>{
  const url=editing?input.value.trim():retryEndpoint;
  if(!valid(url)){message.textContent='Geçerli bir Google Apps Script /exec adresi girin.';return;}
  d.close();run(url);
 };
 b.addEventListener('contextmenu',e=>{if(applyStock&&!busy){e.preventDefault();openDialog(true,endpoint)}});
 function ready(fn){
  b.disabled=false;
  if(typeof fn==='function'){
   applyStock=fn;b.dataset.state='idle';b.textContent='↻ Portföyü Güncelle';
   b.title='Konutların satış durumunu ana tabloyla karşılaştır';b.onclick=()=>run();
  }else{
   b.dataset.state='unavailable';b.textContent='↻ Portföyü yeniden yükle';
   b.title='Harita açılamadı. Portföyü tekrar yükleyin.';b.onclick=()=>location.reload();
  }
 }
 Promise.resolve(window.PVMapReady).then(ready,()=>ready(null));
})();
