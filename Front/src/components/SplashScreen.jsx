import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Solo ejecuta el efecto una vez, para evitar la repetición del setTimeout
    const timer = setTimeout(() => {
      setFade(true);

      // Llama a onComplete con un tiempo adicional después del fade-out
      const timer2 = setTimeout(() => {
        onComplete();
      }, 500); // Tiempo después de que termina el fade-out

      // Limpieza del timer2
      return () => clearTimeout(timer2);

    }, 2000); // Tiempo total del splash (visible)

    // Limpieza del primer timer
    return () => clearTimeout(timer);

  }, [onComplete]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: 'white' }}>
      <img src="/icons/logoutzmg192x192.png" alt="Logo" className="w-16 h-16" />
    </div>
  );
};

export default SplashScreen;
