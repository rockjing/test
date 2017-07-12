//cachestorage名称，可以加上版本号予以区分
const OFFLINE_CACHE_PREFIX = 'offline_page_';
const CACHE_VERSION = 'v1.0';
const OFFLINE_CACHE_NAME = OFFLINE_CACHE_PREFIX + CACHE_VERSION;

self.addEventListener('message', function(event) {

    var promise = self.clients.matchAll()
        .then(function(clientList) {
            var senderID = event.source ? event.source.id : 'unknown';

            if (!event.source) {
                console.log('event.source is null; we don\'t know the sender of the ' +
                    'message');
            }

            clientList.forEach(function(client) {

                if (client.id === senderID) {
                    return;
                }
                client.postMessage({
                    client: senderID,
                    message: event.data
                });
            });
        });


    if (event.waitUntil) {
        event.waitUntil(promise);
    }
});


self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

//rock add
//Service Worker 请求拦截事件
this.addEventListener('fetch', function(event)  {
   var url;
    url =event.request.url;
  event.respondWith(
    caches.open(OFFLINE_CACHE_NAME).then(function(cache) {
      return cache.match(event.request.url);
    }).then(function(response){
      //response为空表明未匹配成功，交由fetch方法去网络拉取
      if(response) {
        return response;
      }
      return fetch(event.request);
    })
  ); 
});

