import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

const MultiSelectDropdown = ({ options, selected, onToggle, isDark, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase()) && !selected.includes(opt)
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[46px] p-2 border rounded-xl flex items-center gap-2 cursor-pointer transition-all ${
          isDark ? 'bg-secondary-dark-bg/20 border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'
        }`}
      >
        {selected.length === 0 && !isOpen && (
          <span className="text-gray-400 text-xs ml-2 italic">{placeholder}</span>
        )}
        {selected.length > 0 && !isOpen && (
          <span className="text-primary-orange text-xs font-bold ml-2">
            {selected.length} field{selected.length > 1 ? 's' : ''} selected
          </span>
        )}
        {isOpen && (
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-xs min-w-[100px] dark:text-white px-2"
            placeholder="Search fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {isOpen && (
        <div className={`absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
          isDark ? 'bg-[#2f3349]/95 backdrop-blur-md border-white/10' : 'bg-white/95 backdrop-blur-md border-gray-100'
        }`}>
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-xs italic">No fields found</div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredOptions.map(opt => (
                <div
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    selected.includes(opt)
                      ? 'bg-primary-orange/20 text-primary-orange'
                      : isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {opt}
                  {selected.includes(opt) && <Check size={14} className="stroke-[3px]" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
