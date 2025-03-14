import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import keys from "../keys.json"; // Importa las llaves VAPID

navigator.serviceWorker.register('./sw.js', { type: 'module' })
  .then((registro) => {
    console.log("Service Worker registrado correctamente:", registro);
  })
  .catch(error => console.error("Error al registrar el Service Worker:", error));



// Configuración de IndexedDB
let db = window.indexedDB.open("database");

db.onupgradeneeded = (event) => {
  let result = event.target.result;
  result.createObjectStore("Usuarios", { autoIncrement: true });
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
