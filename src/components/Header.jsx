import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Mapear nomes amigáveis das rotas
  const routeNames = {
    '/dashboard': 'Home',
    '/clientes': 'Clientes',
    '/clientes/novo': 'Clientes',
    '/regioes': 'Regiões',
    '/produtos': 'Produtos',
    '/pedidos': 'Pedidos',
    '/login': 'Login',
    '/cadastro': 'Cadastro',
    '/relatorios': 'Relatórios',
  };

  const currentPath = location.pathname;
  let pageTitle = routeNames[currentPath];
  if (!pageTitle) {
  if (/^\/clientes\/[^/]+\/pedido$/.test(currentPath)) {
    pageTitle = 'Adicionar Pedido';
  } else {
    pageTitle = 'App';
  }
} 

  const mostrarBotaoVoltar = currentPath !== '/dashboard';

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0">
      <div className="flex items-center gap-4">
       
        {mostrarBotaoVoltar && (
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
      <span className="text-2xl font-semibold text-gray-800 text-center flex-1">
        {pageTitle}
      </span>
       <button onClick={onToggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      
    </header>
  );
}