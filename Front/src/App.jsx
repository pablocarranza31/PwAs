import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Main from './components/Main';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula la carga de recursos o la inicialización de la PWA
    setTimeout(() => {
      setLoading(false); // Después de 3 segundos, cambia el estado a false
    }, 3000);
  }, []);

  return (
    <div className="p-4">
      {/* Si está cargando, muestra el SplashScreen */}
      {loading ? (
        <SplashScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
