import { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CORES = [
  '#B72029', // vermelho escuro
  '#E57373', // vermelho claro
  '#FFDADA',  // pálido com tom quente
  '#F9B3B3', // rosa pastel
  '#FFF0F0', // off-white rosado
  '#D24B53', // vermelho médio
  
  
  '#FDEAEA', // quase branco
  '#D98C8C', // tom intermediário
  '#F7C6C6', // rosa claro suave
  
  '#C04040' // bordô suave
  
];

const periodos = {
  hoje: () => {
    const hoje = new Date();
    return {
      dataInicio: new Date(hoje.setHours(0, 0, 0, 0)).toISOString(),
      dataFim: new Date().toISOString(),
    };
  },
  ontem: () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return {
      dataInicio: new Date(d.setHours(0, 0, 0, 0)).toISOString(),
      dataFim: new Date(d.setHours(23, 59, 59, 999)).toISOString(),
    };
  },
  ultimos7: () => {
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - 6);
    return {
      dataInicio: inicio.toISOString(),
      dataFim: fim.toISOString(),
    };
  },
  ultimos30: () => {
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - 29);
    return {
      dataInicio: inicio.toISOString(),
      dataFim: fim.toISOString(),
    };
  },
  ultimos90: () => {
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - 89);
    return {
      dataInicio: inicio.toISOString(),
      dataFim: fim.toISOString(),
    };
  },
  esteMes: () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fim = new Date();
    return {
      dataInicio: inicio.toISOString(),
      dataFim: fim.toISOString(),
    };
  },
};

export default function GraficoVendas() {
  const [dados, setDados] = useState([]);
  const [agrupadoPorRegiao, setAgrupadoPorRegiao] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('ultimos7');

  useEffect(() => {
    buscarDados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agrupadoPorRegiao, periodoSelecionado]);

  const buscarDados = async () => {
    const { dataInicio, dataFim } = periodos[periodoSelecionado]();
    const res = await api.get('/graficos/donut', {
      params: {
        dataInicio,
        dataFim,
        agrupadoPor: agrupadoPorRegiao ? 'regiao' : 'produto',
      },
    });
    setDados(res.data);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
           <div className="flex items-center mb-4">
        <TrendingUp className="text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">Gráfico de vendas</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 items-center">
            <div className="relative inline-block text-left">
                    <select
                        value={periodoSelecionado}
                        onChange={e => setPeriodoSelecionado(e.target.value)}
                        className="appearance-none text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 inline-flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="hoje">Hoje</option>
                        <option value="ontem">Ontem</option>
                        <option value="esteMes">Este mês</option>
                        <option value="ultimos7">Últimos 7 dias</option>
                        <option value="ultimos30">Últimos 30 dias</option>
                        <option value="ultimos90">Últimos 90 dias</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                        >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1l4 4 4-4"
                        />
                        </svg>
                    </div>
                </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agrupadoPorRegiao}
              onChange={e => setAgrupadoPorRegiao(e.target.checked)}
            />
            Região
          </label>
        </div>
      </div>

        {Array.isArray(dados) && dados.length > 0 ? (
          <PieChart width={286} height={286}>
            <Pie
              dataKey="valorTotal"
              isAnimationActive
              data={dados}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ value }) => (value ? `R$ ${value.toFixed(2)}` : '')}
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Total']} />
            <Legend />
          </PieChart>
        ) : (
          <p className="text-center text-gray-400">Nenhum dado para exibir</p>
        )}
    </div>
  );
}
