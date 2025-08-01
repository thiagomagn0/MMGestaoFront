// src/components/TopClientes.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Award } from 'lucide-react';

export default function TopClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get('/graficos/top-clientes');
        setClientes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Erro ao carregar top clientes', err);
      }
    }
    carregar();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <div className="flex items-center mb-4">
        <Award className="text-green-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">Top 5 Clientes</h2>
      </div>

      <ul className="divide-y divide-gray-200">
        
        {Array.isArray(clientes) && clientes.map((c, index) => (
            <li key={c._id} className="flex justify-between py-2 items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">{index + 1}º</span>
                <span className="text-gray-800 font-semibold">{c.nome}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Pedidos: <strong>{c.totalPedidos ?? 0}</strong>
                </div>
                <div className="text-sm text-gray-500">
                  Total: <strong>R$ {(c.valorTotal ?? 0).toFixed(2)}</strong>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
