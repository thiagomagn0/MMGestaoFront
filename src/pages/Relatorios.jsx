import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, BarChart2, FileDown } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Relatorios() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
   const [buscaCliente, setBuscaCliente] = useState('');
  const [buscaProduto, setBuscaProduto] = useState('');
  const [abertoCliente, setAbertoCliente] = useState(false);
const [abertoProduto, setAbertoProduto] = useState(false);


  const [filtros, setFiltros] = useState({
    dataInicio: new Date().toISOString().split('T')[0], // data atual
    dataFim: new Date().toISOString().split('T')[0], // data atual,
    clienteId: '',
    produtoId: '',
  });

  const [relatorio, setRelatorio] = useState([]);
  const [totais, setTotais] = useState({ quantidade: 0, valor: 0 });

  useEffect(() => {
    buscarClientes();
    buscarProdutos();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-cliente')) setAbertoCliente(false);
    if (!event.target.closest('.dropdown-produto')) setAbertoProduto(false);
  };
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);

  const buscarClientes = async () => {
    const res = await api.get('/clientes');
    setClientes(res.data);
  };

  const buscarProdutos = async () => {
    const res = await api.get('/produtos');
    setProdutos(res.data);
  };

  const buscarRelatorio = async () => {
       const params = {};
    if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
    if (filtros.dataFim) params.dataFim = filtros.dataFim;
    if (filtros.clienteId) params.clienteId = filtros.clienteId;
    if (filtros.produtoId) params.produtoId = filtros.produtoId;

    const res = await api.get('/relatorios', { params });
    const dadosOrdenados = res.data.sort((a, b) => new Date(b.data) - new Date(a.data));
    setRelatorio(dadosOrdenados);

    const totalQtd = res.data.reduce((soma, item) => soma + item.quantidade, 0);
    const totalVal = res.data.reduce((soma, item) => soma + item.valorTotal, 0);
    setTotais({ quantidade: totalQtd, valor: totalVal });
    
  };

const exportarPDF = () => {
  console.log(relatorio)
  const doc = new jsPDF();
  doc.text('Relatório de Pedidos', 14, 15);

  const colunas = ['Data', 'Cliente', 'Produto', 'Quantidade', 'Valor Total'];

  const linhas = relatorio.map(item => [
    dayjs(item.data).utc().format('DD/MM/YYYY'),
    item.clienteNome,
    item.produtoNome,
    item.quantidade,
    `R$ ${item.valorTotal.toFixed(2)}`
  ]);

  // ➕ Linha de totalizadores
  if (relatorio.length > 0) {
    linhas.push([
      '', // Data
      '', // Cliente
      'Totais',
      totais.quantidade,
      `R$ ${totais.valor.toFixed(2)}`
    ]);
  }

  autoTable(doc,{
    startY: 20,
    head: [colunas],
    body: linhas,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [183, 32, 41] },
    footStyles: { fillColor: [240, 240, 240] }
  });

  doc.save('relatorio.pdf');
};
const clientesFiltrados = clientes.filter(c => c.nome.toLowerCase().includes(buscaCliente.toLowerCase()));
  const produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(buscaProduto.toLowerCase()));

