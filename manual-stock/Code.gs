// Deploy this as a Web App: execute as owner, allow Anyone.
// Only public portfolio identifiers and statuses are returned; no commissions.
function doGet(e) {
 const cb=String(e.parameter.callback||'');
 if(!/^pvStock_[a-zA-Z0-9_]+$/.test(cb))return ContentService.createTextOutput('Invalid callback');
 let result;
 try {
  const sheet=SpreadsheetApp.openById('1iyn8RU5zgG4CkkA8rma-Riz7pq7r65ERTkpcenSh_YA').getSheetByName('Master Stock');
  SpreadsheetApp.flush();
  const data=sheet.getRange(1,1,sheet.getLastRow(),17).getDisplayValues();
  if(data[0][0]!=='Unique ID'||data[0][16]!=='Status')throw Error('Unexpected column layout');
  const units=data.slice(1).filter(r=>r[0]&&r[1]&&r[2]&&r[3]).map(r=>({id:r[0].trim(),status:r[16].trim()}));
  if(!units.length)throw Error('No property rows');
  result={ok:true,source:'PrimeVisa Property Master',checkedAt:new Date().toISOString(),units};
 }catch(err){result={ok:false,error:'Ana tablo okunamadı. Dosya erişimini ve Master Stock sekmesini kontrol edin.'};}
 return ContentService.createTextOutput(cb+'('+JSON.stringify(result)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
