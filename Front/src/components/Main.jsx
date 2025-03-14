import React, { useEffect, useState } from 'react';
import '../App.css';
import keys from "../../keys.json"; // Importa las llaves VAPID


function Main() {
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario
console.log('ID del usuario:', userId);

useEffect(() => {
  if (userRole === 'admin') {
    fetch('https://pwasb.onrender.com/api/subs/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        return response.json();
      })
      .then(data => setUsers(data))
      .catch(error => console.error('Error al cargar los usuarios:', error));
  }
}, [userRole]);


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
              body: JSON.stringify({ userId, suscripcion: json })
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

  return (
    <div className="page-container">
      <h2 className="page-title">Bienvenid</h2>
      <h2 className="page-title">Login</h2>      <button
        className="button"
        onClick={() => alert('¡Ora culo!')}
      >
        Click
      </button>

      {/* Mostrar tabla solo si el usuario es admin */}
      {userRole === 'admin' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => alert(`Acción para ${user.nombre}`)}>Acción</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Main;
