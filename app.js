const folderSVG=`<svg viewBox="0 0 64 50"><path d="M3 10a4 4 0 014-4h16l5 5h30a4 4 0 014 4v27a4 4 0 01-4 4H7a4 4 0 01-4-4z" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>`;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------------- THEME ---------------- */
const root=document.documentElement,tt=$('#themeToggle');
tt.onclick=()=>{const d=root.getAttribute('data-theme')==='dark';root.setAttribute('data-theme',d?'light':'dark');
  $('#ticon').textContent=d?'◐':'◑';$('#tlabel').textContent=d?'Dark':'Light';readInk();};

/* ---------------- PHOTO ---------------- */
$('#photoWidget').style.backgroundImage="url('assets/me.jpg')";
$('#mailAv').style.backgroundImage="url('assets/me.jpg')";

/* ---------------- CLOCK ---------------- */
const moods=[[0,"🌙 Up late, probably debugging"],[5,"☀️ Early. Coffee loading"],[9,"⌨️ Heads-down, building"],[13,"🍱 Post-lunch, back at it"],[18,"🌆 Golden hour, still shipping"],[22,"🌙 Up late, probably debugging"]];
function tick(){const d=new Date();let h=d.getHours();const m=String(d.getMinutes()).padStart(2,'0');const ap=h>=12?'PM':'AM';let hh=h%12||12;
  $('#clockTime').innerHTML=hh+':'+m+'<small>'+ap+'</small>';let mood=moods[0][1];for(const mm of moods)if(h>=mm[0])mood=mm[1];$('#clockMode').textContent=mood;}
tick();setInterval(tick,1000);

/* ---------------- GITHUB GRID ---------------- */
const grid=$('#ghGrid'),lv=['','l1','l2','l3','l4'];
for(let i=0;i<17*7;i++){const c=document.createElement('div');const r=Math.random();const l=r>.82?4:r>.65?3:r>.45?2:r>.25?1:0;c.className='cell '+lv[l];grid.appendChild(c);}

/* ---------------- MUSIC ---------------- */
let playing=false,prog=0,mi=null;const pb=$('#playBtn'),mbar=$('#mbar');
pb.onclick=()=>{playing=!playing;pb.textContent=playing?'⏸':'▶';if(playing)mi=setInterval(()=>{prog=(prog+.6)%100;mbar.style.width=prog+'%';},120);else clearInterval(mi);};

/* ---------------- ROTATOR ---------------- */
const words=['MERN apps.','UI/UX designs.','trading EAs.','panel boards.'];let wi=0;const rot=$('#rotator');
setInterval(()=>{wi=(wi+1)%words.length;rot.style.opacity=0;setTimeout(()=>{rot.innerHTML='<span>'+words[wi]+'</span>';rot.style.opacity=1;},250);},2200);

/* (sound + unbloat buttons removed) */

/* ---------------- DESKTOP FOLDERS ---------------- */
const fw=$('#folders');
PROJECTS.slice(0,5).forEach(p=>{const el=document.createElement('div');el.className='folder';el.tabIndex=0;
  el.innerHTML=`<div class="fi">${folderSVG}</div><div class="fname">${p.name}</div>`;
  el.onclick=()=>{$$('.folder').forEach(f=>f.classList.remove('selected'));el.classList.add('selected');};
  el.ondblclick=()=>openProject(p.id);fw.appendChild(el);});

/* ---------------- ORBIT + BIG ICONS ---------------- */
const ringEl=$('#ring');
[["R","React"],["Nd","Node"],["M","MongoDB"],["Fi","Figma"],["MQ","MQL5"],["TS","TypeScript"]].forEach((ic,i)=>{
  const a=(i/6)*Math.PI*2,rad=130,x=Math.cos(a)*rad,y=Math.sin(a)*rad;
  const el=document.createElement('div');el.className='oicon';el.title=ic[1];el.style.transform=`translate(${x}px,${y}px)`;
  el.innerHTML=`<div class="ctr">${ic[0]}</div>`;ringEl.appendChild(el);});
