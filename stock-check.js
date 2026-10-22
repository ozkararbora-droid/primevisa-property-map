(()=>{
 const b=document.getElementById('stockCheckBtn');if(!b)return;
 const KEY='pv-master-endpoint';
 const d=document.createElement('dialog');d.className='stock-check-dialog';
 d.innerHTML='<h2>Portföy Güncelleme Bağlantısı</h2><p>Bir defalık kurulum: PrimeVisa Property Master için yayımladığınız Google Apps Script web uygulaması adresini girin.</p><input id="stockEndpoint" type="url" placeholder="https://script.google.com/macros/s/…/exec" style="width:100%;padding:10px"><p id="stockSetupMessage" role="status"></p><button id="stockConnect" type="button">Bağlan ve kontrol et</button> <button id="stockClose" type="button">Kapat</button><p class="stock-note">Yalnızca ana tablodaki müsaitlik durumları okunur. Firma kaynakları ayrı ayrı taranmaz.</p>';
 document.body.append(d);
 d.querySelector('#stockClose').onclick=()=>d.close();
 const valid=u=>/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(u);
 const jsonp=url=>new Promise((resolve,reject)=>{
  const name='pvStock_'+Date.now()+'_'+Math.random().toString(36).slice(2),s=document.createElement('script');
  let timer;
  const clean=()=>{clearTimeout(timer);s.remove();delete window[name]};
  window[name]=value=>{clean();resolve(value)};
  s.onerror=()=>{clean();reject(Error('Ana tabloya erişilemedi. Bağlantı ayarını kontrol edin.'))};
  timer=setTimeout(()=>{clean();reject(Error('Kontrol zaman aşımına uğradı.'))},45000);
  s.src=url+'?callback='+name+'&_='+Date.now();document.head.append(s);
 });
 async function run(){
  const endpoint=localStorage.getItem(KEY)||'';
  if(!valid(endpoint)){d.showModal();return}
  b.disabled=true;b.dataset.state='checking';b.textContent='↻ Kontrol ediliyor…';
  try{
   const response=await jsonp(endpoint);
   if(!response.ok||!Array.isArray(response.units))throw Error(response.error||'Geçersiz kaynak yanıtı');
   if(!window.PVApplyMasterStock)throw Error('Harita henüz hazır değil; tekrar deneyin.');
   const count=window.PVApplyMasterStock(response.units);
   b.dataset.state='success';b.textContent='✓ Portföy Güncel';
   b.title=count+' ev ana tabloyla eşleştirildi · '+new Date().toLocaleTimeString('tr-TR')+' · Bu oturum için güncellendi';
  }catch(e){b.dataset.state='unavailable';b.textContent='⚠ Güncelleme Gerekli';b.title=e.message;d.querySelector('#stockSetupMessage').textContent=e.message;d.querySelector('#stockEndpoint').value=endpoint;d.showModal()}
  finally{b.disabled=false}
 }
 d.querySelector('#stockConnect').onclick=()=>{const u=d.querySelector('#stockEndpoint').value.trim();if(!valid(u)){d.querySelector('#stockSetupMessage').textContent='Geçerli bir Google Apps Script /exec adresi girin.';return}localStorage.setItem(KEY,u);d.close();run()};
 b.onclick=run;
 b.addEventListener('contextmenu',e=>{e.preventDefault();d.querySelector('#stockEndpoint').value=localStorage.getItem(KEY)||'';d.showModal()});
})();
