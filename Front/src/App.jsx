import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Main from './components/Main';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-4">
      
        <Router>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </Router>
    
    </div>
  );
}

export default App;
