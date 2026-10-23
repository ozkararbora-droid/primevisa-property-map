/* Annual rental rate is applied to the sale price; no escalation or compounding. */
(()=>{
function calculate(price,value){
 const text=String(value??'').trim(),percent=text.match(/(\d+(?:[.,]\d+)?)\s*%/);
 const fraction=/^0[.,]\d+$/.test(text)?Number(text.replace(',','.')):null;
 const specified=percent?Number(percent[1].replace(',','.'))/100:fraction;
 const assumed=!Number.isFinite(specified)||specified<=0||specified>1;
 const rate=assumed?.03:specified;
 const duration=text.match(/(\d+(?:[.,]\d+)?)\s*(?:years?|yrs?|yıl)\b/i);
 const years=duration&&!/property management|mülk yönetimi/i.test(text)?Number(duration[1].replace(',','.')):null;
 const amount=Number(price);
 const range=text.match(/Tahmini aylık\s+(\d+)\s*[–-]\s*(\d+)\s*EUR/i);
 if(range){
  const low=Number(range[1]),high=Number(range[2]);
  if(low>0&&high>=low)return {rate:null,years,monthly:null,annual:null,total:null,assumed:false,sourceEstimate:true,monthlyRange:[low,high],annualRange:[low*12,high*12],totalRange:years>0?[low*12*years,high*12*years]:null,rateRange:amount>0?[low*12/amount,high*12/amount]:null};
 }

 if(!Number.isFinite(amount)||amount<=0||!Number.isFinite(rate)||rate<=0||rate>1)return {rate:null,years:null,monthly:null,annual:null,total:null,assumed};
 const annual=amount*rate;
 return {rate,years,monthly:annual/12,annual,total:years>0?annual*years:null,assumed};
}

function describe(price,value){
 const r=calculate(price,value),money=v=>v==null?'—':new Intl.NumberFormat('tr-TR',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(v),num=v=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2}).format(v);
 const range=v=>v?money(v[0])+' – '+money(v[1]):null;
 return {monthly:range(r.monthlyRange)||money(r.monthly),annual:range(r.annualRange)||money(r.annual),total:range(r.totalRange)||(r.years?money(r.total):'Süre belirtilmemiş'),totalLabel:r.years?num(r.years)+' yıl tahmini toplam':'Tahmini toplam',
 heading:r.sourceEstimate?'Broşür kira tahmini':r.rate==null?'Oran belirtilmemiş':'Yıllık brüt %'+num(r.rate*100)+(r.assumed?' · varsayım':''),
 note:r.sourceEstimate?'Broşürdeki aylık tahmin × 12 ile yıllık hesaplanır. Kira garantisi değildir; vergi ve giderler düşülmemiştir.':'Sabit oranla brüt projeksiyondur; kira garantisi değildir. Vergi ve giderler düşülmemiştir.',
 rate:r.rateRange?'%'+num(r.rateRange[0]*100)+' – %'+num(r.rateRange[1]*100):r.rate==null?'—':'%'+num(r.rate*100)+(r.assumed?' (varsayım)':'')};
}
globalThis.PVRental={calculate,describe};
})();