const ow=$('#orbit');ow.addEventListener('mouseenter',()=>ow.classList.add('pause'));ow.addEventListener('mouseleave',()=>ow.classList.remove('pause'));
const bi=$('#bigicons');
[["R","React","MERN App, Market Tools"],["Nd","Node","MERN App, Market Tools"],["M","Mongo","MERN App"],["Fi","Figma","UI/UX, Design"],["Ps","Photoshop","UI/UX, Visuals"],["MQ","MQL5","Trading EA"],["TV","TradingView","Market Tools"]].forEach(x=>{
  const el=document.createElement('div');el.className='bigicon';el.innerHTML=`${x[0]}<span class="tip">${x[1]} · ${x[2]}</span>`;bi.appendChild(el);});

/* ---------------- WORK FINDER ---------------- */
const rows=$('#rows'),detail=$('#detail'),crumb=$('#crumb');
function renderDetail(p){detail.innerHTML=`<div class="fprev"><div class="pt">📁 ${p.name}</div>${p.blurb}</div>
  <h3>${p.name}</h3><div class="fstatus"><span class="kdot ${p.live?'filled':''}"></span>${p.status}</div>
  <p class="desc">${p.blurb}</p>${p.glance.map(s=>`<div class="fstat"><b>${s[0]}</b> ${s[1]}</div>`).join('')}
  <div class="fbtns"><a class="btn primary" id="openProj">Open</a><a class="btn" href="#">Live ↗</a></div>`;
  crumb.textContent=p.name;$('#openProj').onclick=()=>openProject(p.id);}
PROJECTS.forEach((p,i)=>{const r=document.createElement('div');r.className='frow'+(i===0?' sel':'');
  r.innerHTML=`<span class="name">📁 ${p.name}</span><span class="kind"><span class="kdot ${p.live?'filled':''}"></span>${p.kind}</span><span>${p.built}</span>`;
  r.onclick=()=>{$$('.frow').forEach(x=>x.classList.remove('sel'));r.classList.add('sel');renderDetail(p);};
  r.ondblclick=()=>openProject(p.id);rows.appendChild(r);});
renderDetail(PROJECTS[0]);

/* ==========================================================
   MODAL SHELL (generic)
   ========================================================== */
const overlay=$('#overlay'),modal=$('#modal');
function openModal(cls,html){modal.className='modal'+(cls?' '+cls:'');modal.innerHTML=html;overlay.classList.add('open');
  const c=modal.querySelector('.close');if(c)c.onclick=closeModal;}
function closeModal(){overlay.classList.remove('open');}
overlay.onclick=e=>{if(e.target===overlay)closeModal();};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ---------------- PROJECT MODAL ---------------- */
let current=null,curTab='chat';
function openProject(id){current=PROJECTS.find(p=>p.id===id);curTab='chat';
  openModal('',`<div class="mtop"><div class="traffic"><i class="close"></i><i></i><i></i></div>
    <div class="mtitle" id="mtitle"></div>
    <div class="toggle"><button id="tabChat" class="on">💬 Chat</button><button id="tabRead">📖 Read</button></div></div>
    <div class="mmain"><div class="mside" id="mside"></div><div class="mcontent" id="mcontent"></div></div>`);
  $('#tabChat').onclick=()=>setTab('chat');$('#tabRead').onclick=()=>setTab('read');
  renderSide();setTab('chat');}
function renderSide(){const p=current;$('#mside').innerHTML=`<div class="fi">${folderSVG}</div><h3>${p.name}</h3>
  <div class="st"><span class="kdot ${p.live?'filled':''}" style="width:8px;height:8px"></span>${p.status} · ${p.built}</div>
  <div class="glabel2">AT A GLANCE</div>${p.glance.map(g=>`<div class="glance-row"><b>${g[0]}</b><span>${g[1]}</span></div>`).join('')}
  <div class="glabel2">OPEN WITH</div><div class="openwith"><a class="primary" href="#">See it ↗</a><a href="#">Source / files ↗</a></div>`;}
function setTab(t){curTab=t;$('#tabChat').classList.toggle('on',t==='chat');$('#tabRead').classList.toggle('on',t==='read');
  $('#mtitle').textContent=(t==='chat'?'Chat about ':'The story of ')+current.name;
  if(t==='chat')renderChat();else renderRead();}
