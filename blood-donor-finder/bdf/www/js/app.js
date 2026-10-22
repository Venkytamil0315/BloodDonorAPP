/* Blood Donor Finder - app logic (vanilla JS, no build step). */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const G=['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const donors=[
{n:'Shyam Prakash',g:'O+',d:2.3,a:1,age:21,sx:'Male',last:'3 months ago',p:'9840012345'},
{n:'Lion Andel',g:'A+',d:4,a:1,age:27,sx:'Male',last:'5 months ago',p:'9840023456'},
{n:'Balaji',g:'AB-',d:6.7,a:1,age:30,sx:'Male',last:'4 months ago',p:'9840034567'},
{n:'Venkatesh',g:'B+',d:1.2,a:1,age:25,sx:'Male',last:'6 months ago',p:'9840045678'},
{n:'Meena Iyer',g:'O+',d:3.1,a:0,age:29,sx:'Female',last:'1 month ago',p:'9840056789'}];
let reqs=[{n:'Arun',p:'Karthick',h:'Chennai GH',age:41,r:'Heart surgery',g:'O+',u:1,date:'20 Oct 2026',time:'1:00 PM'}];
const notifs=[['🩸','A donor has accepted your request','Karthick’s O+ is available to donate · 2m ago'],['📍','New donor nearby','Balaji (AB-) is 6.7 km away · 1h ago'],['🚨','New request: A-positive','A patient at Apollo Hospital needs blood · 3h ago'],['⏰','Reminder','You can donate blood again from next month']];
let hist=['welcome'],cur='welcome',list=donors;
G.forEach(g=>{['#sg','#rb','#qb'].forEach(s=>{const o=document.createElement('option');o.textContent=g;$(s).appendChild(o)})});
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
function go(id,back){
 if(!back&&id!==cur)hist.push(id);
 cur=id;$$('.scr').forEach(s=>s.classList.toggle('on',s.id===id));
 const main=['home','requests','profile'].includes(id);
 $('#tabs').hidden=!main;$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===id));
 $('#'+id).scrollTop=0;draw(id);
}
function draw(id){
 if(id==='admin')drawAdmin();
 $('#sD').textContent=donors.filter(d=>d.a).length;$('#sR').textContent=reqs.length;
 if(id==='requests')$('#rList').innerHTML=reqs.length?reqs.map((r,i)=>`<button class="item" data-r="${i}"><div class="av">${esc(r.g)}</div><div class="m"><b>${esc(r.g)} · ${r.u} unit${r.u>1?'s':''}</b><small>${esc(r.h)}<br>${esc(r.date)} · ${esc(r.time)}</small></div><span style="color:var(--red);font-weight:600;font-size:13px">View ›</span></button>`).join(''):'<div class="empty">No requests yet.<br>Raise one when you need blood.</div>';
 if(id==='notif')$('#nfList').innerHTML=notifs.map(n=>`<div class="nt"><span>${n[0]}</span><div><b style="font-weight:600">${esc(n[1])}</b><small>${esc(n[2])}</small></div></div>`).join('');
}
function back(){if(hist.length>1){hist.pop();go(hist[hist.length-1],true)}}
document.addEventListener('click',e=>{
 const t=e.target.closest('button,[data-go]');if(!t)return;
 if(t.hasAttribute('data-logout'))return logout();
 if(t.dataset.go)return go(t.dataset.go);
 if(t.hasAttribute('data-back'))return back();
 if(t.dataset.toast)return toast(t.dataset.toast);
 if(t.dataset.r!==undefined)return showReq(+t.dataset.r);
 if(t.dataset.d!==undefined)return showDonor(+t.dataset.d);
 if(t.dataset.call!==undefined)return toast('Calling '+donors[+t.dataset.call].n+'…');
 if(t.dataset.chat!==undefined)return toast('Chat opened with '+donors[+t.dataset.chat].n);
});
$('#doSearch').onclick=()=>{
 const g=$('#sg').value,m=+$('#sd').value;
 list=donors.map((d,i)=>({...d,i})).filter(d=>(!g||d.g===g)&&d.d<=m).sort((a,b)=>a.d-b.d);
 $('#nSub').textContent=`${list.length} found · ${$('#sl').value||'Chennai'}`;
 $('#nList').innerHTML=list.length?list.map(d=>`<div class="item"><button class="av" data-d="${d.i}" aria-label="View ${esc(d.n)}">${esc(d.n[0])}</button><div class="m"><b>${esc(d.n)}</b><small><span class="bg">${d.g}</span> · ${d.d} km</small><br><span class="tag ${d.a?'':'off'}">${d.a?'Available':'Unavailable'}</span></div><button class="circ" data-call="${d.i}" aria-label="Call">📞</button><button class="circ" data-chat="${d.i}" aria-label="Chat">💬</button></div>`).join(''):'<div class="empty">No donors match these filters.<br>Try a wider distance or another blood group.</div>';
 go('nearby');
};
function showDonor(i){const d=donors[i];
 $('#dBody').innerHTML=`<div class="av">${esc(d.n[0])}</div><h2>${esc(d.n)}</h2><span class="tag ${d.a?'':'off'}">${d.a?'Available':'Unavailable'}</span>
 <div class="chips"><b class="bg">${d.g}</b><span>${d.d} km</span><span>${d.sx}</span><span>${d.age} yrs</span></div>
 <div class="dt" style="text-align:left"><p><span>Last donation</span><b>${d.last}</b></p><p><span>Status</span><b>Verified donor</b></p></div>
 <div class="about" style="text-align:left"><b style="font-family:var(--head)">About</b><br>I am a voluntary blood donor and happy to help in emergencies.</div>
 <div class="row"><button class="btn b-r" data-call="${i}">📞 Call</button><button class="btn b-g" data-chat="${i}">💬 Chat</button></div>`;
 go('donor');
}
function showReq(i){const r=reqs[i];
 $('#rBody').innerHTML=`<div class="dt"><p><span>Name</span><b>${esc(r.n)}</b></p><p><span>Patient name</span><b>${esc(r.p)}</b></p><p><span>Hospital</span><b>${esc(r.h)}</b></p><p><span>Age</span><b>${r.age}</b></p><p><span>Reason</span><b>${esc(r.r)}</b></p><p><span>Blood needed</span><b class="bg">${esc(r.g)} · ${r.u} unit${r.u>1?'s':''}</b></p></div>
 <button class="btn b-r" id="done" style="margin-top:24px">Confirm donation received</button>`;
 $('#done').onclick=()=>go('thanks');go('rdetail');
}
$('#doReg').onclick=()=>{
 const n=$('#rn').value.trim(),a=+$('#ra').value,m=$('#rm').value.trim();
 if(!n)return toast('Enter your full name');
 if(!(a>=18&&a<=65))return toast('Donors must be 18 to 65');
 if(!$('#rl').value.trim())return toast('Enter your location');
 if(!/^\d{10}$/.test(m))return toast('Enter a 10-digit mobile number');
 donors.unshift({n,g:$('#rb').value,d:0.5,a:1,age:a,sx:$('#rg').value,last:'Never',p:m});
 ['#rn','#ra','#rl','#rm'].forEach(s=>$(s).value='');go('regok');
};
$('#doReq').onclick=()=>{
 const p=$('#qp').value.trim(),h=$('#qh').value.trim(),u=+$('#qu').value;
 if(!p||!h)return toast('Enter patient and hospital');
 if(!(u>=1))return toast('Enter at least 1 unit');
 reqs.unshift({n:S?S.name.split(' ')[0]:'You',p,h,age:'—',r:$('#qr').value.trim()||'Not given',g:$('#qb').value,u,date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})});
 ['#qp','#qh','#qr'].forEach(s=>$(s).value='');toast('Request sent to nearby donors');hist=['home'];go('requests');hist=['home','requests'];
};
/* ---- Accounts & admin ---- */
const KU='bdf_users',KE='bdf_events',KS='bdf_session',ADMIN={e:'admin@blooddonor.app',p:'Admin@123'};let mem={},S=null;
const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return mem[k]!==undefined?mem[k]:d}};
const sv=(k,v)=>{mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=t=>new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
async function hash(p){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('bdf:'+p));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return 'x'+btoa(unescape(encodeURIComponent(p)))}}
const ev=(type,email)=>{const e=ld(KE,[]);e.push({t:Date.now(),type,email});sv(KE,e)};
const err=(id,m)=>{$(id).textContent=m};
function setUser(u){S=u;$$('.uname').forEach(e=>e.textContent=u.name.split(' ')[0]);$('#pName').textContent=u.name;$('#pMail').textContent=u.email;$('#pAv').textContent=u.name[0].toUpperCase()}
function enter(u){setUser(u);sv(KS,u.email);['#sn','#se','#sp','#sc','#le','#lp'].forEach(s=>$(s).value='');err('#serr','');err('#lerr','');hist=['home'];go('home')}
function logout(){sv(KS,'');S=null;hist=['welcome'];go('welcome')}
$('#doSign').onclick=async()=>{
 const n=$('#sn').value.trim(),em=$('#se').value.trim().toLowerCase(),p=$('#sp').value;
 if(!n)return err('#serr','Enter your name');
 if(!/^\S+@\S+\.\S+$/.test(em))return err('#serr','Enter a valid email address');
 if(p.length<6)return err('#serr','Password must be at least 6 characters');
 if(p!==$('#sc').value)return err('#serr','Passwords don’t match');
 const U=ld(KU,{});if(U[em])return err('#serr','This email is already registered. Log in instead.');
 U[em]={name:n,hash:await hash(p),created:Date.now(),logins:1,last:Date.now()};sv(KU,U);ev('signup',em);ev('login',em);
 enter({name:n,email:em});
};
$('#doLogin').onclick=async()=>{
 const em=$('#le').value.trim().toLowerCase(),U=ld(KU,{}),u=U[em];
 if(!em||!$('#lp').value)return err('#lerr','Enter your email and password');
 if(!u||u.hash!==await hash($('#lp').value))return err('#lerr','Email or password is incorrect');
 u.logins++;u.last=Date.now();sv(KU,U);ev('login',em);enter({name:u.name,email:em});
};
$('#doAdmin').onclick=()=>{
 if($('#ae').value.trim().toLowerCase()===ADMIN.e&&$('#ap').value===ADMIN.p){err('#aerr','');$('#ae').value=$('#ap').value='';hist=['welcome'];go('admin');hist=['welcome','admin']}
 else err('#aerr','Incorrect admin email or password');
};
function drawAdmin(){
 const U=ld(KU,{}),E=ld(KE,[]),d0=new Date().setHours(0,0,0,0),L=E.filter(e=>e.type==='login');
 const k=[[Object.keys(U).length,'Total users'],[L.length,'Total logins'],[L.filter(e=>e.t>=d0).length,'Logins today'],[E.filter(e=>e.type==='signup'&&e.t>=d0).length,'Sign-ups today']];
 $('#kpi').innerHTML=k.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
 const days=[...Array(7)].map((_,i)=>d0-(6-i)*864e5),cnt=days.map(d=>L.filter(e=>e.t>=d&&e.t<d+864e5).length),mx=Math.max(1,...cnt);
 $('#bars').innerHTML=days.map((d,i)=>`<div><b>${cnt[i]}</b><i style="height:calc((100% - 32px) * ${cnt[i]/mx})"></i><span>${new Date(d).toLocaleDateString('en-GB',{weekday:'short'})}</span></div>`).join('');
 const r=Object.entries(U).sort((a,b)=>b[1].last-a[1].last);
 $('#uList').innerHTML=r.length?r.map(([em,u])=>`<div class="item"><div class="av">${esc(u.name[0].toUpperCase())}</div><div class="m"><b>${esc(u.name)}</b><small>${esc(em)}<br>Joined ${fmt(u.created)} · Last login ${fmt(u.last)}</small></div><span class="bg">${u.logins}×</span></div>`).join(''):'<div class="empty">No users yet.<br>Sign-ups will appear here.</div>';
}
(()=>{const em=ld(KS,''),u=em&&ld(KU,{})[em];if(u)enter({name:u.name,email:em});else draw('home')})();

/* Offline support (only when served over http/https) */
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
