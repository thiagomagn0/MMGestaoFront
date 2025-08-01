import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DefaultLayout() {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header onToggleSidebar={() => setSidebarAberta(true)} />
      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />

      {/* Aqui usamos o Outlet para renderizar os filhos da rota */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}