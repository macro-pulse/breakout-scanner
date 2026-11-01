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
 $('sbtbl').innerHTML='<thead><tr>'+T.map(t=>`<th>${t[0]}</th>`).join('')+'</tr></thead><tbody>'+R.slice().reverse().map(r=>{
  const qu=r.q25u>r.q25d?'g1':'r1';return'<tr>'+T.map(([n,k,d])=>{if(k==='date')return`<td>${r.date}</td>`;let c=shade(k,r[k]);if(k==='q25u'||k==='q25d')c=(k==='q25u')===(r.q25u>r.q25d)?(k==='q25u'?'g1':'r1'):'';
  if(k==='u13'||k==='d13')c=(k==='u13')===(r.u13>r.d13)?(k==='u13'?'g1':'r1'):'';return`<td class="${c}">${f(r[k],d||0)}</td>`}).join('')+'</tr>'}).join('')+'</tbody>';
}).catch(e=>{$('bmeta').textContent='Breadth data unavailable: '+e;});
})();
