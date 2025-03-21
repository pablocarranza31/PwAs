

self.addEventListener('install',event=>{
    caches.open('appShell-v6')
    .then(cache=>{
        cache.addAll([
            "/index.html",  
            "/src/index.html",   
            "/src/App.css",
            "/src/App.jsx",
            "/src/main.jsx",
            "/src/components/Home.js",	
            "/src/components/Login.js",
            "/src/components/Register.js",
            "/src/components/Main.js"

        ])
    })
    self.skipWaiting();
})

function InsertIndexedDB(data){
    let db=window.indexedDB.open("database");

    db.onupgradeneeded = event => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("Usuarios")) {
            db.createObjectStore("Usuarios", { keyPath: "id", autoIncrement: true });
        }
    };

    db.onsuccess=event=>
    {
        let result=event.target.result;

        let transaction=result.transaction("Usuarios","readwrite");
        let obj=transaction.objectStore("Usuarios");

        const resultado=obj.add(data);

        resultado.onsuccess=event2=>
        {
            //console.log("insersion",event2.target.result);
            self.registration.sync.register("syncUsuarios");
        }
    }
    
    db.onerror = event => {
        console.error("Error al abrir IndexedDB:", event.target.error);
    };
}


self.addEventListener("activate",event=>{
    caches.delete("appShell-v5");
    caches.delete("dinamico-v5");
});



self.addEventListener('fetch', event=>{
    
    /*caches.match(event.request)
    .then();*/
    if (!event.request.url.startsWith("http")) return; // Evita errores con extensiones


    if (event.request.method === "POST") {
        event.request.clone().json()
            .then(body => {
                return fetch(event.request).catch(() => {
                    InsertIndexedDB(body);
                    return new Response(JSON.stringify({ message: "Datos guardados offline" }), { headers: { "Content-Type": "application/json" } });
                });
            })
            .catch(error => console.error("Error al procesar el body del POST:", error));
    } else {

        const respuesta = fetch (event.request)
        .then(resp=>{
            if(!resp){
                return caches.match(event.request);
            }else{
               caches.open('dinamico-v6')
               .then(cache=>{
                cache.put(event.request, resp);
                })
            return resp.clone();
            }
            
        })
        .catch(error=>{
            //console.log(error);
            self.registration.sync.register("insertar");
            return caches.match(event.request)
        });
        event.respondWith(respuesta)  
    }   
});


self.addEventListener("push", (event) => {

    let options={
        body:event.data.text(),
        icon:"/icon.png",
        Image:"/icon.png",
    }
    
    self.registration.showNotification("Titulo",options); 
     
  });


// Escuchar evento de sincronización
self.addEventListener('sync', event => {
    if (event.tag === "syncUsuarios") {
        event.waitUntil(
            new Promise((resolve, reject) => {
                let dbRequest = indexedDB.open("database", 1);

                dbRequest.onsuccess = event => {
                    let db = event.target.result;
                    let transaction = db.transaction("Usuarios", "readonly");
                    let store = transaction.objectStore("Usuarios");

                    let getAllRequest = store.getAll();

                    getAllRequest.onsuccess = () => {
                        let Usuarios = getAllRequest.result;
                        if (Usuarios.length === 0) {
                            resolve();
                            return;
                        }

                        let postPromises = Usuarios.map(Usuarios =>
                            fetch('https://pwasb.onrender.com/api/subs/registro', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(Usuarios)
                            })
                        );

                        Promise.all(postPromises)
                            .then(() => {
                                let deleteTransaction = db.transaction("Usuarios", "readwrite");
                                let deleteStore = deleteTransaction.objectStore("Usuarios");
                                deleteStore.clear();
                                resolve();
                            })
                            .catch(reject);
                    };
                };

                dbRequest.onerror = reject;
            })
        );
    }
});

//const webpush=require('web-push');