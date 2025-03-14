import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import keys from "../keys.json"; // Importa las llaves VAPID

navigator.serviceWorker.register('./sw.js', { type: 'module' })
  .then(async (registro) => {
    if (Notification.permission === 'denied' || Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        
        // ✅ Verificar si ya existe una suscripción
        const existingSubscription = await registro.pushManager.getSubscription();
        
        if (!existingSubscription) {
          console.log("No hay suscripción, creando una nueva...");
          // Si no existe suscripción, se crea una nueva
          registro.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: keys.publicKey
          })
          .then(res => res.toJSON())
          .then(async json => {
            try {
              const response = await fetch('https://pwasb.onrender.com/api/subs/suscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suscripcion: json })
              });

              if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
              }

              const data = await response.json();
              console.log('Información guardada en la BD', data);
            } catch (error) {
              console.error('Error al enviar la suscripción', error);
            }
          });
        } else {
          console.log('El usuario ya está suscrito, no se crea una nueva.');
        }
      }
    }
  })
  .catch(error => console.error("Error al registrar el Service Worker:", error));


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
