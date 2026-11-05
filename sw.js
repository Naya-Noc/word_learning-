const C='ficdeck-v8';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
const OPTIONAL=['./defs-wn.zip','./defs-simple.zip'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(CORE);for(const f of OPTIONAL){try{const r=await fetch(f);if(r.ok)await c.put(f,r)}catch(_){}}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit||Response.error());
    return hit||net;
  }));
});
