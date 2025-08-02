import { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2 } from 'lucide-react';

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        buscarPedidos();
    }, []);

    const buscarPedidos = async () => {
    const res = await api.get('/pedidos/getPedidos'); // <-- aqui você atualiza
    setPedidos(res.data);
    };
    const excluirPedido = async (id) => {
        const confirmar = confirm('Tem certeza que deseja excluir este pedido?');
        if (!confirmar) return;

        try {
            await api.delete(`/pedidos/${id}`);
            buscarPedidos(); // Atualiza a lista após exclusão
        } catch (err) {
            console.error('Erro ao excluir pedido:', err);
            alert('Erro ao excluir pedido');
        }
    };

  const pedidosFiltrados = pedidos.filter((pedido) =>
    pedido.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border-b border-gray-300 px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pedidosFiltrados.map((pedido) => (
          <div key={pedido._id} className="bg-gray-50 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg color-red-mm-txt">
                  {pedido.cliente?.nome || 'Cliente removido'}
                </div>
                <div className="text-gray-500 text-sm">
                   Total: R$ {pedido.total.toFixed(2)}
                </div>
              </div>
              <div>
                {/* <ul className="text-sm text-gray-700">
                  {pedido.produtos.map((p, idx) => (
                    <li key={idx}>
                      {p.produto?.nome || 'Produto removido'} x {p.quantidade}
                    </li>
                  ))}
                </ul> */}
                <button
                    onClick={() => excluirPedido(pedido._id)}
                    className="color-red-mm-txt hover:underline text-sm"
                    >
                    <Trash2 className="inline" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pedidos.length === 0 && (
          <p className="text-center text-gray-500">Nenhum pedido cadastrado</p>
        )}
      </div>
    </div>
  );
}