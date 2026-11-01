(function(){
const $=s=>document.querySelector(s);
const fmt=(v,d=2)=>v==null?'–':(typeof v==='number'?(Math.abs(v)>=1000?v.toFixed(0):v.toFixed(d)):v);
const pct=v=>v==null?'–':v.toFixed(1)+'%';
const flag=v=>v?'<span class="y">Y</span>':'<span class="n">–</span>';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ema=v=>v&&v.includes('bull')?'<span class="y">'+v+'</span>':(v==='8>21'?'<span class="y">8>21</span>':'<span class="n">'+esc(v)+'</span>');
const COLS=[
 ['ticker','Ticker',r=>'<b>'+esc(r.ticker)+'</b>','l'],['sector','Sector',r=>esc(r.sector||'ETF'),'l'],['price','Price',r=>fmt(r.price)],
 ['setup_score','Setup',r=>fmt(r.setup_score,0)],['value_score','Value',r=>fmt(r.value_score,0)],['combined','Comb',r=>fmt(r.combined,0)],
 ['trigger','Trigger',r=>fmt(r.trigger)],['stop','Stop',r=>fmt(r.stop)],['to_trigger_pct','To trig',r=>pct(r.to_trigger_pct)],
 ['risk_pct','Risk %',r=>pct(r.risk_pct)],['rvol50','RVOL 50d',r=>fmt(r.rvol50)],['rvol3d','RVOL 3d',r=>fmt(r.rvol3d)],
 ['tight_range','Tight',r=>flag(r.tight_range)],['breaking_out','Breakout',r=>flag(r.breaking_out)],['ema_8_21','8/21',r=>ema(r.ema_8_21),'l'],
 ['fwd_pe','Fwd P/E',r=>fmt(r.fwd_pe,1)],['peg','PEG',r=>fmt(r.peg)],['off_52w_high_pct','Off 52w hi',r=>pct(r.off_52w_high_pct)]];
function table(el,rows,cols,state){
 const th=cols.map(c=>'<th class="'+(c[3]||'')+'" data-k="'+c[0]+'">'+c[1]+(state&&state.k===c[0]?(state.d>0?' ▲':' ▼'):'')+'</th>').join('');
 el.innerHTML='<thead><tr>'+th+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+cols.map(c=>'<td class="'+(c[3]||'')+'">'+c[2](r)+'</td>').join('')+'</tr>').join('')+'</tbody>';
}
function sortable(el,getRows,cols,state){
 el.addEventListener('click',e=>{const t=e.target.closest('th');if(!t)return;const k=t.dataset.k;
  state.d=state.k===k?-state.d:(['ticker','sector','ema_8_21','to_trigger_pct'].includes(k)?1:-1);state.k=k;render();});
 function render(){const rows=getRows().slice().sort((a,b)=>{const x=a[state.k],y=b[state.k];if(x==null)return 1;if(y==null)return -1;
  return (x>y?1:x<y?-1:0)*state.d;});table(el,rows,cols,state);return rows.length;}
 return render;
}
fetch('data/scan.json').then(r=>r.json()).then(D=>{
 const dd=new Date(D.data_date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
 $('#meta').textContent='Data: '+dd+' close · Generated '+D.generated_et+' · '+D.scanned+' names scanned';
 if(D.gaps&&D.gaps.length)$('#gaps').textContent='Data gaps: '+D.gaps.join('; ');
 $('#cards').innerHTML=D.top_picks.map(r=>'<div class="card"><h3>'+esc(r.ticker)+' <span class="note" style="font-size:13px">'+esc(r.source)+' · Comb '+fmt(r.combined,0)+'</span></h3>'+
  '<div class="lv"><span>Trigger <b>'+fmt(r.trigger)+'</b></span><span>Stop <b>'+fmt(r.stop)+'</b></span><span>Risk '+pct(r.risk_pct)+'</span></div>'+
  '<p>'+esc(r.reason)+'</p></div>').join('');
 const vc=[COLS[0],['source','Source',r=>esc(r.source),'l'],COLS[2],COLS[10],COLS[11],COLS[6],COLS[7],COLS[9],COLS[5]];
 const vs={k:'rvol50',d:-1};sortable($('#voltbl'),()=>D.volume_breakouts,vc,vs)();
 const jb=D.rows.filter(r=>r.source.startsWith('JB'));
 const jc=[COLS[0],['source','List',r=>esc(r.source.replace('JB ','')),'l'],COLS[2],COLS[14],['higher_lows','Higher lows',r=>flag(r.higher_lows)],
  ['above_10w','>10w',r=>flag(r.above_10w)],['above_40w','>40w',r=>flag(r.above_40w)],COLS[12],['breakout_retest','Retest',r=>flag(r.breakout_retest)],
  COLS[3],COLS[5],COLS[6],COLS[8],COLS[17]];
 sortable($('#jbtbl'),()=>jb,jc,{k:'combined',d:-1})();
 const secs=[...new Set(D.rows.map(r=>r.sector).filter(Boolean))].sort();
 $('#fsec').insertAdjacentHTML('beforeend',secs.map(s=>'<option>'+esc(s)+'</option>').join(''));
 const filt=()=>{const q=$('#q').value.trim().toLowerCase(),src=$('#fsrc').value,sec=$('#fsec').value;
  return D.rows.filter(r=>(!q||(r.ticker+' '+(r.name||'')+' '+(r.sector||'')).toLowerCase().includes(q))&&(!src||r.source.includes(src))&&
   (!sec||r.sector===sec)&&(!$('#ftight').checked||r.tight_range)&&(!$('#fbo').checked||r.breaking_out)&&
   (!$('#fbull').checked||(r.ema_8_21==='8>21'||r.ema_8_21==='fresh bull cross')));};
 const ra=sortable($('#alltbl'),filt,COLS,{k:'combined',d:-1});
 const go=()=>{$('#count').textContent=ra()+' shown';};
 ['#q','#fsrc','#fsec','#ftight','#fbo','#fbull'].forEach(s=>$(s).addEventListener('input',go));go();
}).catch(e=>{$('#meta').textContent='Could not load data/scan.json ('+e+'). Serve over http(s), not file://.';});
})();
