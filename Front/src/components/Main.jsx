import React from 'react';
import '../App.css';

function Main() {
  return (
    <div className="page-container">
      <h2 className="page-title">Bienvenid</h2>
      <h2 className="page-title">Login</h2>      <button
        className="button"
        onClick={() => alert('¡Ora culo!')}
      >
        Click
      </button>
    </div>
  );
}

export default Main;
