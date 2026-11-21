const API = '/api';
let token = localStorage.getItem('nt_token') || '';
let currentUser = JSON.parse(localStorage.getItem('nt_user') || 'null');
let active = 'todo';
let authMode = 'login';
let busy = false;
let cache = { todos: [], posts: [] };
const app = document.querySelector('#app');

const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function request(path, options={}) {
  const headers = { 'Content-Type':'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'So‘rov bajarilmadi');
  return data;
}
function toast(message, bad=false) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.append(el); }
  el.textContent = message; el.classList.toggle('bad', bad); el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 3200);
}
function field(label, name, type='text', placeholder='', required=true, extra='') {
  return `<label class="field"><span>${label}${required ? ' <i>*</i>' : ''}</span><input name="${name}" type="${type}" placeholder="${placeholder}" ${required?'required':''} ${extra}></label>`;
}
function authView() {
  const register = authMode === 'register';
  app.innerHTML = `<main class="auth-wrap"><section class="auth-brand"><div class="brand-mark">N</div><div><b>NAJOT TA'LIM</b><small>STUDENT MANAGEMENT</small></div></section><section class="auth-card"><div class="eyebrow">NAJOT TA'LIM · STUDENT PORTAL</div><h1>${register?'Hisob yaratish':'Xush kelibsiz!'}</h1><p class="muted">${register?'Ma’lumotlaringizni kiriting va ro‘yxatdan o‘ting.':'Davom etish uchun hisobingizga kiring.'}</p><form id="auth-form" class="form-grid">${register ? field('Ism','firstname','text','Ismingiz')+field('Familiya','lastname','text','Familiyangiz') : ''}${field('Email','email','email','name@example.com')}${field('Parol','password','password','Kamida 6 ta belgi',true,'minlength="6"')}<button class="primary full" ${busy?'disabled':''}>${busy?'Kutilmoqda…':register?'Ro‘yxatdan o‘tish':'Kirish'} <span>→</span></button></form><p class="switch-auth">${register?'Hisobingiz bormi?':'Hisobingiz yo‘qmi?'} <button id="switch-auth">${register?'Kirish':'Ro‘yxatdan o‘tish'}</button></p></section><div class="auth-foot">© ${new Date().getFullYear()} Najot Ta’lim · Ta’lim orqali kelajak sari</div></main>`;
  document.querySelector('#switch-auth').onclick = () => { authMode = register?'login':'register'; authView(); };
  document.querySelector('#auth-form').onsubmit = submitAuth;
}
async function submitAuth(e) {
  e.preventDefault(); if (busy) return; busy=true; authView();
  const data = Object.fromEntries(new FormData(e.target).entries());
  try {
    const result = await request(authMode==='register'?'/auth/register':'/auth/login',{method:'POST',body:JSON.stringify(data)});
    token=result.token; currentUser=result.user; localStorage.setItem('nt_token',token); localStorage.setItem('nt_user',JSON.stringify(currentUser));
    await loadData();
  } catch(err) { toast(err.message,true); }
  finally { busy=false; if (!token) authView(); }
}
const nav = [
  ['todo','✓','Yangi todo'], ['user','♙','Yangi user'], ['post','▤','Yangi post'], ['list-todo','☷','Todo ro‘yxati'], ['list-post','▧','Postlar']
];
function shell(content) {
  app.innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand"><div class="brand-mark">N</div><div><b>NAJOT TA'LIM</b><small>STUDENT PORTAL</small></div></div><div class="nav-caption">ASOSIY</div><nav>${nav.map(([id,icon,label])=>`<button class="nav-link ${active===id?'active':''}" data-page="${id}"><span class="nav-icon">${icon}</span>${label}</button>`).join('')}</nav><div class="side-bottom"><div class="avatar">${esc((currentUser?.firstname||'U').slice(0,1).toUpperCase())}</div><div class="user-meta"><b>${esc((currentUser?.firstname||'').trim()+' '+(currentUser?.lastname||''))}</b><small>${esc(currentUser?.email||'')}</small></div><button class="logout" id="logout" title="Chiqish">↗</button></div></aside><main class="main"><header class="topbar"><div><div class="eyebrow">NAJOT TA'LIM / WORKSPACE</div><h2>${nav.find(n=>n[0]===active)?.[2]||'Boshqaruv'}</h2></div><div class="top-user"><span class="status-dot"></span> Tizim faol <div class="top-avatar">${esc((currentUser?.firstname||'U').slice(0,1).toUpperCase())}</div></div></header><section class="content">${content}</section><footer>NAJOT TA’LIM <span>·</span> Student management</footer></main></div>`;
  document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{active=b.dataset.page; renderPage();});
  document.querySelector('#logout').onclick=logout;
  document.querySelectorAll('form[data-action]').forEach(f=>f.onsubmit=submitData);
}
function cardForm(title, desc, fields, action, button) {
  return `<div class="page-intro"><div class="eyebrow">MA’LUMOTLARNI BOSHQARISH</div><h1>${title}</h1><p>${desc}</p></div><section class="panel"><div class="panel-head"><div><h3>${title}</h3><p>Barcha yulduzcha (*) bilan belgilangan maydonlar majburiy.</p></div><span class="panel-tag">YANGI</span></div><form class="form-grid" data-action="${action}">${fields}<div class="form-actions"><button class="primary">${button}<span>→</span></button></div></form></section>`;
}
function pageContent() {
  if(active==='todo') return cardForm('Yangi todo qo‘shish','Vazifa ma’lumotlarini kiriting.',field('Sarlavha','title','text','Masalan: Dars tayyorlash')+`<label class="field wide"><span>Tavsif <i>*</i></span><textarea name="description" placeholder="Vazifa haqida batafsil..." required rows="4"></textarea></label>`+`<label class="field"><span>Bajarilganmi? <i>*</i></span><select name="isCompleted" required><option value="false" selected>Yo‘q, bajarilmagan</option><option value="true">Ha, bajarilgan</option></select></label>`,'todo','Todo saqlash');
  if(active==='user') return cardForm('Yangi user qo‘shish','Yangi foydalanuvchi ma’lumotlarini kiriting.',field('Ism','firstname','text','Ism')+field('Familiya','lastname','text','Familiya')+field('Email','email','email','name@example.com')+field('Telefon','phone','tel','+998 90 123 45 67'),'user','User qo‘shish');
  if(active==='post') return cardForm('Yangi post qo‘shish','Post sarlavhasi va matnini kiriting.',field('Sarlavha','title','text','Post sarlavhasi')+`<label class="field wide"><span>Post matni <i>*</i></span><textarea name="content" placeholder="Post matnini yozing..." required rows="6"></textarea></label>`,'post','Postni joylash');
  if(active==='list-todo') return `<div class="page-intro"><div class="eyebrow">VAZIFALAR</div><h1>Todo ro‘yxati</h1><p>Saqlangan vazifalaringiz.</p></div><section class="panel"><div class="panel-head"><div><h3>Barcha todolar</h3><p>${cache.todos.length} ta vazifa</p></div><button class="secondary" data-page="todo">+ Yangi todo</button></div>${cache.todos.length?`<div class="records">${cache.todos.map(t=>`<article class="record"><div class="record-check ${t.isCompleted?'done':''}">${t.isCompleted?'✓':'·'}</div><div class="record-body"><b>${esc(t.title)}</b><p>${esc(t.description||'')}</p></div><span class="record-state ${t.isCompleted?'done':''}">${t.isCompleted?'Bajarilgan':'Jarayonda'}</span></article>`).join('')}</div>`:'<div class="empty">Hozircha todo yo‘q.</div>'}</section>`;
  return `<div class="page-intro"><div class="eyebrow">YANGILIKLAR</div><h1>Postlar</h1><p>Yaratilgan postlar ro‘yxati.</p></div><section class="panel"><div class="panel-head"><div><h3>Barcha postlar</h3><p>${cache.posts.length} ta post</p></div><button class="secondary" data-page="post">+ Yangi post</button></div>${cache.posts.length?`<div class="records">${cache.posts.map(p=>`<article class="record post-record"><div class="post-symbol">▤</div><div class="record-body"><b>${esc(p.title)}</b><p>${esc(p.content)}</p></div></article>`).join('')}</div>`:'<div class="empty">Hozircha post yo‘q.</div>'}</section>`;
}
function renderPage(){ shell(pageContent()); document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{active=b.dataset.page;renderPage();}); }
async function loadData(){ try { const [todos,posts]=await Promise.all([request('/todos'),request('/posts')]); cache={todos,posts}; renderPage(); } catch(e){ token=''; currentUser=null; localStorage.removeItem('nt_token'); localStorage.removeItem('nt_user'); toast(e.message,true); authView(); } }
async function submitData(e){ e.preventDefault(); const form=e.currentTarget; const data=Object.fromEntries(new FormData(form).entries()); const action=form.dataset.action; if(action==='todo') data.isCompleted=data.isCompleted==='true'; try { await request(action==='todo'?'/todos':action==='user'?'/users':'/posts',{method:'POST',body:JSON.stringify(data)}); toast(action==='todo'?'Todo saqlandi':action==='user'?'Yangi user qo‘shildi':'Post joylandi'); if(action==='todo') cache.todos=await request('/todos'); if(action==='post') cache.posts=await request('/posts'); if(action==='user') { form.reset(); return; } active=action==='todo'?'list-todo':'list-post'; renderPage(); } catch(err){toast(err.message,true);} }
function logout(){token='';currentUser=null;localStorage.removeItem('nt_token');localStorage.removeItem('nt_user');cache={todos:[],posts:[]};authMode='login';authView();}
function render(){ if(!token){authView();return;} loadData(); }
render();