function renderChat(){const p=current;$('#mcontent').innerHTML=`<div class="chatwrap"><div class="chatscroll" id="chatScroll">
  <div class="notechat">psst — I answer from my notes on ${p.name}, so ask me about the hard bits.</div>
  <div class="msg bot">hey 👋 you opened ${p.name}</div><div class="msg bot">${p.blurb}</div>
  <div class="msg bot">ask me anything about it: how it works, what broke, why I built it</div></div>
  <div class="suggest" id="suggest"></div>
  <div class="composer"><input id="chatInput" placeholder="Message about ${p.name}…"><button id="chatSend">↑</button></div></div>`;
  renderSuggest(p.asks.slice(0,2));const input=$('#chatInput'),send=$('#chatSend');
  const go=()=>{const v=input.value.trim();if(!v)return;input.value='';answer(v);};send.onclick=go;input.onkeydown=e=>{if(e.key==='Enter')go();};}
function renderSuggest(list){const s=$('#suggest');if(!s)return;s.innerHTML='';list.forEach(q=>{const b=document.createElement('button');b.textContent=q;b.onclick=()=>answer(q);s.appendChild(b);});}
function scrollChat(){const sc=$('#chatScroll');if(sc)sc.scrollTop=sc.scrollHeight;}
function matchAnswer(q){const p=current;if(p.qa[q])return p.qa[q];const lc=q.toLowerCase();
  for(const k in p.qa){const kw=k.toLowerCase();if(lc.includes(kw)||kw.includes(lc))return p.qa[k];}
  return "good question — that's one I answer properly in the write-up. The short version: "+p.blurb+" Hit \"Read\" for the full story.";}
function answer(q){const sc=$('#chatScroll');if(!sc)return;const me=document.createElement('div');me.className='msg me';me.textContent=q;sc.appendChild(me);
  const sg=$('#suggest');if(sg)sg.innerHTML='';scrollChat();const dt=(0.8+Math.random()*1.4).toFixed(1);
  const th=document.createElement('div');th.className='thought';th.innerHTML=`<span class="spin"></span>Thought for ${dt}s`;sc.appendChild(th);scrollChat();
  setTimeout(()=>{th.remove();const bot=document.createElement('div');bot.className='msg bot';sc.appendChild(bot);
    const text=matchAnswer(q),wds=text.split(' ');let i=0;
    const stream=setInterval(()=>{bot.textContent=wds.slice(0,++i).join(' ');scrollChat();
      if(i>=wds.length){clearInterval(stream);renderSuggest(current.asks.filter(a=>a!==q).sort(()=>Math.random()-.5).slice(0,2));scrollChat();}},34);},dt*650);}
function renderRead(){const p=current;$('#mcontent').innerHTML=`<div class="readscroll"><h1>${p.name}</h1><p class="lede">${p.blurb}</p>
  <div class="tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div>
  <div class="pull"><div class="q">“${p.quote.pre}<mark>${p.quote.mark}</mark>”</div><div class="by">— ${p.quote.by}</div></div>
  <div class="rsec">01 · HOW IT FLOWS</div>${p.flows.map((f,i)=>`<div class="flowrow"><div class="l"><span class="n">${i+1}</span>${f[0]}</div><div class="r">${f[1]}</div></div>`).join('')}
  <div class="rsec">02 · THE FUN PART</div>${p.fun.map((f,i)=>`<div class="funcard"><div class="ft"><b>${f[0]}</b><span>${i+1}/${p.fun.length}</span></div><p>${f[1]}</p><code>${f[2]}</code></div>`).join('')}
  <div class="rsec">03 · WHAT BROKE</div>${p.broke.map(b=>`<div class="brokerow">⚠ ${b}</div>`).join('')}
  <div class="rsec">04 · THINGS PEOPLE ASK</div>${p.asks.map(a=>`<div class="askrow" data-q="${esc(a)}">› ${a}</div>`).join('')}</div>`;
  $$('.askrow',$('#mcontent')).forEach(el=>el.onclick=()=>{setTab('chat');setTimeout(()=>answer(el.dataset.q),200);});}

/* ==========================================================
   FIGMA-STYLE DESIGNS WINDOW
   ========================================================== */
