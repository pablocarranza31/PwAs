import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import keys from "../keys.json"; // Importa las llaves VAPID


navigator.serviceWorker.register('./sw.js',{type:'module'})
.then(registro=>{
  if(Notification.permission=='denied' || Notification.permission=='default'){
    Notification.requestPermission(permission=>{
      if(permission=='granted'){
        registro.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey:keys.publicKey
        })
        .then(res=>res.toJSON())
        .then(async json=>{//json tiene la suscripion
          //guuardar suscrpcion
          const response = await fetch('https://pwasb.onrender.com/api/subs/suscripcion',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ suscripcion: json })
          })
          .then(response=>{
            if(!response.ok){
              console.log('Estado de la respuesta:', response.status);

              throw new Error('Error en la solicitud',response.statusText);
            }
            return response.json();
          })
          .then(data=>{
            console.log('informacion guardada en la BD',data);
          })
          .catch(error=>{
            console.log(error)
            console.error('error al enviar la suscripcion',error);
          })
        })
      }
    })
  }
})

// Configuración de IndexedDB
let db = window.indexedDB.open("database");

db.onupgradeneeded = (event) => {
  let result = event.target.result;
  result.createObjectStore("Libros", { autoIncrement: true });
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
