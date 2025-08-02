import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CadastroCliente() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [msg, setMsg] = useState('');
const [regioes, setRegioes] = useState([]);
const [form, setForm] = useState({
  nome: '',
  telefone: '',
  endereco: '',
  regiao: '', // <-- adicione esse campo
});

  useEffect(() => {
  const carregarRegioes = async () => {
    const res = await api.get('/regioes');
    setRegioes(res.data);
  };
  carregarRegioes();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      await api.post('/clientes', { nome, telefone, endereco });
      setMsg('Cliente cadastrado com sucesso!');
      setNome('');
      setTelefone('');
      setEndereco('');
    } catch (err) {
      setMsg(err, 'Erro ao cadastrar cliente.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border-t-4 color-red-mm">
      <h2 className="text-2xl font-semibold color-red-mm mb-6 text-center">Cadastro de Cliente</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm text-sm py-2 placeholder-gray-400"
          required
        />

        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm text-sm py-2 placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={e => setEndereco(e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm text-sm py-2 placeholder-gray-400"
        />
        <label className="block mb-1 text-sm">Região</label>
        <select
          value={form.regiao}
          onChange={(e) => setForm({ ...form, regiao: e.target.value })}
          className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm text-sm py-2 bg-transparent"
        >
          <option value="">Selecione</option>
          {regioes.map((r) => (
            <option key={r._id} value={r._id}>{r.nome}</option>
          ))}
        </select>

        <button type="submit" className="w-full color-red-mm hover:bg-[#a11c23] transition text-white py-2 rounded-md text-sm font-medium">
          Cadastrar
        </button>

        {msg && <p className="text-center text-sm text-gray-600 mt-2">{msg}</p>}
      </form>
    </div>
  );
}