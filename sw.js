const C="eitan-flash-v1",F="eitan-flash-fonts-v1",S=["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png","./icon-maskable.png","./icon.svg","./icon-maskable.svg"];
self.addEventListener("install",e=>e.waitUntil((async()=>{
  const c=await caches.open(C);
  await Promise.allSettled(S.map(async u=>{try{const r=await fetch(u,{cache:"reload"});if(r&&r.ok)await c.put(u,r);}catch(x){}}));
  await self.skipWaiting();
})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==C&&k!==F&&k.indexOf("eitan-flash-")===0)await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch",e=>{
  const q=e.request;if(q.method!=="GET")return;
  const u=new URL(q.url);
  if(q.mode==="navigate"){
    e.respondWith((async()=>{
      const c=await caches.open(C);
      try{const r=await fetch(q);if(r&&r.ok){c.put("./",r.clone());c.put("./index.html",r.clone());}return r;}
      catch(x){return await c.match("./",{ignoreSearch:true})||await c.match("./index.html",{ignoreSearch:true})
        ||new Response("<meta charset=utf-8><p>オフラインです。一度オンラインで開くと次から使えます。",{headers:{"Content-Type":"text/html; charset=utf-8"}});}
    })());return;
  }
  if(u.origin===self.location.origin){
    e.respondWith((async()=>{
      const c=await caches.open(C),h=await c.match(q,{ignoreSearch:true});
      const n=fetch(q).then(r=>{if(r&&r.ok)c.put(q,r.clone());return r;}).catch(()=>null);
      return h||await n||Response.error();
    })());return;
  }
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith((async()=>{
      const c=await caches.open(F),h=await c.match(q);if(h)return h;
      try{const r=await fetch(q);if(r&&(r.ok||r.type==="opaque"))c.put(q,r.clone());return r;}catch(x){return Response.error();}
    })());
  }
});