function wireframe(kind){
  if(kind==='hero')return `<div class="wf"><div class="box hero"></div><div class="bar d m"></div><div class="bar s"></div><div class="spacer"></div><div class="pill"></div></div>`;
  if(kind==='grid')return `<div class="wf"><div class="rowy"><div class="box"></div><div class="box"></div><div class="box"></div></div><div class="grid2"><div class="box"></div><div class="box"></div><div class="box"></div><div class="box"></div></div><div class="bar s"></div></div>`;
  if(kind==='form')return `<div class="wf"><div class="bar d m"></div><div class="box" style="height:34px"></div><div class="box" style="height:34px"></div><div class="spacer"></div><div class="pill" style="width:100%"></div></div>`;
  if(kind==='profile')return `<div class="wf" style="align-items:center"><div class="circ"></div><div class="bar d s"></div><div class="bar s"></div><div class="rowy" style="width:100%"><div class="box"></div><div class="box"></div></div><div class="spacer"></div><div class="pill"></div></div>`;
  if(kind==='cards')return `<div class="wf"><div class="bar d m"></div><div class="rowy"><div class="box" style="height:120px"></div><div class="box" style="height:140px"></div><div class="box" style="height:120px"></div></div></div>`;
  return `<div class="wf"><div class="bar d m"></div><div class="box" style="height:28px"></div><div class="box" style="height:28px"></div><div class="box" style="height:28px"></div><div class="spacer"></div><div class="bar s"></div></div>`;
}
let figSel=0;
function openFigma(){figSel=0;
  openModal('wide',`<div class="mtop"><div class="traffic"><i class="close"></i><i></i><i></i></div><div class="mtitle">UI/UX Designs — Prashanth / Designs</div>
    <div class="toggle"><button class="on">Design</button></div></div>
    <div class="figtool">
      <button class="tbtn on" title="Move">⤢</button><button class="tbtn" title="Frame">▢</button><button class="tbtn" title="Pen">✎</button>
      <button class="tbtn" title="Text">T</button><button class="tbtn" title="Shape">◯</button>
      <span class="zoom"><span id="figZoom">Designs</span> · 100%</span></div>
    <div class="figbody">
      <div class="figleft"><div class="figlbl">PAGES</div>
        <div class="layer on"><span class="lic">▦</span> Designs</div><div class="layer"><span class="lic">▦</span> Components</div>
        <div class="figlbl">LAYERS</div><div id="figLayers"></div></div>
      <div class="figcanvas" id="figCanvas"></div>
      <div class="figright" id="figRight"></div></div>`);
  const layers=$('#figLayers'),canvas=$('#figCanvas');
  layers.innerHTML=DESIGNS.map((d,i)=>`<div class="layer ${i===0?'on':''}" data-i="${i}"><span class="lic">▢</span> ${d.name}</div>`).join('');
  canvas.innerHTML=DESIGNS.map((d,i)=>`<div class="frame ${i===0?'on':''}" data-i="${i}">
    <div class="fnm">${d.name} · ${d.w}</div>
    <div class="hnd tl"></div><div class="hnd tr"></div><div class="hnd bl"></div><div class="hnd br"></div>
    <div class="fcard">${wireframe(d.kind)}</div></div>`).join('');
  const selFrame=i=>{figSel=i;$$('.frame',canvas).forEach(f=>f.classList.toggle('on',+f.dataset.i===i));
    $$('.layer[data-i]',layers).forEach(l=>l.classList.toggle('on',+l.dataset.i===i));
    const d=DESIGNS[i];$('#figRight').innerHTML=`<div class="figlbl">FRAME</div>
      <div class="prow"><span>Name</span><span>${esc(d.name)}</span></div><div class="prow"><span>Size</span><span>${esc(d.w)}</span></div>
      <div class="prow"><span>Type</span><span>Frame</span></div>
      <div class="figlbl">FILL / PALETTE</div><div class="swatches">${d.colors.map(c=>`<div class="sw" style="background:${c}"></div>`).join('')}</div>
      <div class="figlbl">NOTES</div><p class="fdesc">${esc(d.desc)}</p>`;
    $('#figZoom').textContent=d.name;};
  $$('.frame',canvas).forEach(f=>f.onclick=()=>selFrame(+f.dataset.i));
  $$('.layer[data-i]',layers).forEach(l=>l.onclick=()=>selFrame(+l.dataset.i));
  selFrame(0);}

/* ==========================================================
   ARTICLES WINDOW
   ========================================================== */
