import React, { useId, useState } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange, searchable = false, isOpen, onToggle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const listboxId = useId();
    
    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-1.5 relative">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1">{label}</p>
            <div 
                role="combobox"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={listboxId}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggle();
                    }
                }}
                className="w-full p-3 bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-white/5 rounded-xl cursor-pointer flex items-center justify-between group hover:border-primary-orange/30 transition-all font-bold text-gray-800 dark:text-gray-100"
            >
                <span className="text-sm">{value}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-primary-orange transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div 
                    id={listboxId}
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {searchable && (
                        <div className="p-2 border-b border-gray-100 dark:border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-secondary-dark-bg border-none rounded-lg py-2 pl-9 pr-3 text-xs text-gray-800 dark:text-white focus:ring-1 focus:ring-primary-orange outline-none"
                                />
                            </div>
                        </div>
                    )}
                    <div className="max-h-48 overflow-y-auto py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div 
                                    key={opt}
                                    role="option"
                                    tabIndex={0}
                                    aria-selected={value === opt}
                                    onClick={() => {
                                        onChange(opt);
                                        onToggle();
                                        setSearchTerm('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onChange(opt);
                                            onToggle();
                                            setSearchTerm('');
                                        }
                                    }}
                                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${value === opt ? 'bg-primary-orange/20 text-primary-orange font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-orange/5'}`}
                                >
                                    {opt}
                                    {value === opt && <Check className="w-3.5 h-3.5" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-xs text-gray-400 italic text-center">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
