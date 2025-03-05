import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';



function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://pwasb.onrender.com/api/subs/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, telefono, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
       // alert('Registro exitoso. Ahora puedes iniciar sesión.');
        //navigate('/login');
        console.log(data);
      } else {
        setError(data.message || 'Error al registrarte.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtalo nuevamente.');
    }
  };


  function InsertIndexedDB(data) {
    let dbRequest = window.indexedDB.open("database");

    dbRequest.onsuccess = event => {
        let db = event.target.result;
        let transaction = db.transaction("Libros", "readwrite");
        let objStore = transaction.objectStore("Libros");

        let addRequest = objStore.add(data);

        addRequest.onsuccess = event2 => {
            console.log("Datos insertados en IndexedDB:", event2.target.result);

            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready
                    .then(registration => {
                        console.log("Intentando registrar la sincronización...");
                        return registration.sync.register("syncLibros");
                    })
                    .then(() => {
                        console.log("✅ Sincronización registrada con éxito");
                    })
                    .catch(err => {
                        console.error("❌ Error registrando la sincronización:", err);
                    });
            } else {
                console.warn("⚠️ Background Sync no es soportado en este navegador.");
            }
        };

        addRequest.onerror = () => {
            console.error("❌ Error insertando en IndexedDB");
        };
    };

    dbRequest.onerror = () => {
        console.error("❌ Error abriendo IndexedDB");
    };
}

  return (
    <div className="page-container">
      <h2 className="page-title">Registro</h2>
      {error && <p className="login-error">{error}</p>}
      <form  className="form" onSubmit={handleRegister}>
      <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu Nombre completo"
            //required
          />
        </div>
        <div className="form-group">
          <label>Telefono:</label>
          <input
            type="number"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ingresa tu Telefono"
            //required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu email"
            //required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            //required
          />
        </div>
      <button type="submit" className="button">
        Registrarse
      </button>
        
      </form>
      <p className="link">
        ¿Ya tienes cuenta? <span onClick={() => navigate('/login')}>Inicia sesión aquí</span>
      </p>
      {/*<button  onClick={()=>InsertIndexedDB({nombre:"pablo",password:"hola"})} className="button">
          Registrarse
        </button>*/}
       
    </div>
  );
}

export default Register;
