import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BarChart2, Home, Contact, UserPlus, Package, ShoppingCart, Globe, LogOut } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useContext(AuthContext);
  

 return (
    <div
      className={`fixed inset-0  bg-opacity-40 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={onClose}
    >
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo com botão de fechar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:bg-[#a31d24] close-menu text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Navegação */}
        <nav className="space-y-4">
          <Link to="/dashboard" className="flex items-center p-2 text-gray-700 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group" onClick={onClose}>
            <Home className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Home</span>
          </Link>
          <Link to="/clientes" className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group" onClick={onClose}>
            <Contact className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Lista de Clientes</span>            
          </Link>
          <Link to="/clientes/novo" className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group" onClick={onClose}>
           <UserPlus className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Novo Cliente</span> 
            
          </Link>
          <Link to="/produtos" className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group" onClick={onClose}>
            <Package className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Produtos</span> 
            
          </Link>
          <Link to="/pedidos" className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group" onClick={onClose}>
            <ShoppingCart className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Pedidos</span>             
          </Link>
          <Link
            to="/regioes"
            className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group"
            onClick={onClose}
          >
            <Globe className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Regiões</span> 
            
          </Link>
          <Link
            to="/relatorios"
            className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group"
          >
            <BarChart2 className="text-gray-700 mr-2" />
            <span className='text-gray-700'>Relatórios</span>
          </Link>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center p-2 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group"
          >
            <LogOut className="text-gray-600 mr-2" /> 
            <span className='text-gray-700'>Sair</span>             
          </button>
        </nav>
      </aside>
    </div>
  );
}
