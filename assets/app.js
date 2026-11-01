(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NA='<span class="mut">—</span>';
const num=(v,d=2)=>v==null?NA:Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=(v,d=1)=>v==null?NA:Number(v).toFixed(d)+'%';
const signed=v=>v==null?NA:'<span class="'+(v>0?'up':v<0?'dn':'')+'">'+(v>0?'+':'')+Number(v).toFixed(1)+'%</span>';
const yes=v=>v?'<span class="bd g">Yes</span>':NA;
const rv=v=>v==null?NA:(v>=2?'<span class="up"><b>'+num(v)+'</b></span>':v>=1.5?'<span class="up">'+num(v)+'</span>':num(v));
const bull=v=>v==='8>21'||v==='fresh bull cross';
const ema=v=>v==='fresh bull cross'?'<span class="bd g">Fresh cross</span>':v==='8>21'?'<span class="bd g">8&gt;21</span>':v?'<span class="bd">'+esc(v)+'</span>':NA;
const maS=(d,up)=>d==null?NA:'<span class="bd '+(d>=0&&up?'g':d<0&&!up?'dn2':'')+'">'+(d>=0?'Above':'Below')+' · '+(up?'Rising':'Falling')+'</span>';
const srcLabel=s=>({SP500:'S&P 500',NDX:'Nasdaq-100',SP400:'S&P 400'}[s]||String(s||''));
function badges(r){const b=[];
 if(r.breaking_out)b.push('<span class="bd g">Breakout</span>');
 if(r.breakout_retest)b.push('<span class="bd b">Retest</span>');
 if(r.tight_range)b.push('<span class="bd a">Tight range</span>');
 if(r.ema_8_21==='fresh bull cross')b.push('<span class="bd g">Fresh 8/21 cross</span>');else if(r.ema_8_21==='8>21')b.push('<span class="bd g">8&gt;21</span>');
 if(r.ma_riding)b.push('<span class="bd b">Kissing '+esc(r.ma_riding.replace(/,/g,'/'))+'</span>');
 if(r.ath_breakout)b.push('<span class="bd g">ATH breakout</span>');
 if(r.higher_lows)b.push('<span class="bd">Higher lows</span>');
 if(r.rvol50!=null&&r.rvol50>=1.5)b.push('<span class="bd g">RVOL '+Number(r.rvol50).toFixed(1)+'×</span>');
 return b.join('');}
const C={
 ticker:['Ticker',r=>esc(r.ticker),'l tk'],name:['Name',r=>esc(r.name),'l nmc'],source:['Universe',r=>esc(srcLabel(r.source)),'l'],
 sector:['Sector',r=>esc(r.sector||'ETF'),'l'],price:['Last',r=>num(r.price)],
 setup_score:['Setup',r=>num(r.setup_score,0)],value_score:['Value',r=>num(r.value_score,0)],combined:['Score',r=>r.combined==null?NA:'<b>'+num(r.combined,0)+'</b>'],
 trigger:['Trigger',r=>num(r.trigger)],stop:['Stop',r=>num(r.stop)],to_trigger_pct:['To Trigger',r=>pct(r.to_trigger_pct)],risk_pct:['Stop Dist.',r=>pct(r.risk_pct)],
 rvol50:['RVOL 50d',r=>rv(r.rvol50)],rvol3d:['RVOL 3d',r=>num(r.rvol3d)],
 tight_range:['Tight',r=>r.tight_range?'<span class="bd a">Tight</span>':NA,'l'],breaking_out:['Breakout',r=>r.breaking_out?'<span class="bd g">Breakout</span>':NA,'l'],
 breakout_retest:['Retest',r=>r.breakout_retest?'<span class="bd b">Retest</span>':NA,'l'],ema_8_21:['8/21 EMA',r=>ema(r.ema_8_21),'l'],
 higher_lows:['Higher Lows',r=>yes(r.higher_lows),'l'],above_10w:['>10W',r=>yes(r.above_10w),'l'],above_40w:['>40W',r=>yes(r.above_40w),'l'],
 ma_riding:['Riding',r=>r.ma_riding?r.ma_riding.split(',').map(m=>'<span class="bd b">'+esc(m)+'</span>').join(' '):NA,'l'],
 ma_stop:['MA Stop',r=>num(r.ma_stop)],ma_stop_pct:['Stop Dist.',r=>pct(r.ma_stop_pct)],
 sma200_rising:['200D',r=>maS(r.vs_sma200_pct,r.sma200_rising),'l'],sma40w_rising:['40W',r=>maS(r.vs_sma40w_pct,r.sma40w_rising),'l'],
 ath_prior:['Prior ATH',r=>num(r.ath_prior)],pct_from_ath:['vs ATH',r=>pct(r.pct_from_ath)],day_low:['Stop (Day Low)',r=>num(r.day_low)],day_low_pct:['Stop Dist.',r=>pct(r.day_low_pct)],
 major_level_name:['Level Broken',r=>esc(r.major_level_name),'l'],major_level:['Level',r=>num(r.major_level)],above_level_pct:['Above Level',r=>r.above_level_pct==null?NA:'<span class="up">+'+Number(r.above_level_pct).toFixed(1)+'%</span>'],
 fwd_pe:['Fwd P/E',r=>num(r.fwd_pe,1)],peg:['PEG',r=>num(r.peg)],target_upside_pct:['Tgt Upside',r=>signed(r.target_upside_pct)],off_52w_high_pct:['vs 52W High',r=>pct(r.off_52w_high_pct)]
};
C.vs_sma200_pct=['vs 200D',r=>pct(r.vs_sma200_pct)];
const TXT=new Set(['ticker','name','source','sector','ema_8_21','ma_riding','major_level_name']);
function grid(el,getRows,keys,state){
 function render(){
  const k=state.k,d=state.d;
  const rows=getRows().slice().sort((a,b)=>{let x=a[k],y=b[k];if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;
   if(typeof x==='boolean'){x=+x;y=+y;}return (x>y?1:x<y?-1:0)*d;});
  el.innerHTML='<thead><tr>'+keys.map(c=>'<th scope="col" class="'+(C[c][2]||'')+(c===k?' on':'')+'" data-k="'+c+'">'+C[c][0]+(c===k?'<span class="ar">'+(d>0?'▲':'▼')+'</span>':'')+'</th>').join('')+'</tr></thead><tbody>'+
   (rows.length?rows.map(r=>'<tr>'+keys.map(c=>'<td class="'+(C[c][2]||'')+'">'+C[c][1](r)+'</td>').join('')+'</tr>').join(''):'<tr><td class="l mut" colspan="'+keys.length+'">No matching names.</td></tr>')+'</tbody>';
  return rows.length;}
 el.addEventListener('click',e=>{const t=e.target.closest('th');if(!t)return;const c=t.dataset.k;
  state.d=state.k===c?-state.d:(TXT.has(c)||c==='to_trigger_pct'?1:-1);state.k=c;render();if(state.cb)state.cb();});
 return render;}
fetch('data/scan.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(D=>{
 const dd=new Date(D.data_date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
 $('#hdate').textContent=dd+' close';$('#huni').textContent=D.scanned.toLocaleString()+' names';$('#hgen').textContent=D.generated_et;
 const bo=D.rows.filter(r=>r.breaking_out).length;
 $('#k1').textContent=D.scanned.toLocaleString();$('#k1s').textContent='of '+(D.universe||D.scanned).toLocaleString()+' in universe after liquidity filter';
 $('#k2').textContent=D.top_picks.length;$('#k3').textContent=D.volume_breakouts.length;$('#k4').textContent=bo;
 if(D.gaps&&D.gaps.length)$('#gaps').textContent='Data gaps: '+D.gaps.join('; ');
 $('#cards').innerHTML=D.top_picks.map(r=>'<article class="card"><div class="ch"><span class="tk">'+esc(r.ticker)+'</span><span class="score">Score <b>'+num(r.combined,0)+'</b></span></div>'+
  '<div class="nm" title="'+esc(r.name)+'">'+esc(r.name)+' · '+esc(srcLabel(r.source))+'</div>'+
  '<div class="lv"><div><span>Trigger</span><b>'+num(r.trigger)+'</b></div><div><span>Stop</span><b>'+num(r.stop)+'</b></div><div><span>Stop dist.</span><b>'+pct(r.risk_pct)+'</b></div></div>'+
  '<div class="badges">'+badges(r)+'</div></article>').join('');
 grid($('#voltbl'),()=>D.volume_breakouts,['ticker','name','source','sector','price','rvol50','rvol3d','trigger','stop','risk_pct','ema_8_21','combined'],{k:'rvol50',d:-1})();
 const kb=D.kissing_ma||[],kr=()=>{const m=(document.querySelector('input[name=fma]:checked')||{}).value;return kb.filter(r=>!m||r.ma_riding.split(',').includes(m));};
 const kst={k:'setup_score',d:-1};const rk=grid($('#kisstbl'),kr,['ticker','name','sector','price','ma_riding','vs_sma200_pct','tight_range','ema_8_21','setup_score','combined','trigger','ma_stop','ma_stop_pct','rvol3d'],kst);
 C.vs_sma200_pct=C.vs_sma200_pct||['vs 200D',r=>pct(r.vs_sma200_pct)];
 const kgo=()=>{$('#kcount').textContent=rk()+' of '+kb.length+' shown';};kst.cb=kgo;document.querySelectorAll('input[name=fma]').forEach(e=>e.addEventListener('change',kgo));kgo();
 const bc=['ticker','name','sector','price','rvol50','ath_prior','pct_from_ath','day_low','day_low_pct','ema_8_21','combined'];
 grid($('#athtbl'),()=>D.ath_breakouts||[],bc,{k:'rvol50',d:-1})();
 grid($('#nathtbl'),()=>D.near_ath||[],['ticker','name','sector','price','ath_prior','pct_from_ath','tight_range','ema_8_21','sma200_rising','combined'],{k:'pct_from_ath',d:-1})();
 grid($('#majtbl'),()=>D.major_breakouts||[],['ticker','name','sector','price','rvol50','major_level_name','major_level','above_level_pct','day_low','day_low_pct','ema_8_21','combined'],{k:'rvol50',d:-1})();
 $('#k5').textContent=kb.length;$('#k6').textContent=(D.ath_breakouts||[]).length+' / '+(D.major_breakouts||[]).length;
 const ai=D.rows.filter(r=>String(r.source).startsWith('AI'));
 grid($('#aitbl'),()=>ai,['ticker','name','price','ema_8_21','higher_lows','above_10w','above_40w','tight_range','breakout_retest','setup_score','combined','trigger','to_trigger_pct','off_52w_high_pct'],{k:'combined',d:-1})();
 const secs=[...new Set(D.rows.map(r=>r.sector).filter(Boolean))].sort();
 $('#fsec').insertAdjacentHTML('beforeend',secs.map(s=>'<option>'+esc(s)+'</option>').join(''));
 const filt=()=>{const q=$('#q').value.trim().toLowerCase(),src=$('#fsrc').value,sec=$('#fsec').value;
  return D.rows.filter(r=>(!q||(r.ticker+' '+(r.name||'')+' '+(r.sector||'')).toLowerCase().includes(q))&&(!src||String(r.source).includes(src))&&
   (!sec||r.sector===sec)&&(!$('#ftight').checked||r.tight_range)&&(!$('#fbo').checked||r.breaking_out)&&(!$('#fbull').checked||bull(r.ema_8_21))&&(!$('#fma2').value||String(r.ma_riding||'').split(',').includes($('#fma2').value)));};
 const st={k:'combined',d:-1};
 const ra=grid($('#alltbl'),filt,['ticker','sector','source','price','combined','setup_score','value_score','trigger','stop','to_trigger_pct','risk_pct','rvol50','tight_range','breaking_out','ema_8_21','sma200_rising','sma40w_rising','ma_riding','fwd_pe','peg','off_52w_high_pct'],st);
 const go=()=>{$('#count').textContent=ra().toLocaleString()+' of '+D.rows.length.toLocaleString()+' shown';};st.cb=()=>{$('#count').textContent=$('#alltbl tbody').rows.length+' of '+D.rows.length+' shown';};
 ['#q','#fsrc','#fsec','#ftight','#fbo','#fbull','#fma2'].forEach(s=>$(s).addEventListener('input',go));go();
}).catch(e=>{$('#hdate').textContent='Unavailable';$('#cards').innerHTML='<p class="mut">Could not load data ('+esc(e.message)+'). Serve over http(s), not file://.</p>';});
})();
