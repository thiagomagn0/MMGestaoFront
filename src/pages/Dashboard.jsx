import GraficoVendas from '../components/GraficoVendas';
import TopProdutos from '../components/TopProdutos';
import TopClientes from '../components/TopClientes.jsx';




export default function Dashboard() {
  return (
    <div className="p-6">     
      <GraficoVendas />
      <TopProdutos />
      <TopClientes />
    </div>
  );
}