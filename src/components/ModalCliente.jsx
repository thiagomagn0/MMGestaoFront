// ModalCliente.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { ArrowDown } from 'lucide-react';
import SelectRegiao from './InputRegiao';

export function ModalCliente({ cliente, onClose, onAtualizado }) {
  const [aba, setAba] = useState('dados');
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '', regiao: '' });
  const [editando, setEditando] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [show, setShow] = useState(false);

useEffect(() => {
  async function carregar() {
    try {
      const res = await api.get('/regioes');
      setRegioes(res.data);

      if (cliente) {
        
        setForm({
          nome: cliente.nome || '',
          telefone: cliente.telefone || '',
          endereco: cliente.endereco || '',
          regiao: cliente.regiao || '',  // precisa garantir que já tenha regioes
        });
        buscarHistorico(cliente._id);
      }
    } catch (err) {
      console.error('Erro ao carregar regiões:', err);
    }
  }

  carregar();
  setShow(true);
}, [cliente]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300); // espera o tempo da animação para fechar
  }

const buscarHistorico = async (clienteId) => {
  const res = await api.get(`/pedidos?clienteId=${clienteId}`);
  console.log('Histórico de pedidos:', res.data);
  const ultimos = res.data
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5)
    .flatMap(p => 
      p.produtos.map(prod => ({
        produtoNome: prod.produto?.nome || 'Sem nome',
        data: p.data,
      }))
    );
  setHistorico(ultimos);
};

  const handleSalvar = async () => {
    await api.put(`/clientes/${cliente._id}`, form);
    onAtualizado();
    setEditando(false);
    onClose();
  };

  function maskTelefone(telefone) {
    if (!telefone) return '';
    // Remove tudo que não for número e limita a 11 dígitos
    const onlyNums = telefone.replace(/\D/g, '').slice(0, 11);
    if (onlyNums.length <= 10)
      return onlyNums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return onlyNums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR');

  return (
    <div  className="backdrop-blur fixed inset-0 transition-opacity duration-300 z-40 bg-opacity-50"
        >
      <div className={`fixed modal-cliente bottom-0 left-1/2 max-w-md w-full bg-white rounded shadow-lg p-6
        transform -translate-x-1/2
        transition-all duration-300
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex justify-between mb-4  pb-2">
          <h2 className="text-3xl font-bold ">{cliente.nome}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-black button-close--modal">
            <ArrowDown size={36} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setAba('dados')}
            className={`flex-1 py-2 text-center !text-xl  transition-all 
              ${aba === 'dados' 
              ? 'text-[#B72029] font-bold border-b-2 border-[#B72029]' 
              : 'text-gray-500 hover:text-[#B72029]/70'}`}>Dados</button>
          <button
            onClick={() => setAba('historico')}
            className={`flex-1 py-2 text-center !text-xl transition-all 
            ${aba === 'historico' 
            ? 'text-[#B72029] font-bold border-b-2 border-[#B72029]' 
            : 'text-gray-500 hover:text-[#B72029]/70'}`}>Histórico</button>
        </div>

        {aba === 'dados' && (
          <div className="space-y-4">
             {/* Nome */}
            <div>
              <label className="text-sm text-gray-400">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                disabled={!editando}
                className="w-full text-lg border-b border-gray-300 focus:border-[#B72029] outline-none py-2 bg-transparent"
              />
            </div>

             {/* Telefone */}
            <div>
              <label className="text-sm text-gray-400">Telefone</label>
              <input
                type="text"
                value={editando ? form.telefone : maskTelefone(form.telefone)}
                onChange={e => setForm({ ...form, telefone: maskTelefone(e.target.value) })}
                disabled={!editando}
                className="w-full text-lg border-b border-gray-300 focus:border-[#B72029] outline-none py-2 bg-transparent"
              />
            </div>

             {/* Endereço */}
            <div>
              <label className="text-sm text-gray-400">Endereço</label>
              <input
                type="text"
                value={form.endereco}
                onChange={e => setForm({ ...form, endereco: e.target.value })}
                disabled={!editando}
                className="w-full text-lg border-b border-gray-300 focus:border-[#B72029] outline-none py-2 bg-transparent"
              />
            </div>

            {/* Região */}    
            <div>
            <SelectRegiao
                  value={form.regiao}
                  onChange={(val) => setForm({ ...form, regiao: val })}
                  regioes={regioes}
                  disabled={!editando}
                />
            </div>


            <div className="flex justify-end gap-3 pt-4">
              {!editando ? (
                <button onClick={() => setEditando(true)} 
                className="bg-[#B72029] hover:bg-[#9f1e25] text-white px-4 py-2 rounded-md transition">Editar</button>
              ) : (
                <>
                  <button onClick={handleSalvar} 
                  className="bg-[#B72029] hover:bg-[#9f1e25] text-white px-4 py-2 rounded-md transition">Salvar</button>
                  <button onClick={() => setEditando(false)} 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition">Cancelar</button>
                </>
              )}
            </div>
          </div>
        )}

        {aba === 'historico' && (
          <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
            {historico.length === 0 ? (
              <p className="text-gray-500">Nenhum pedido encontrado.</p>
            ) : (
              historico.map((item, i) => (
                <div key={i} 
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg shadow-sm bg-white">
                   <div className="text-gray-800 text-lg">{item.produtoNome}</div>
                  <div className="text-lg text-gray-500">{formatarData(item.data)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

