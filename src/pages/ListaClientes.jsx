
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, UserSearch, PackagePlus, UserRound } from 'lucide-react'; // ícones da lucide
import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import {ModalCliente} from '../components/ModalCliente';


export default function ListaClientes() {
  const { token } = useContext(AuthContext);  // pegar token do contexto
  const [clientes, setClientes] = useState([]);
  const [pedidosPorCliente, setPedidosPorCliente] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();





  useEffect(() => {
    if (!token) return;  // se não tiver token, não faz a chamada
    
    buscarClientes();
    buscarContagemPedidos();    
  
 
  }, [token]);  // executa quando token mudar

const buscarClientes = async () => {
 
  const res = await api.get('/clientes');
  setClientes(res.data);
};

  const buscarContagemPedidos = async () => {
    const res = await api.get('/clientes/pedidos-contagem');
    setPedidosPorCliente(res.data);
  };
 

  const getResumoPedidos = (clienteId) => {
    const dados = pedidosPorCliente.find(p => p._id === clienteId);
    return {
      total: dados?.totalPedidos || 0,
      valor: dados?.valorTotal?.toFixed(2) || '0.00',
    };
  };

  const abrirModal = (cliente) => {
    setClienteSelecionado(cliente);
    setForm({
      nome: cliente.nome,
      telefone: cliente.telefone || '',
      endereco: cliente.endereco || '',
      regiao: cliente.regiao || '',
    });
    setEditando(false);
  };



    const salvarEdicao = async () => {
      await api.put(`/clientes/${clienteSelecionado._id}`, form);
      await buscarClientes();
      setEditando(false);
      setClienteSelecionado(null);
    };

    // Filtrar clientes pelo nome (case insensitive)
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function maskTelefone(telefone) {
  if (!telefone) return '';
  // Remove tudo que não for número
  const onlyNums = telefone.replace(/\D/g, '');
  if (onlyNums.length <= 10)
    return onlyNums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return onlyNums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}


  return (
    <div className="max-w-4xl mx-auto  p-6 bg-white rounded shadow">
      {/* Barra de busca + botão novo cliente */}
      <div className="flex items-center justify-between mb-6 gap-4 max-w-4xl mx-auto">
        <div style={{ borderRadius: '34px', padding: '2px 18px' }} 
        className="flex shadow-sm items-center border-b inset-shadow-sm inset-shadow-gray-300 border-gray-300 px-3 w-full max-w-md bg-white rounded">
          <UserSearch className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"            
            placeholder="Buscar clientes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-41 focus:outline-none placeholder-gray-400 text-gray-700 bg-transparent"
          />
        </div>

        <button
          onClick={() => navigate('/clientes/novo')}
          className="bg-[#B72029] hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow inset-shadow-sm inset-shadow-gray-300"
          
        >
          <UserPlus className="inline" />          
        </button>
      </div>

      {/* Lista clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {clientesFiltrados.map((cliente) => {
          const resumo = getResumoPedidos(cliente._id);

         return (
    <div
      key={cliente._id}
      className="relative flex bg-white rounded-lg shadow hover:shadow-lg cursor-pointer"
      onClick={() => abrirModal(cliente)}
    >
   

      <div className="flex items-center justify-center p-2 " >
        {/* <img
          src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        /> */}
        <div className='bg-gray-400 rounded-full p-5'>
          <UserRound className="w-5 h-5 text-gray-100" />
          </div>
         
      </div>

      <div className="flex-1 py-2" style={{ marginRight: '8px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{cliente.nome}</h3>
            <p className="text-sm text-gray-600">
              {cliente.telefone ? maskTelefone(cliente.telefone) : 'Sem telefone'}
            </p>          
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <div>
            <span className="text-xs text-gray-500">Vendas</span>
            <div className="font-bold">{resumo.total}</div>
          </div>
          <div>
            <span className="text-xs text-gray-500">Total R$</span>
            <div className="font-bold">R$ {resumo.valor}</div>
          </div>
        </div>
      </div>
         {/* Botão + para adicionar pedido */}
      <button
        onClick={(e) => {
            e.stopPropagation(); // evita conflito se o card também tiver um onClick
            navigate(`/clientes/${cliente._id}/pedido`);
        }}
        className="flex items-center br-08 color-red-mm gap-2  text-white px-4 py-2 rounded hover:bg-blue-700 transition inset-shadow-sm inset-shadow-gray-300"
        title="Adicionar pedido"
        aria-label={`Adicionar pedido para ${cliente.nome}`}
      >
        <PackagePlus className="w-5 h-5 text-gray-100" />          
      </button>
    </div>
  );
        })}
      </div>

      {/* Modal */}
   {clienteSelecionado && (
        <ModalCliente
          cliente={clienteSelecionado}
          onClose={() => setClienteSelecionado(null)}
          editando={editando}
          setEditando={setEditando}
          form={form}
          setForm={setForm}
          salvarEdicao={salvarEdicao}
          onAtualizado={buscarClientes} // Essa função já existe e recarrega os dados

           // caso esteja controlando histórico fora do componente
        />
          
      )}
    </div>
  );

}