return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="text-2xl font-bold text-[#B72029] flex items-center gap-2">
          <BarChart2 /> Relatórios
        </div>
        <button
          onClick={buscarRelatorio}
          className="bg-[#B72029] hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow"
        >
          Buscar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="date"
          value={filtros.dataInicio}
          onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
          className="border-b border-gray-300 focus:outline-none p-2 rounded bg-transparent text-gray-700"
        />
        <input
          type="date"
          value={filtros.dataFim}
          onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
          className="border-b border-gray-300 focus:outline-none p-2 rounded bg-transparent text-gray-700"
        />
        {/* Dropdown de Cliente */}
        <div className="relative dropdown-cliente">
          <input
            type="text"
            placeholder="Buscar cliente"
            value={buscaCliente}
            onChange={e => setBuscaCliente(e.target.value)}
            onFocus={() => setAbertoCliente(true)}
            className="w-full border-b border-gray-300 p-2 rounded focus:outline-none"
          />
          {abertoCliente && (
            <ul className="absolute z-10 py-2  bg-white w-full  mb-1 rounded inset-shadow-sm shadow-xl/30 max-h-60 overflow-y-auto text-sm">
              <li
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filtros.clienteId === '' && 'bg-gray-100'}`}
                onClick={() => {
                  setFiltros({ ...filtros, clienteId: '' });
                  setBuscaCliente('');
                  setAbertoCliente(false);
                }}
              >
                Todos os clientes
              </li>
              {clientesFiltrados.map(c => (
                <li
                  key={c._id}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filtros.clienteId === c._id && 'bg-gray-100'}`}
                  onClick={() => {
                    setFiltros({ ...filtros, clienteId: c._id });
                    setBuscaCliente(c.nome);
                    setAbertoCliente(false);
                  }}
                >
                  {c.nome}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dropdown de Produto */}
        <div className="relative dropdown-produto">
          <input
            type="text"
            placeholder="Buscar produto"
            value={buscaProduto}
            onChange={e => setBuscaProduto(e.target.value)}
            onFocus={() => setAbertoProduto(true)}
            className="w-full border-b border-gray-300 p-2 rounded focus:outline-none"
          />
          {abertoProduto && (
            <ul className="absolute z-10 py-2  bg-white w-full rounded inset-shadow-sm shadow-xl/30 max-h-60 overflow-y-auto text-sm">
              <li
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filtros.produtoId === '' && 'bg-gray-100'}`}
                onClick={() => {
                  setFiltros({ ...filtros, produtoId: '' });
                  setBuscaProduto('');
                  setAbertoProduto(false);
                }}
              >
                Todos os produtos
              </li>
              {produtosFiltrados.map(p => (
                <li
                  key={p._id}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filtros.produtoId === p._id && 'bg-gray-100'}`}
                  onClick={() => {
                    setFiltros({ ...filtros, produtoId: p._id });
                    setBuscaProduto(p.nome);
                    setAbertoProduto(false);
                  }}
                >
                  {p.nome}
                </li>
              ))}
            </ul>
          )}
        </div>
      
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#B72029]/90 text-white">
            <tr>
              <th className="text-left px-4 py-2">Data</th>
              <th className="text-left px-4 py-2">Cliente</th>
              <th className="text-left px-4 py-2">Produto</th>
              <th className="text-right px-4 py-2">Quantidade</th>
              <th className="text-right px-4 py-2">Valor Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {relatorio.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F5]'}
              >
                <td className="px-4 py-2 text-gray-800">{dayjs(item.data).utc().format('DD/MM/YYYY')}</td>
                <td className="px-4 py-2 text-gray-800">{item.clienteNome}</td>
                <td className="px-4 py-2 text-gray-800">{item.produtoNome}</td>
                <td className="text-right px-4 py-2 text-gray-700">{item.quantidade}</td>
                <td className="text-right px-4 py-2 text-gray-700">R$ {item.valorTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {relatorio.length > 0 && (
            <tfoot className="bg-[#B72029]/10 text-[#B72029] font-bold">
              <tr>
                <td className="px-4 py-2" colSpan={3}>Totais</td>
                <td className="text-right px-4 py-2">{totais.quantidade}</td>
                <td className="text-right px-4 py-2">R$ {totais.valor.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
        {relatorio.length > 0 && (
          <div className="p-4 flex justify-center">

           <button
            onClick={exportarPDF}
            className="bg-[#B72029] flex items-center gap-2 hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow"
          >
            <FileDown size={18} /> 
            <span>Exportar PDF</span>
          </button>
          </div>
        )}
         
        {relatorio.length === 0 && (
          <div className="p-4 text-center text-gray-500">Nenhum dado encontrado</div>
        )}
      </div>
    </div>
  );
}
