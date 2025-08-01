import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Trash2 } from 'lucide-react';

export default function CriarPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const clienteDoState = location.state?.cliente;

  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [dataPedido, setDataPedido] = useState(() => new Date().toISOString().slice(0, 10));
const [buscaProduto, setBuscaProduto] = useState('');
const [abertoProduto, setAbertoProduto] = useState(false);

const dropdownRef = useRef(null);

  useEffect(() => {
    if (clienteDoState) {
      setCliente(clienteDoState);
    } else {
      buscarCliente();
    }
    buscarProdutos();
  }, []);

  useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setAbertoProduto(false);
    }
  }
  if (abertoProduto) {
    document.addEventListener('mousedown', handleClickOutside);
  }
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [abertoProduto]);

  const buscarCliente = async () => {
    const res = await api.get('/clientes');
    const clienteSelecionado = res.data.find(c => c._id === id);
    setCliente(clienteSelecionado);
  };

  const produtosFiltrados = produtos.filter(p =>
  p.nome.toLowerCase().includes(buscaProduto.toLowerCase())
);

  const buscarProdutos = async () => {
    const res = await api.get('/produtos');
    setProdutos(res.data);
  };

  const adicionarProduto = (produto) => {
    if (selecionados.find(p => p.produto === produto._id)) return;

    setSelecionados([...selecionados, {
      produto: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
    }]);
  };



  const removerProduto = (index) => {
    const lista = [...selecionados];
    lista.splice(index, 1);
    setSelecionados(lista);
  };

  const atualizarQuantidade = (index, quantidade) => {
  const lista = [...selecionados];
  lista[index].quantidade = quantidade === '' ? 0 : parseInt(quantidade);
  setSelecionados(lista);
};

  const calcularTotal = () => {
    return selecionados.reduce((s, p) => s + p.quantidade * p.preco, 0).toFixed(2);
  };

  const handleSalvar = async () => {
    console.log(selecionados)
    if (selecionados.find(p => p.quantidade === 0)) {
      alert('Quantidade inválida para o produto selecionado');
      return;
    }

    await api.post('/pedidos', {
      cliente: id,
      produtos: selecionados,
      data: dataPedido,
    });
    navigate('/clientes');
  };

  if (!cliente) return <div className="p-6">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-[#B72029] mb-4">Cliente: {cliente.nome}</h2>
    
      <div className="mb-6">
        <label className="block font-semibold text-gray-700 mb-1">Data do Pedido</label>
        <input
          type="date"
          value={dataPedido}
          onChange={e => setDataPedido(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Selecionar Produtos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {produtos.map(p => (
            <button
              key={p._id}
              onClick={() => adicionarProduto(p)}
              className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-[#FFF5F5]"
            >
              {p.nome} - R$ {p.preco.toFixed(2)}
            </button>
          ))}
        </div>
      </div> */}
  <div ref={dropdownRef} className="relative dropdown-produto mb-4">
  <input
    type="text"
    placeholder="Buscar produto"
    value={buscaProduto}
    onChange={e => setBuscaProduto(e.target.value)}
    onFocus={() => setAbertoProduto(true)}
    className="w-full border-b border-gray-300 p-2 rounded focus:outline-none"
  />
  {abertoProduto && (
    <ul className="absolute z-10 py-2 bg-white w-full rounded inset-shadow-sm shadow-xl/30 max-h-60 overflow-y-auto text-sm">
      {produtosFiltrados.length === 0 && (
        <li className="px-4 py-2 text-gray-400">Nenhum produto encontrado</li>
      )}
      {produtosFiltrados.map(p => (
        <li
          key={p._id}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer`}
          onClick={() => {
            adicionarProduto(p); // <-- reutiliza sua função!
            setBuscaProduto('');
            setAbertoProduto(false);
          }}
        >
          {p.nome}
        </li>
      ))}
    </ul>
  )}
</div>

      {selecionados.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Produtos Selecionados</h3>
          <div className="space-y-2">
            {selecionados.map((p, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="flex-1 text-sm text-gray-800">{p.nome}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}                 
                  max={99}
                  value={p.quantidade === 0 ? '' : p.quantidade}
                 onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    atualizarQuantidade(index, val);
                  }}               
                  className="w-20 border border-gray-300 rounded p-1 text-center"
                />
                <span className="text-sm">R$ {(p.quantidade * p.preco).toFixed(2)}</span>
                <button onClick={() => removerProduto(index)} className="">
                  <Trash2 className="text-[#B72029]" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right text-lg font-bold text-[#B72029]">
            Total: R$ {calcularTotal()}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate('/clientes')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={handleSalvar}
          disabled={selecionados.length === 0}
          className="bg-[#B72029] text-white px-4 py-2 rounded hover:bg-[#a31d24] disabled:opacity-50"
        >
          Salvar Pedido
        </button>
      </div>
    </div>
  );
}
