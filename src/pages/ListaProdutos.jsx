import { useEffect, useState } from 'react';
import api from '../services/api';
import { MoreVertical, PackagePlus, PackageSearch, ArrowDown } from 'lucide-react';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '', preco: '' });
  const [editandoId, setEditandoId] = useState(null);
  
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);

  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const TAMANHO_MAXIMO = 1024 * 1024; // 1MB
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_UPLOADS = BASE_URL.replace('/api', '') + '/uploads/';

  useEffect(() => {
    buscarProdutos();
    if (formVisible) {
    setTimeout(() => setShow(true), 10); // anima suavemente
  }
  }, [formVisible]);

  const buscarProdutos = async () => {
    const res = await api.get('/produtos');
    setProdutos(res.data);
  };
  const handleImagemChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > TAMANHO_MAXIMO) {
      alert('A imagem deve ter no máximo 1MB');
      return;
    }
    setImagem(file);
    setImagemPreview(URL.createObjectURL(file));
  }
};



   const abrirModal = () => {   
    setEditandoId(null); 
    setFormData({ nome: '', descricao: '', preco: '' });
    setImagem(null);
    setImagemPreview(null);
    setFormVisible(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await api.delete(`/produtos/${id}`);
      buscarProdutos();
    }
  };

  const handleEdit = (produto) => {
    setEditandoId(produto._id);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco.toString(),
      imagem: produto.imagem || ''
    });
    setFormVisible(true);
  };

const handleCancel = () => {
  setShow(false);
  setTimeout(() => {
    setEditandoId(null);
    setFormData({ nome: '', descricao: '', preco: '' });
    setFormVisible(false);
  }, 300); // tempo da animação
};

const handleSave = async (e) => {
  e.preventDefault();

  try {
    const form = new FormData();
    form.append('nome', formData.nome);
    form.append('descricao', formData.descricao);
    form.append('preco', parseFloat(formData.preco));
    if (imagem) form.append('imagem', imagem);

    if (editandoId) {
      await api.put(`/produtos/${editandoId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await api.post('/produtos', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    setFormVisible(false);
    setFormData({ nome: '', descricao: '', preco: '' });
    setImagem(null);
    setImagemPreview(null);
    buscarProdutos();
    
  } catch (err) {
      if (err && err.response && err.response.data) {
        console.error('Erro ao salvar produto:', err.response.data);
        alert('Erro ao salvar produto: ' + (err.response.data?.error || ''));
      } else {
        console.error('Erro ao salvar produto:', err);
        alert('Erro ao salvar produto');
      }
    }
};

    const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
     <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div style={{ borderRadius: '34px', padding: '2px 18px' }} 
        className="flex shadow-sm items-center border-b inset-shadow-sm border-gray-300 px-3 w-full max-w-md bg-white rounded">
          <PackageSearch className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"           
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-41  focus:outline-none placeholder-gray-400 text-gray-700 bg-transparent"
          />
        </div>
        <button
          onClick={() => abrirModal()}
          className="color-red-mm hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow inset-shadow-sm inset-shadow-gray-300"
        >
          <PackagePlus className="inline " />
        </button>
      </div>

      {formVisible && (
        <div className="fixed inset-0 z-50 backdrop-blur  bg-opacity-50 flex justify-center items-end md:items-center transition-opacity duration-300">
          <div className={`bg-white rounded-t-lg md:rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300
            ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold color-red-mm-txt">{editandoId ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-black">
                 <ArrowDown size={36} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium color-red-mm-txt mb-1">Imagem (máx 1MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagemChange}
                    className="w-full"
                  />
                  {imagemPreview && (
                    <img src={imagemPreview} alt="Prévia" className="mt-2 max-h-32 rounded" />
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium color-red-mm-txt mb-1">Nome</label>
                <input
                  type="text"
                  placeholder="Nome"
                  
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm-txt p-2 bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium color-red-mm-txt mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm-txt p-2 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium color-red-mm-txt mb-1">Preço</label>
                <input
                  type="number"
                  placeholder="Preço"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full border-b border-gray-300 focus:outline-none focus:color-red-mm-txt p-2 bg-transparent"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="submit" className="color-red-mm hover:bg-[#a31d24] text-white px-4 py-2 rounded shadow">
                  {editandoId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtosFiltrados.map((produto) => (
          <div key={produto._id} className="flex items-center bg-gray-50 rounded-lg shadow-sm p-4 relative">
            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-gray-500">
                 {produto.imagem ? (
                  <img
                    src={`${BASE_UPLOADS}${produto.imagem}`}
                    alt={produto.nome}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span role="img" aria-label="produto">🛒</span>
                )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg color-red-mm-txt">{produto.nome}</h3>
              <p className="text-gray-500 text-sm">R$ {produto.preco.toFixed(2)}</p>
            </div>
            <div className="relative">
              <button onClick={() => setDropdownAberto(dropdownAberto === produto._id ? null : produto._id)} className="text-gray-500 hover:text-black">
                <MoreVertical size={20} />
              </button>
              {dropdownAberto === produto._id && (
                <ul className="absolute z-10 py-2  bg-white bottom-full mb-1 rounded inset-shadow-sm shadow-xl/30 max-h-60 overflow-y-auto text-sm">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleEdit(produto)}>Editar</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleDelete(produto._id)}>Excluir</li>
                </ul>
              )}
            </div>
          </div>
        ))}
        {produtos.length === 0 && (
          <p className="text-center text-gray-500 col-span-2">Nenhum produto cadastrado</p>
        )}
      </div>
    </div>
  );
}
