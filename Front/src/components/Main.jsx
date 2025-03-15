import React, { useEffect, useState } from 'react';
import '../App.css';
import keys from "../../keys.json"; // Importa las llaves VAPID


function Main() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [message, setMessage] = useState(""); // Estado para almacenar el mensaje
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

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

const registerServiceWorker = async () => {
  try {
    const registro = await navigator.serviceWorker.register('./sw.js', { type: 'module' });
    if (Notification.permission === 'denied' || Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // ✅ Verificar si ya existe una suscripción
        const existingSubscription = await registro.pushManager.getSubscription();

        if (!existingSubscription) {
          console.log("No hay suscripción, creando una nueva...");
          // Si no existe suscripción, se crea una nueva
          const subscription = await registro.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: keys.publicKey
          });

          const json = subscription.toJSON();
          // Enviar suscripción a la base de datos
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
        } else {
          console.log('El usuario ya está suscrito, no se crea una nueva.');
        }
      }
    }
  } catch (error) {
    console.error("Error al registrar el Service Worker:", error);
  }
};

// Llamamos a la función de suscripción solo una vez, al montar el componente
useEffect(() => {
  registerServiceWorker();
}, []);

const handleOpenModal = (user) => {
  setSelectedUser(user);
  setIsModalOpen(true); // Abrir el modal
};

const handleCloseModal = () => {
  setIsModalOpen(false); // Cerrar el modal
  setMessage(""); // Limpiar el mensaje
};

const handleSendMessage = async () => {
  try {
    // Enviar la suscripción y el mensaje al backend
    const response = await fetch('https://pwasb.onrender.com/api/subs/suscripcionMod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suscripcion: selectedUser.suscripcion, // Enviar la suscripción del usuario
        mensaje: message // Enviar el mensaje
      })
    });

    if (!response.ok) {
      throw new Error('Error al enviar el mensaje');
    }

    const data = await response.json();
    console.log('Mensaje enviado:', data);
    alert('Mensaje enviado con éxito');
    handleCloseModal();
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    alert('Hubo un error al enviar el mensaje');
  }
};



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
                  <button onClick={() => handleOpenModal(user)}>Enviar Mensaje</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enviar mensaje a {selectedUser.nombre}</h3>
            <textarea
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cerrar</button>
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
