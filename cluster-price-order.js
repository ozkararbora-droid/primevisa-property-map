/* Leaflet.markercluster 1.5.3 adapter: keep geometry and animation, order homes by price. */
(()=>{
 const price=marker=>{const value=marker.options.pvPrice;return typeof value==='number'&&Number.isFinite(value)&&value>0?value:Infinity};
 function order(markers,positions,center,spiral){
  const sorted=markers.slice().sort((a,b)=>{
   const pa=price(a),pb=price(b);
   if(pa!==pb)return pa<pb?-1:1;
   return String(a.options.pvId||'').localeCompare(String(b.options.pvId||''));
  });
  const slots=positions.map((point,index)=>({index,distance:(point.x-center.x)**2+(point.y-center.y)**2}));
  // Circle positions have no inner/outer distinction: retain their clockwise order.
  if(spiral)slots.sort((a,b)=>a.distance-b.distance||a.index-b.index);
  const arranged=new Array(markers.length);
  slots.forEach((slot,rank)=>{arranged[slot.index]=sorted[rank]});
  return arranged;
 }
 for(const Cluster of [L.MarkerCluster,L.MarkerClusterNonAnimated]){
  const original=Cluster.prototype._animationSpiderfy;
  Cluster.include({_animationSpiderfy:function(markers,positions){
   if(this._group.options.pvSortByPrice){
    const center=this._group._map.latLngToLayerPoint(this._latlng);
    markers=order(markers,positions,center,markers.length>=this._circleSpiralSwitchover);
   }
   return original.call(this,markers,positions);
  }});
 }
})();
