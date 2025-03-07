import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete = () => {} }) => { // Asegura que siempre haya una función
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);

      const timer2 = setTimeout(() => {
        onComplete(); // Llamamos a la función correctamente
      }, 500);

      return () => clearTimeout(timer2);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: 'white' }}>
      <img src="/icons/logoutzmg192x192.png" alt="Logo" className="w-16 h-16" />
    </div>
  );
};

export default SplashScreen;

