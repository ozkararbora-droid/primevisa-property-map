/* Manual checks must not report success without a real source refresh. */
(()=>{
 const button=document.getElementById('stockCheckBtn');
 if(!button)return;
 const dialog=document.createElement('dialog');
 dialog.className='stock-check-dialog';
 dialog.setAttribute('aria-labelledby','stockCheckTitle');
 dialog.innerHTML='<h2 id="stockCheckTitle">Güncel Stok</h2><p role="status">Manuel kaynak kontrolü henüz bağlı değil.</p><p>Bu düğmenin tüm firmaların listelerini kontrol edebilmesi için stok güncelleme servisine bağlanması gerekiyor. Şu anda yeni bir kontrol başlatılmadı.</p><p class="stock-note">Saatlik otomatik kontrol ayrı çalışır. Bu düğme saatlik kontrolü değiştirmez.</p><form method="dialog"><button>Tamam</button></form>';
 document.body.append(dialog);
 button.addEventListener('click',()=>{
  button.dataset.state='unavailable';
  button.title='Manuel kontrol bağlantısı gerekli';
  dialog.showModal();
 });
})();