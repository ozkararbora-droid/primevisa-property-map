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
 if(!Number.isFinite(amount)||amount<=0||!Number.isFinite(rate)||rate<=0||rate>1)return {rate:null,years:null,monthly:null,annual:null,total:null,assumed};
 const annual=amount*rate;
 return {rate,years,monthly:annual/12,annual,total:years>0?annual*years:null,assumed};
}
globalThis.PVRental={calculate};
})();
