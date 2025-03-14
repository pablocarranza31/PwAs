import React from 'react';
import '../App.css';
import keys from "../../keys.json"; // Importa las llaves VAPID


function Main() {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario
console.log('ID del usuario:', userId);


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
            body: JSON.stringify({ userId,suscripcion: json })
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
            <tr>
              <td>1</td>
              <td>Juan Pérez</td>
              <td>juan@example.com</td>
            </tr>
            <tr>
              <td>2</td>
              <td>María Gómez</td>
              <td>maria@example.com</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Main;
