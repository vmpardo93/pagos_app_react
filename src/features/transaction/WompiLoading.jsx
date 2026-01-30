import React from 'react';
import './WompiLoading.css';

export default function WompiLoading() {
  return (
    <div className="wompi-loading" role="status" aria-live="polite">
      <div className="wompi-loading__spinner" aria-hidden />
      <p className="wompi-loading__text">Cargando API de Wompi</p>
    </div>
  );
}
