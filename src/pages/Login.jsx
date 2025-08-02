import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(form.email, form.senha);
    navigate('/dashboard');
  } catch (err) {
    console.error('Erro no login:', err);

    if (err.response?.data?.msg) {
      setErro(err.response.data.msg);
    } else {
      setErro('Erro inesperado no login.');
    }
  }
};

  return (
    <div className="min-h-screen content-login flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 text-center">
        
        {/* LOGO */}
        <img
          src="/logo.png" // substitua pelo caminho da sua imagem
          alt="Logo"
          className="w-24 h-24 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>

        {erro && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border-b border-gray-300 focus:border-red-700 outline-none py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full border-b border-gray-300 focus:border-red-700 outline-none py-2 text-sm"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full btn-submit text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
