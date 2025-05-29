import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="text-xl font-bold tracking-wide">🚀 NASA APOD Explorer</div>
      <a
        href="https://apod.nasa.gov/apod/astropix.html"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-sm"
      >
        Offisiell APOD
      </a>
    </nav>
  );
}