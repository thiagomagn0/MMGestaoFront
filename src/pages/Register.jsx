import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await api.post('/auth/register', { email, senha });
      setMsg(res.data.msg || 'Usuário cadastrado com sucesso!');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const erro = err.response?.data?.msg || 'Erro ao registrar';
      setMsg(erro);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar Usuário</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">
          Cadastrar
        </button>

        {msg && <div className="text-center mt-4 text-sm text-gray-700">{msg}</div>}
      </form>

      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Já tem conta? Entrar
        </Link>
      </div>
    </div>
  );
}