function openArticles(){
  openModal('',`<div class="mtop"><div class="traffic"><i class="close"></i><i></i><i></i></div><div class="mtitle">My UI/UX Articles</div>
    <div class="toggle"><button class="on">📖 Reader</button></div></div>
    <div class="artbody"><div class="artlist" id="artList"></div><div class="artread" id="artRead"></div></div>`);
  const list=$('#artList');
  list.innerHTML=ARTICLES.map((a,i)=>`<div class="artitem ${i===0?'on':''}" data-i="${i}"><h5>${esc(a.title)}</h5><div class="amet">${esc(a.kicker)} · ${esc(a.date)} · ${esc(a.read)}</div></div>`).join('');
  const show=i=>{$$('.artitem',list).forEach(x=>x.classList.toggle('on',+x.dataset.i===i));const a=ARTICLES[i];
    $('#artRead').innerHTML=`<div class="akicker">${esc(a.kicker)}</div><h1>${esc(a.title)}</h1>
      <div class="ameta"><span>By Nandigama Prashanth Kumar</span><span>${esc(a.date)}</span><span>${esc(a.read)} read</span></div>
      <div class="apull">${esc(a.pull)}</div>${a.body.map(p=>`<p>${esc(p)}</p>`).join('')}
      <div class="atags">${a.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;
    $('#artRead').scrollTop=0;};
  $$('.artitem',list).forEach(x=>x.onclick=()=>show(+x.dataset.i));show(0);}

/* ==========================================================
   GOOGLE SHEETS (published CSV) -> auto-updating data
   ========================================================== */
function parseCSV(text){const rows=[];let row=[],cur='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=c;}
    else{if(c==='"')q=true;else if(c===','){row.push(cur);cur='';}
      else if(c==='\n'){row.push(cur);rows.push(row);row=[];cur='';}
      else if(c==='\r'){}else cur+=c;}}
  if(cur!==''||row.length){row.push(cur);rows.push(row);}return rows;}
function csvToObjects(text){const rows=parseCSV(text).filter(r=>r.some(c=>c.trim()!==''));if(!rows.length)return[];
  const head=rows[0].map(h=>h.trim());return rows.slice(1).map(r=>{const o={};head.forEach((h,i)=>o[h]=(r[i]||'').trim());return o;});}
async function loadSheet(url,fallback){if(!url)return{data:fallback,live:false};
  try{const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw 0;const txt=await res.text();
    const objs=csvToObjects(txt);return objs.length?{data:objs,live:true}:{data:fallback,live:false};}
  catch(e){return{data:fallback,live:false};}}

/* ---------------- LEARNINGS / PODCASTS section ---------------- */
let learnData=[],podData=[],learnTab='learnings';
function renderLearnTab(){setRecentPodcast();const wrap=$('#learnBody');
  if(learnTab==='learnings'){
    if(!learnData.length){wrap.innerHTML=emptyMsg('learnings','Date · Title · Source · Type · Note · Tags · Link');return;}
    wrap.innerHTML=`<div class="learngrid">${learnData.map(l=>`<div class="lcard">
      <div class="ltop"><h4>${esc(l.Title)}</h4><span class="ldate">${esc(fmtDate(l.Date))}</span></div>
      <div class="lsrc">${esc(l.Type||'Note')} · ${esc(l.Source||'')}</div>
      <p>${esc(l.Note||'')}</p>
      ${l.Tags?`<div class="ltags">${l.Tags.split(',').map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div>`:''}
      ${l.Link&&l.Link!=='#'?`<a class="llink" href="${esc(l.Link)}" target="_blank" rel="noopener">Open ↗</a>`:''}</div>`).join('')}</div>`;
  }else{
    if(!podData.length){wrap.innerHTML=emptyMsg('podcasts','Date · Episode · Show · Note · Link');return;}
    wrap.innerHTML=podData.map(p=>`<div class="podrow"><div class="podart">🎧</div><div class="pmeta">
      <h4>${esc(p.Episode)}</h4><div class="pshow">${esc(p.Show||'')} · ${esc(fmtDate(p.Date))}</div><p>${esc(p.Note||'')}</p>
      ${p.Link&&p.Link!=='#'?`<a class="llink" href="${esc(p.Link)}" target="_blank" rel="noopener">Listen ↗</a>`:''}</div></div>`).join('');
  }}
function emptyMsg(which,cols){return `<div class="emptyhint">No ${which} yet. Connect a Google Sheet in <code>js/data.js</code> → <code>SHEETS.${which}</code> with columns:<br><br><code>${cols}</code><br><br>Until then this shows sample entries.</div>`;}
function setRecentPodcast(){
  if(!podData||!podData.length)return;
  const sorted=podData.slice().sort((a,b)=>new Date(b.Date||0)-new Date(a.Date||0));
  const p=sorted[0]||{};const t=$('#musicTitle'),a=$('#musicArtist');
  if(t)t.textContent=p.Episode||'—';if(a)a.textContent=p.Show||'';}
function fmtDate(s){if(!s)return'';const d=new Date(s);if(isNaN(d))return s;return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
async function initLearnings(){
  try{
    const l=await loadSheet(SHEETS.learnings,SAMPLE_LEARNINGS),p=await loadSheet(SHEETS.podcasts,SAMPLE_PODCASTS);
    learnData=l.data;podData=p.data;
    const dot=$('#learnLive');
    if(dot){dot.classList.toggle('ok',l.live||p.live);const sp=dot.querySelector('span');if(sp)sp.textContent=(l.live||p.live)?'Live from Google Sheets':'Sample data · add rows to your Sheet';}
    renderLearnTab();
  }catch(e){learnData=SAMPLE_LEARNINGS;podData=SAMPLE_PODCASTS;renderLearnTab();}
}
$$('#learnTabs button').forEach(b=>b.onclick=()=>{learnTab=b.dataset.t;$$('#learnTabs button').forEach(x=>x.classList.toggle('on',x===b));renderLearnTab();});

/* ==========================================================
   NEWSLETTER CAROUSEL
   ========================================================== */
const track=$('#carotrack');
const nlHTML=NEWSLETTER.map(n=>`<a class="nlcard" href="${esc(n.link)}" ${n.link&&n.link!=='#'?'target="_blank" rel="noopener"':''}>
  <div class="nltop"><span class="nlbadge">${esc(n.issue)}</span> LINKEDIN NEWSLETTER · ${esc(n.date)}</div>
  <h4>${esc(n.title)}</h4><p>${esc(n.blurb)}</p><div class="nlfoot">Read on LinkedIn →</div></a>`).join('');
track.innerHTML=nlHTML+nlHTML; // duplicate for seamless loop
$('#caroPrev').onclick=()=>nudge(-1);$('#caroNext').onclick=()=>nudge(1);
function nudge(dir){track.classList.add('paused');const cur=getComputedStyle(track).transform;
  const x=(new DOMMatrix(cur)).m41;track.style.transition='transform .4s';track.style.transform=`translateX(${x-dir*348}px)`;
  setTimeout(()=>{track.style.transition='';},420);}

/* ==========================================================
   BOOKSHELF (alphabetical)
   ========================================================== */
let books=[];
function coverFail(i){const b=books[i]||{};const el=document.querySelector('.book[data-i="'+i+'"] .bookcover');
  if(el){el.classList.remove('cimg');el.innerHTML=`<div class="bt">${esc(b.Title)}</div><div class="ba">${esc(b.Author||'')}</div>`;}}
function shelfSpine(b,i){const img=b.CoverURL&&String(b.CoverURL).trim();
  return `<div class="book" data-i="${i}">${b.Rating?`<span class="brate">★ ${esc(b.Rating)}</span>`:''}
    <div class="bookcover ${img?'cimg':''}">${img?`<img src="${esc(String(b.CoverURL))}" alt="${esc(b.Title)}" loading="lazy" onerror="coverFail(${i})">`:
      `<div class="bt">${esc(b.Title)}</div><div class="ba">${esc(b.Author||'')}</div>`}</div></div>`;}
function renderShelf(filter=''){
  const wrap=$('#shelfUnit');const f=filter.toLowerCase();
  const list=books.filter(b=>!f||(b.Title+' '+(b.Author||'')+' '+(b.Tags||'')).toLowerCase().includes(f))
    .slice().sort((a,b)=>(a.Title||'').localeCompare(b.Title||'',undefined,{sensitivity:'base'}));
  if(!list.length){wrap.innerHTML=emptyMsg('books','Title · Author · Status · Rating · Finished · Learnings · Tags · CoverURL');return;}
  const groups={};list.forEach(b=>{const L=(b.Title||'#').trim().charAt(0).toUpperCase();const k=/[A-Z]/.test(L)?L:'#';(groups[k]=groups[k]||[]).push(b);});
  const letters=Object.keys(groups).sort();
  wrap.innerHTML=letters.map(L=>`<div class="shelf"><div class="shelflabel">${L}</div>
    <div class="shelfrow">${groups[L].map(b=>shelfSpine(b,books.indexOf(b))).join('')}</div>
    <div class="shelfplank"></div></div>`).join('');
  $$('.book',wrap).forEach(el=>el.onclick=()=>openBook(books[+el.dataset.i]));}
function openBook(b){const img=b.CoverURL&&b.CoverURL.trim();
  openModal('small bookmodal',`<div class="mtop"><div class="traffic"><i class="close"></i><i></i><i></i></div><div class="mtitle">Bookshelf — ${esc(b.Title)}</div></div>
    <div class="bmgrid"><div><div class="bmcover ${img?'cimg':''}" ${img?`style="padding:0;overflow:hidden"`:''}>
      ${img?`<img src="${esc(b.CoverURL)}" alt="" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1)">`:
        `<div class="bt" style="font-size:15px;font-weight:800">${esc(b.Title)}</div><div class="ba" style="font-size:11px;color:var(--ink-faint);text-transform:uppercase">${esc(b.Author||'')}</div>`}</div></div>
    <div><h2>${esc(b.Title)}</h2><div class="bmauth">${esc(b.Author||'')}</div>
      <div class="bmmeta"><span>${esc(b.Status||'Read')}</span>${b.Rating?`<span>★ ${esc(b.Rating)}/5</span>`:''}${b.Finished?`<span>Finished ${esc(b.Finished)}</span>`:''}</div>
      <div class="bmlearn"><b>WHAT I LEARNED</b>${esc(b.Learnings||'Notes coming soon.')}</div>
      ${b.Tags?`<div class="atags" style="margin-top:16px">${b.Tags.split(',').map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div>`:''}</div></div>`);}
async function fetchCover(b){
  if(b.CoverURL&&String(b.CoverURL).trim())return String(b.CoverURL).trim();
  const title=b.Title||'',author=b.Author||'';
  const grab=async(url,pick)=>{try{
      const ctl=new AbortController();const to=setTimeout(()=>ctl.abort(),6000);
      const r=await fetch(url,{signal:ctl.signal});clearTimeout(to);
      if(!r.ok)return '';const j=await r.json();return pick(j)||'';
    }catch(e){return '';}};
  // 1) Google Books (CORS-enabled, matches by title/author)
  let u=await grab(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent('intitle:'+title+' inauthor:'+author)}&maxResults=1&country=US`,
    j=>{const il=j.items&&j.items[0]&&j.items[0].volumeInfo&&j.items[0].volumeInfo.imageLinks;
        return il?String(il.thumbnail||il.smallThumbnail||'').replace(/^http:/,'https:').replace('&edge=curl',''):'';});
  if(u)return u;
  // 2) Open Library fallback
  u=await grab(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`,
    j=>{const d=j.docs&&j.docs[0];if(!d)return '';
        if(d.cover_i)return `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg`;
        if(d.isbn&&d.isbn[0])return `https://covers.openlibrary.org/b/isbn/${d.isbn[0]}-L.jpg`;return '';});
  return u||'';
}
function updateBookCover(b){const i=books.indexOf(b);if(i<0)return;
  const el=document.querySelector('.book[data-i="'+i+'"] .bookcover');if(!el)return;
  el.classList.add('cimg');
  el.innerHTML=`<img src="${esc(String(b.CoverURL))}" alt="${esc(b.Title)}" loading="lazy" onerror="coverFail(${i})">`;}
async function enrichCovers(){
  // Each cover loads independently; a slow/failed one never blocks the others.
  books.forEach(async b=>{
    if(b.CoverURL&&String(b.CoverURL).trim()){updateBookCover(b);return;}
    const c=await fetchCover(b);if(c){b.CoverURL=c;updateBookCover(b);}
  });
}
async function initBooks(){
  try{
    const r=await loadSheet(SHEETS.books,SAMPLE_BOOKS);books=(r.data&&r.data.length)?r.data:SAMPLE_BOOKS;
    const dot=$('#bookLive');
    if(dot){dot.classList.toggle('ok',r.live);const sp=dot.querySelector('span');if(sp)sp.textContent=r.live?'Live from Google Sheets':'Sample data · share your Sheet to go live';}
    renderShelf();enrichCovers();
  }catch(e){books=SAMPLE_BOOKS;renderShelf();enrichCovers();}
}
$('#shelfSearchInput').oninput=e=>renderShelf(e.target.value);

/* ==========================================================
   DOCK
   ========================================================== */
$$('.dock a[data-open]').forEach(a=>a.onclick=e=>{e.preventDefault();const k=a.dataset.open;
  if(k==='figma')openFigma();else if(k==='articles')openArticles();else if(k==='work')openProject('uiux');});

/* ==========================================================
   CONTACT + LIKE + NAME PARTICLES
   ========================================================== */
const EMAIL='nandigamaprashanthkumar@gmail.com';
$('#copyBtn').onclick=e=>{navigator.clipboard?.writeText(EMAIL);e.target.textContent='Copied';setTimeout(()=>e.target.textContent='Copy',1400);};
$$('.subchip').forEach(c=>c.onclick=()=>{$$('.subchip').forEach(x=>x.classList.remove('active'));c.classList.add('active');});
$('#sendBtn').onclick=()=>{const s=$('.subchip.active').textContent,f=$('#fromField').value,b=$('#bodyField').value;
  location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b+'\n\n— '+f)}`;};
let likes=0,liked=false;const likeBtn=$('#likeBtn'),likeCt=$('#likeCt');
likeBtn.onclick=()=>{liked=!liked;likes+=liked?1:-1;likeCt.textContent=likes;
  likeBtn.firstChild.textContent=liked?'♥ ':'♡ ';likeBtn.style.background=liked?'var(--sel)':'var(--card)';likeBtn.style.color=liked?'var(--sel-ink)':'var(--ink)';};

const canvas=$('#nameCanvas'),ctx=canvas.getContext('2d');
let INK='#0a0a0a';function readInk(){INK=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#0a0a0a';}
readInk();let particles=[],mouse={x:-9999,y:-9999};
function sizeCanvas(){const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);buildParticles(r.width,r.height);}
function buildParticles(W,H){particles=[];const off=document.createElement('canvas');off.width=W;off.height=H;const o=off.getContext('2d');
  o.fillStyle='#000';o.textAlign='center';o.textBaseline='middle';const lines=['Nandigama','Prashanth Kumar'];
  let fs=Math.min(H*0.42,W/5.2);o.font='800 '+fs+'px '+getComputedStyle(document.body).fontFamily;
  let widest=Math.max(...lines.map(l=>o.measureText(l).width));
  if(widest>W*0.92){fs*=W*0.92/widest;o.font='800 '+fs+'px '+getComputedStyle(document.body).fontFamily;}
  lines.forEach((l,i)=>o.fillText(l,W/2,H*(i===0?0.33:0.68)));
  const img=o.getImageData(0,0,W,H).data,gap=Math.max(5,Math.round(W/190));
  for(let y=0;y<H;y+=gap)for(let x=0;x<W;x+=gap)if(img[(y*W+x)*4+3]>128)particles.push({hx:x,hy:y,x:Math.random()*W,y:Math.random()*H,vx:0,vy:0});}
function frame(){const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);
  const gap=Math.max(5,Math.round(r.width/190)),sz=gap*0.78;ctx.fillStyle=INK;
  for(const p of particles){const dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;
    if(d2<5200){const d=Math.sqrt(d2)||1,f=(72-d)/72;p.vx+=(dx/d)*f*4;p.vy+=(dy/d)*f*4;}
    p.vx+=(p.hx-p.x)*0.012;p.vy+=(p.hy-p.y)*0.012;p.vx*=0.86;p.vy*=0.86;p.x+=p.vx;p.y+=p.vy;
    ctx.fillRect(p.x-sz/2,p.y-sz/2,sz,sz);}requestAnimationFrame(frame);}
canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
canvas.addEventListener('mouseleave',()=>{mouse.x=mouse.y=-9999;});
canvas.addEventListener('click',()=>{for(const p of particles){p.vx+=(Math.random()-0.5)*40;p.vy+=(Math.random()-0.5)*40;}});
window.addEventListener('resize',sizeCanvas);sizeCanvas();frame();

/* ---------------- INIT DATA ----------------
   Render sample content immediately so the shelf/lists are never blank,
   then asynchronously upgrade to live Google Sheet data. */
books=SAMPLE_BOOKS;try{renderShelf();}catch(e){console.error('shelf',e);}
learnData=SAMPLE_LEARNINGS;podData=SAMPLE_PODCASTS;try{renderLearnTab();}catch(e){console.error('learn',e);}
initLearnings();initBooks();
