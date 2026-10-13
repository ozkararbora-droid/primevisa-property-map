/* Shared, browser-local shortlist. No customer data is sent to a server. */
(()=>{
 const key='primevisa:favorites:v1';
 const read=()=>{try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?[...new Set(a.filter(x=>typeof x==='string'))]:[]}catch{return []}};
 let ids=read();
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function sync(){document.querySelectorAll('[data-favorite]').forEach(b=>{const active=ids.includes(b.dataset.favorite);b.setAttribute('aria-pressed',String(active));b.innerHTML=`<span aria-hidden="true">${active?'★':'☆'}</span> ${active?'Favorilerimde':'Favorilere ekle'}`});const c=document.getElementById('favoriteCount');if(c)c.textContent=ids.length;}
 function save(next){ids=next;try{localStorage.setItem(key,JSON.stringify(ids))}catch{const note=document.getElementById('favoriteNotice')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'favoriteNotice',className:'favorite-notice',role:'status'}));note.textContent='Tarayıcı seçimleri kaydedemiyor. Karşılaştır düğmesi mevcut seçimlerinizi yine açar.';}sync();window.dispatchEvent(new Event('pv:favorites'));}
 window.PVFavorites={ids:()=>[...ids],remove:id=>save(ids.filter(x=>x!==id)),button:id=>`<button type="button" class="favorite-button" data-favorite="${esc(id)}" aria-pressed="${ids.includes(id)}"><span aria-hidden="true">${ids.includes(id)?'★':'☆'}</span> ${ids.includes(id)?'Favorilerimde':'Favorilere ekle'}</button>`};
 document.addEventListener('click',e=>{const b=e.target.closest('[data-favorite]');if(b){e.stopPropagation();const id=b.dataset.favorite;save(ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);}const a=e.target.closest('#compare');if(a)a.href='./compare.html#ids='+encodeURIComponent(JSON.stringify(ids));});
 window.addEventListener('storage',e=>{if(e.key===key||e.key===null){ids=read();sync();window.dispatchEvent(new Event('pv:favorites'));}});sync();
})();
