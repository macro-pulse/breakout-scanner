(function(){
const $=id=>document.getElementById(id), f=(v,d=0)=>v==null?'–':Number(v).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});
function spark(rows,key,opt={}){const v=rows.map(r=>r[key]);const ok=v.filter(x=>x!=null);if(!ok.length)return'';
 let lo=Math.min(...ok,opt.lo??Infinity),hi=Math.max(...ok,opt.hi??-Infinity);if(hi===lo)hi=lo+1;const W=320,H=130,P=4;
 const x=i=>P+i*(W-2*P)/(v.length-1),y=z=>H-P-(z-lo)*(H-2*P)/(hi-lo);
 const d=v.map((z,i)=>z==null?'':(i&&v[i-1]!=null?'L':'M')+x(i).toFixed(1)+','+y(z).toFixed(1)).join('');
 const g=(opt.lines||[]).filter(t=>t>=lo&&t<=hi).map(t=>`<line x1="0" x2="${W}" y1="${y(t)}" y2="${y(t)}" stroke="#2A3856" stroke-dasharray="3 3"/><text x="${W-2}" y="${y(t)-2}" fill="#6B7A96" font-size="9" text-anchor="end">${t}</text>`).join('');
 return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${g}<path d="${d}" fill="none" stroke="#2DD4BF" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`;}
function shade(k,v){if(v==null)return'';const R={up4:[150,300,1],dn4:[150,300,-1],ratio5:[2,0.5,0],ratio10:[2,0.5,0],t2108:[70,20,2],q25u:[0,0,0],
 m25u:[100,200,1],m25d:[100,200,-1],m50u:[20,40,1],m50d:[20,40,-1]};const r=R[k];if(!r)return'';
 if(r[2]===1)return v>=r[1]?'g2':v>=r[0]?'g1':'';if(r[2]===-1)return v>=r[1]?'r2':v>=r[0]?'r1':'';
 if(r[2]===0)return v>=r[0]?'g1':v<=r[1]?'r1':'';if(r[2]===2)return v>=r[0]?'r1':v<=r[1]?'g1':'';return'';}
fetch('data/breadth.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(b=>{
 const R=b.rows,L=R[R.length-1],P=R[R.length-2];
 $('bmeta').textContent=`Universe: ${b.universe} · ${f(b.universe_count)} stocks · data through ${b.data_date} close · updated ${b.generated_et}`+(b.gaps.length?' · Notes: '+b.gaps.join('; '):'');
 $('bregime').innerHTML=`<span>Breadth regime</span><span class="pill ${b.regime}">${b.regime}</span><span>${b.regime_score}/6 bullish conditions met (rule below)</span>`;
 const C=[['Up 4%+','up4',0,v=>v>=300?'Thrust':'',],['Down 4%+','dn4',0,v=>v>=300?'Heavy selling':''],['5-day ratio','ratio5',2,v=>v>=2?'Strong':v<=.5?'Weak':'Neutral'],
 ['10-day ratio','ratio10',2,v=>v>=2?'Strong':v<=.5?'Weak':'Neutral'],['T2108','t2108',1,v=>v>=70?'Overbought':v<=20?'Oversold':'Neutral'],
 ['% > 20D','pct20',1],['% > 50D','pct50',1,v=>v>=50?'Bullish':'Bearish'],['% > 200D','pct200',1,v=>v>=50?'Bullish':'Bearish'],
 ['New Highs','nh',0],['New Lows','nl',0],['NH − NL','nhnl',0,v=>v>0?'Bullish':'Bearish'],['McClellan Osc','mco',1,v=>v>0?'Bullish':'Bearish'],
 ['Summation Idx','msi',0],['Adv / Dec',null],['Up/Down Vol','updn_vol',2,v=>v>=1?'Bullish':'Bearish'],['Zweig EMA','zbt_ema',1,v=>v>61.5?'Thrust zone':v<40?'Oversold':'Neutral']];
 $('bcards').innerHTML=C.map(([n,k,d,t])=>{if(!k)return`<div class="bcard"><div class="k">${n}</div><div class="v">${f(L.adv)} / ${f(L.dec)}</div><div class="c">A/D line ${f(L.ad_line)}</div></div>`;
  const v=L[k],ch=v!=null&&P[k]!=null?v-P[k]:null,tl=t?t(v):'',cl=/Bull|Strong|Thrust$|Oversold/.test(tl)?'pos':/Bear|Weak|Heavy|Overbought/.test(tl)?'neg':'neu';
  return`<div class="bcard"><div class="k">${n}</div><div class="v">${f(v,d)}</div><div class="c ${ch>0?'pos':ch<0?'neg':''}">${ch==null?'':(ch>0?'+':'')+f(ch,d)} vs prior</div>${tl?`<div class="t ${cl}">${tl}</div>`:''}</div>`}).join('')+
  `<div class="bcard"><div class="k">Zweig Thrust</div><div class="v">${R.slice(-10).some(r=>r.zbt)?'<span class="pos">FIRED</span>':'None'}</div><div class="c">last 10 sessions</div></div>`;
 const G=[['T2108 (% > 40D)','t2108',{lo:0,hi:100,lines:[20,50,70]},1],['% above 50-day MA','pct50',{lo:0,hi:100,lines:[20,50,80]},1],['% above 200-day MA','pct200',{lo:0,hi:100,lines:[20,50,80]},1],
 ['McClellan Oscillator','mco',{lines:[0]},1],['Advance/Decline line','ad_line',{},0],['New Highs − New Lows','nhnl',{lines:[0]},0],['10-day Up4/Down4 ratio','ratio10',{lines:[0.5,1,2]},2],['Summation Index','msi',{lines:[0]},0]];
 $('bcharts').innerHTML=G.map(([n,k,o,d])=>`<div class="bchart"><h4>${n}<b>${f(L[k],d)}</b></h4>${spark(R,k,o)}</div>`).join('')+`<p class="gaps" style="grid-column:1/-1;margin:0">Charts: last ${R.length} sessions, ${R[0].date} → ${b.data_date}.</p>`;
 const T=[['Date','date'],['Up 4%','up4'],['Down 4%','dn4'],['5d ratio','ratio5',2],['10d ratio','ratio10',2],['Up 25% Q','q25u'],['Down 25% Q','q25d'],['Up 25% M','m25u'],['Down 25% M','m25d'],['Up 50% M','m50u'],['Down 50% M','m50d'],['Up 13% 34d','u13'],['Down 13% 34d','d13'],['T2108','t2108',1],['Universe','count']];
 // Stockbee Market Monitor colour coding (as in his published layout)
 const sb=(k,r)=>{const v=r[k];if(v==null)return'';
  if(k==='up4'||k==='dn4'){if(k==='dn4'&&v>=300)return'r2';return r.up4>=r.dn4?'g1':'pk';}
  if(k==='ratio5'||k==='ratio10')return v>=2?'g1':'';
  if(k==='q25u'||k==='q25d')return r.q25u>=r.q25d?'g2':'r1';
  if(k==='m25u'||k==='m25d')return r.m25d>r.m25u?'r2':'g1';
  if(k==='u13'||k==='d13')return r.d13>r.u13?'r2':'g1';return'';};
 $('sbtbl').innerHTML='<thead><tr><th></th><th colspan="4" class="hp">Primary breadth</th><th colspan="8" class="hs">Secondary breadth</th><th colspan="2"></th></tr><tr>'+T.map(t=>`<th>${t[0]}</th>`).join('')+'</tr></thead><tbody>'+R.slice().reverse().map(r=>
  '<tr>'+T.map(([n,k,d])=>k==='date'?`<td>${r.date}</td>`:`<td class="${sb(k,r)}">${f(r[k],d||0)}</td>`).join('')+'</tr>').join('')+'</tbody>';
 const S=b.scans||{},SC=[
  ['up4','Up 4%+ today','Close up at least 4% vs yesterday’s close, volume ≥ 100,000 shares and volume above yesterday’s.','( 100 * (C - C1) / C1) >= 4 AND V >= 100000 AND V > V1'],
  ['dn4','Down 4%+ today','Close down at least 4% vs yesterday’s close, volume ≥ 100,000 shares and volume above yesterday’s.','C/C1<=.96 AND V >= 100000 AND V > V1'],
  ['q25u','Up 25%+ in a quarter','Close at least 25% above the lowest close of the last 65 trading days (today included), and 20-day avg close × 20-day avg volume ≥ $250,000.','100 * ((C + .01) - ( MINC65 + .01)) / (MINC65 + .01) >= 25 and AVGC20 * AVGV20 >= 250000'],
  ['q25d','Down 25%+ in a quarter','Close at least 25% below the highest close of the last 65 trading days, and 20-day avg close × avg volume ≥ $250,000.','(100 * ((C + .01) - (MAXC65 + .01)) / (MAXC65 + .01)) <= ( - 25) and AVGC20 * AVGV20 >= 250000'],
  ['m25u','Up 25%+ in a month','Close at least 25% above the close 20 trading days ago; that close ≥ $5; 20-day avg close × avg volume ≥ $250,000.','C20 >= 5 AND (AVGC20 * AVGV20) >= 250000 AND 100 * (C - C20) / C20 >= 25'],
  ['m25d','Down 25%+ in a month','Close at least 25% below the close 20 trading days ago; that close ≥ $5; 20-day avg close × avg volume ≥ $250,000.','C20 >= 5 AND (AVGC20 * AVGV20) >= 250000 AND 100 * (C - C20) / C20 <= ( - 25)'],
  ['m50u','Up 50%+ in a month','Same as above with a 50% threshold.','C20 >= 5 AND (AVGC20 * AVGV20) >= 250000 AND 100 * (C - C20) / C20 >= 50'],
  ['m50d','Down 50%+ in a month','Same as above with a −50% threshold.','C20 >= 5 AND (AVGC20 * AVGV20) >= 250000 AND 100 * (C - C20) / C20 <= ( - 50)'],
  ['u13','Up 13%+ in 34 days','Close at least 13% above the lowest close of the last 34 trading days, and 20-day avg close × avg volume ≥ $250,000.','100 * ((C + .01) - ( MINC34 + .01)) / (MINC34 + .01) >= 13 and (AVGC20 * AVGV20) >= 250000'],
  ['d13','Down 13%+ in 34 days','Close at least 13% below the highest close of the last 34 trading days, and 20-day avg close × avg volume ≥ $250,000.','(100 * ((C + .01) - (MAXC34 + .01)) / (MAXC34 + .01)) <= ( - 13) and (AVGC20 * AVGV20) >= 250000']];
 const e=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 $('sbscans').innerHTML=SC.map(([k,n,p,fm])=>{const h=S[k]||[];return`<div class="sbscan"><h4>${n} <b>${f(L[k])}</b> <small>stocks on ${b.data_date}</small></h4><p>${p}</p><code>${e(fm)}</code><div class="sbt">${h.length?h.map(x=>`<span>${tvLink(x.ticker)} <i class="${x.move>=0?'pos':'neg'}">${x.move>0?'+':''}${f(x.move,1)}%</i></span>`).join(''):'<em>No matches today.</em>'}</div>${L[k]>h.length&&h.length?`<small>Top ${h.length} of ${f(L[k])} by move size.</small>`:''}</div>`}).join('');
}).catch(e=>{$('bmeta').textContent='Breadth data unavailable: '+e;});
})();
