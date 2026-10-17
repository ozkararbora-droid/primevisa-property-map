/* Fit each offer sheet before Safari/Chromium paginate it. */
(()=>{
 window.PVFitOfferPages=()=>{
  for(const page of document.querySelectorAll('.print-page')){
   if(!page.getBoundingClientRect().width)continue;
   const footer=page.querySelector('.letter-footer');
   let content=page.querySelector('.page-content');
   if(!content){
    content=document.createElement('div');content.className='page-content';
    const heading=page.querySelector('.proposal-heading'),body=page.querySelector('.proposal-body');
    if(!heading||!body||!footer)continue;
    heading.before(content);content.append(heading,body);
   }
   content.style.transform='none';content.style.height='auto';
   const available=footer.offsetTop-content.offsetTop-10;
   const natural=content.scrollHeight;
   if(available<=0||!natural)continue;
   const scale=Math.min(1,available/natural);
   content.style.transform='scale('+scale+')';
   content.style.transformOrigin='top left';
   content.style.height=(natural*scale)+'px';
   page.dataset.fitScale=scale.toFixed(3);
  }
 };
 window.addEventListener('beforeprint',()=>window.PVFitOfferPages());
})();
