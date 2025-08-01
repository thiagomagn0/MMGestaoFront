import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import ListaClientes from './pages/ListaClientes';
import ListaProdutos from './pages/ListaProdutos';
import CriarPedido from './pages/CriarPedido';
import ListaRegioes from './pages/ListaRegioes';
import ListaPedidos from './pages/ListaPedidos';
import Relatorios from './pages/Relatorios'; // ou o caminho correto
import DefaultLayout from './layouts/DefaultLayout';
import { useContext, useEffect  } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { setLogoutHandler } from './services/api';

export default function App() {
  const { token } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

   useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas com layout */}
        {token && (
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<ListaClientes />} />
            <Route path="/clientes/novo" element={<CadastroCliente />} />
            <Route path="/clientes/:id/pedido" element={<CriarPedido />} />
            <Route path="/produtos" element={<ListaProdutos />} />
            <Route path="/regioes" element={<ListaRegioes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/pedidos" element={<ListaPedidos />} />
            {/* ...outras rotas */}
          </Route>
        )}

        {/* Redirecionamento */}
        <Route
          path="*"
          element={<Navigate to={token ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
}