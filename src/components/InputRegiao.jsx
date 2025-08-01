import { useState } from 'react';

export default function SelectRegiao({ value, onChange, regioes, disabled  }) {
  const [open, setOpen] = useState(false);

  const selected = regioes.find(r => r._id === value);

   const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="relative w-full border-b border-gray-300">
        <label className="block text-sm text-gray-400">Região</label>
      <button style={{ padding: '8px 0px' }}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full  text-left   focus:border-[#B72029] outline-none px-4 py-2 text-sm rounded-t bg-white 
          ${disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
          ${open ? 'border-[#B72029]' : 'border-gray-300'}`}
      >
        {selected ? `${selected.nome} (R$ ${selected.taxaEntrega.toFixed(2)})` : 'Selecione uma região'}
      </button>

      {open && !disabled &&(
        <ul className="absolute z-10 py-2  bg-white w-full bottom-full mb-1 rounded inset-shadow-sm shadow-xl/30 max-h-60 overflow-y-auto text-sm">
          {regioes.map((r) => (
            <li
              key={r._id}
              onClick={() => handleSelect(r._id)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {r.nome} (R$ {r.taxaEntrega.toFixed(2)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
