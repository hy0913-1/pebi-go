/* 피비 GO 서비스워커 — 수정할 때마다 VERSION 올리기
   pebi_*.usdz(AR 사진용)는 미리 받지 않고, 처음 열 때 받아서 캐시 */
const VERSION='pebigo-v4';
const CORE_CACHE=VERSION+'-core';
const RUNTIME_CACHE=VERSION+'-runtime';
const CORE=[
  './','./index.html','./manifest.webmanifest',
  './icon-180.png','./icon-192.png','./icon-512.png',
  './pebi.glb','./face.json','./tex.json','./voice.json'
];
const EXTERNAL=[
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const core=await caches.open(CORE_CACHE);
    for(const url of CORE){try{await core.add(new Request(url,{cache:'reload'}))}catch(e){}}
    const rt=await caches.open(RUNTIME_CACHE);
    for(const url of EXTERNAL){try{const req=new Request(url,{mode:'no-cors',cache:'reload'});await rt.put(req,await fetch(req))}catch(e){}}
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keep=new Set([CORE_CACHE,RUNTIME_CACHE]);
    for(const k of await caches.keys())if(!keep.has(k))await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{const fresh=await fetch(req);const c=await caches.open(CORE_CACHE);c.put('./index.html',fresh.clone()).catch(()=>{});return fresh}
      catch(e){return (await caches.match(req))||(await caches.match('./index.html'))}
    })());return;
  }
  event.respondWith((async()=>{
    const hit=await caches.match(req);if(hit)return hit;
    try{const fresh=await fetch(req);
      if(fresh&&(fresh.ok||fresh.type==='opaque')){const c=await caches.open(RUNTIME_CACHE);c.put(req,fresh.clone()).catch(()=>{})}
      return fresh}catch(e){return hit||Response.error()}
  })());
});
