// src/components/TopProdutos.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Trophy } from 'lucide-react';

export default function TopProdutos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get('/graficos/top-produtos');
        setProdutos(res.data);
      } catch (err) {
        console.error('Erro ao carregar top produtos', err);
      }
    }
    carregar();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <div className="flex items-center mb-4">
        <Trophy className="text-yellow-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">Top 5 Produtos</h2>
      </div>

      <ul className="divide-y divide-gray-200">
     {Array.isArray(produtos) && produtos.map((p, index) => (
          <li key={p._id} className="flex justify-between py-2 items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">{index + 1}º</span>
              <span className="text-gray-800 font-semibold">{p.nome}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Qtd: <strong>{p.quantidade}</strong></div>
              <div className="text-sm text-gray-500">Total: <strong>R$ {p.total?.toFixed(2) || '0,00'}</strong></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
