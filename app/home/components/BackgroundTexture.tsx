import React from 'react';

/*
  Background texture component using the educational doodle pattern image.
  Applies a blue tint and low opacity to match the page theme.
  Uses CSS background-image for seamless repeating pattern.
*/

export default function BackgroundTexture() {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50"
      style={{
        backgroundImage: 'url(/image.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        opacity: 0.18,
        filter: 'brightness(0.85) sepia(0.4) hue-rotate(200deg) saturate(0.6)',
      }}
    >
      {/* Additional blue overlay for more pronounced tint */}
      <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
    </div>
  );
}
