import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, MapPin, X, Search, MapPinPlus, MapPinX, Trash2, MoreVertical } from 'lucide-react';

export default function ListaRegioes() {
  const [regioes, setRegioes] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novaRegiao, setNovaRegiao] = useState({ nome: '', taxaEntrega: '' });
  const [show, setShow] = useState(false);
   const [dropdownAberto, setDropdownAberto] = useState(null);

     const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    buscarRegioes();   
  }, []);



    useEffect(() => {
    if (modalAberto) {
      setTimeout(() => setShow(true), 10);
    }
  }, [modalAberto]);

  const buscarRegioes = async () => {
    const res = await api.get('/regioes');
    setRegioes(res.data);
  };

  const salvarRegiao = async () => {
    console.log(novaRegiao);
    console.log(editandoId);
    if (!novaRegiao.nome.trim()) return alert('Nome obrigatório');

    try {
      if (editandoId) {
        console.log('editando');
        await api.put(`/regioes/${editandoId}`, {
          nome: novaRegiao.nome,
          taxaEntrega: parseFloat(novaRegiao.taxaEntrega) || 0
        });
      } else {
        await api.post('/regioes', {
          nome: novaRegiao.nome,
          taxaEntrega: parseFloat(novaRegiao.taxaEntrega) || 0
        });
      }

      setShow(false);
      setTimeout(() => setModalAberto(false), 300);
      setNovaRegiao({ nome: '', taxaEntrega: '' });
      setEditandoId(null);
      buscarRegioes();
    } catch {
      alert('Erro ao salvar região');
    }
  };



    const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await api.delete(`/regioes/${id}`);
      buscarRegioes();
    }
  };

    const handleEdit = (regiao) => {
      console.log(regiao);
    setEditandoId(regiao._id);
    setNovaRegiao({
      nome: regiao.nome,
      taxaEntrega: regiao.taxaEntrega.toString(),
    });
    setModalAberto(true);
  };

  const filtradas = regioes.filter(r =>
    r.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6 gap-4">
           <div style={{ borderRadius: '34px', padding: '2px 18px' }} 
              className="flex shadow-sm items-center border-b inset-shadow-sm border-gray-300 px-3 w-full max-w-md bg-white rounded">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"           
                  placeholder="Buscar região..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full h-41  focus:outline-none placeholder-gray-400 text-gray-700 bg-transparent"
                />
          </div>
        {/* <input
          type="text"
          placeholder="Buscar região..."
          className="w-full max-w-md border-b border-gray-300 focus:outline-none p-2 rounded bg-transparent text-gray-700"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        /> */}
        <button
          onClick={() => setModalAberto(true)}
          className="color-red-mm hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow inset-shadow-sm inset-shadow-gray-300"
        >
          <MapPinPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtradas.map(regiao => (
          <div
            key={regiao._id}
            className="flex items-center bg-gray-50 rounded-lg shadow-sm p-4"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-gray-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg color-red-mm-txt">{regiao.nome}</h3>
              <p className="text-gray-500 text-sm">Taxa: R$ {regiao.taxaEntrega?.toFixed(2) || '0,00'}</p>
            </div>
               <div className="relative">
              <button onClick={() => setDropdownAberto(dropdownAberto === regiao._id ? null : regiao._id)} className="text-gray-500 hover:text-black">
                <MoreVertical size={20} />
              </button>
              {dropdownAberto === regiao._id && (
                <ul className="absolute z-10 py-2  bg-white bottom-full mb-1 rounded inset-shadow-sm shadow-xl/30 max-h-60 overflow-y-auto text-sm">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleEdit(regiao)}>Editar</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleDelete(regiao._id)}>Excluir</li>
                </ul>
              )}
            </div>
          </div>
        ))}
        {regioes.length === 0 && (
          <p className="text-center text-gray-500 col-span-2">Nenhuma região cadastrada</p>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 backdrop-blur  bg-opacity-50 flex justify-center items-end md:items-center transition-opacity duration-300">
          <div className={`bg-white rounded-t-lg md:rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold color-red-mm-txt">Nova Região</h3>
              <button onClick={() => { setShow(false); setTimeout(() => setModalAberto(false), 300); }} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium color-red-mm-txt mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm-txt p-2 bg-transparent"
                  value={novaRegiao.nome}
                  onChange={e => setNovaRegiao({ ...novaRegiao, nome: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium color-red-mm-txt mb-1">Taxa de Entrega (R$)</label>
                <input
                  type="number"
                  className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm-txt p-2 bg-transparent"
                  value={novaRegiao.taxaEntrega}
                  onChange={e => setNovaRegiao({ ...novaRegiao, taxaEntrega: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => { setShow(false); setTimeout(() => setModalAberto(false), 300); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarRegiao}
                  className="color-red-mm hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
