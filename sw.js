const C='ficdeck-v10';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
const OPTIONAL=['./defs-wn.zip','./defs-simple.zip'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{for(const f of CORE.concat(OPTIONAL)){try{const r=await fetch(f,{cache:'reload'});if(r.ok)await c.put(f,r)}catch(_){}}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  const isPage=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html');
  if(isPage){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
      .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})));
});
