// SPORTHUB: shows the lock-screen alert when the alert server pushes one.
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
// Every push must show something (iPhone drops the subscription if one does not), so a message that cannot be read still shows a notice.
self.addEventListener('push',function(e){
  var d={};
  try{d=e.data?e.data.json():{}}catch(x){try{d={b:e.data.text()}}catch(y){d={}}}
  if(!d||typeof d!=='object')d={};
  var title=String(d.t||'SPORTHUB').slice(0,80);
  var body=String(d.b||'A match passed your rules. Open SPORTHUB to look.').slice(0,240);
  e.waitUntil(self.registration.showNotification(title,{
    body:body,
    tag:String(d.g||'sporthub').slice(0,60),
    renotify:true,
    icon:'icon-192.png',
    timestamp:typeof d.x==='number'?d.x:Date.now(),
    data:{u:String(d.u||'./')}
  }));
});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  // Only ever open this app: a link to anywhere else falls back to the app's own address.
  var base=new URL(self.registration.scope),u=new URL((e.notification.data&&e.notification.data.u)||'./',base);
  if(u.origin!==base.origin)u=new URL(base.href);
  // The panel answers at three addresses: the site's front address, index.html and panel.html. They are one app, so an alert for it
  // focuses a window open at any of them, and opens panel.html (the Home Screen address) when none is open.
  function key(x){return (x.pathname===base.pathname||x.pathname===base.pathname+'index.html')?x.origin+base.pathname+'panel.html':x.origin+x.pathname}
  if(u.pathname===base.pathname||u.pathname===base.pathname+'index.html')u=new URL('panel.html',base);
  var want=key(u);
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){
      var c=list[i],cu='';
      try{cu=key(new URL(c.url))}catch(err){}
      if(cu===want&&'focus' in c)return c.focus();
    }
    return self.clients.openWindow(u.href);
  }));
});
