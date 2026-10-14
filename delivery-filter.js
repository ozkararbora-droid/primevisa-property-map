/* Delivery presets use Istanbul's calendar date; elapsed estimates do not prove completion. */
(()=>{
const today=(now=new Date())=>{
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const value=type=>parts.find(p=>p.type===type).value;
 return value('year')+'-'+value('month')+'-'+value('day');
};
const addMonths=(iso,months)=>{
 const [y,m,d]=iso.split('-').map(Number),first=new Date(Date.UTC(y,m-1+months,1));
 const last=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
 first.setUTCDate(Math.min(d,last));return first.toISOString().slice(0,10);
};
const isReady=r=>/^(completed|delivered|ready|ready to move in|tamamlandı|teslim edildi|hazır)$/i.test(String(r.delivery||'').trim());
const matches=(r,mode,start=today())=>{
 if(mode==='all')return true;
 if(mode==='ready')return isReady(r);
 if(mode!=='six'||isReady(r))return false;
 const date=String(r.deliveryDate||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
 const parsed=new Date(date+'T00:00:00Z');
 return !Number.isNaN(parsed.getTime())&&parsed.toISOString().slice(0,10)===date&&date>=start&&date<=addMonths(start,6);
};
globalThis.PVDelivery={today,addMonths,isReady,matches};
})();
