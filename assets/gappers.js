(function(){
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const f=(v,d=2)=>v==null?'–':Number(v).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});
const k=v=>v==null?'–':v>=1e9?(v/1e9).toFixed(1)+'B':v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':String(v);
const tbl=(R,up)=>!R.length?'<p class="gaps">None.</p>':`<div class="tw"><table class="bntbl"><thead><tr><th class="l">Ticker</th><th class="l">Name</th><th>Prior close</th><th>Pre-mkt</th><th>Gap %</th><th>PM vol</th><th>Avg vol</th><th>PM high</th><th>PM low</th><th>Mkt cap</th><th>Earnings</th><th class="l">Why it's moving</th><th class="l">Plan</th></tr></thead><tbody>`+
 R.map(r=>`<tr><td class="l"><b>${tvLink(r.ticker)}</b></td><td class="l">${esc(r.name)}</td><td>${f(r.prior_close)}</td><td>${f(r.pm_price)}</td><td style="color:${up?'#4ADE80':'#F87171'}"><b>${r.gap_pct>0?'+':''}${f(r.gap_pct)}%</b></td><td>${k(r.pm_volume)}</td><td>${k(r.avg_volume)}</td><td>${f(r.pm_high)}</td><td>${f(r.pm_low)}</td><td>${k(r.market_cap)}</td><td>${r.earnings?'📊 yes':''}</td><td class="l">${r.headline?(r.headline_url?`<a href="${esc(r.headline_url)}" target="_blank" rel="noopener">${esc(r.headline)}</a>`:esc(r.headline)):'–'}<br><small>${esc(r.headline_time||'')}</small></td><td class="l">${esc(r.plan)}</td></tr>`).join('')+'</tbody></table></div>';
fetch('data/gaps.json?'+Date.now()).then(r=>r.json()).then(g=>{
 const st={ok:'✅ Live pre-market data',no_premarket_session:'⏸️ No pre-market session yet (market closed or before 4 AM ET). Nothing published.'}[g.status]||g.status;
 $('gpmeta').innerHTML=`Generated <b>${esc(g.generated)}</b> · ${esc(st)} · Gap ≥ ${g.min_gap}% vs prior close · price ≥ $5 · avg vol ≥ 500K · ranked by pre-market volume · ${g.scanned} stocks scanned.`;
 $('gp-body').innerHTML=`<div class="bnset c-mb"><div class="bnh"><h3>🟢 Gap-ups <span>${g.gap_ups.length}</span></h3></div>${tbl(g.gap_ups,1)}</div><div class="bnset c-ep"><div class="bnh"><h3>🔴 Gap-downs <span>${g.gap_downs.length}</span></h3></div>${tbl(g.gap_downs,0)}</div>`;
 $('gpgaps').textContent='Source: '+g.source+'. Yahoo pre-market quotes can lag by a few minutes. '+(g.notes||[]).join(' ');
}).catch(()=>{$('gpmeta').textContent='No gap data yet.'});
})();
