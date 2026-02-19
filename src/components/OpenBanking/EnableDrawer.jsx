import React, { useState } from 'react';
import { Cpu, X } from 'lucide-react';
import CustomSelect from './CustomSelect';

const InputCard = ({ label, children }) => (
    <div className="space-y-1.5 relative">
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1">{label}</p>
        <div className="w-full p-3 bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-white/5 rounded-xl transition-all font-bold text-gray-800 dark:text-gray-100">
            {children}
        </div>
    </div>
);

const EnableDrawer = ({ isOpen, onClose, item, onSave }) => {
    const [formData, setFormData] = useState({
        duration: '90 Days',
        reason: '',
        transactionCategory: 'Category 1',
        obCategory: 'AISP',
        allowedBytes: '',
        byteUnit: 'KB',
        allowedTransaction: 'Both'
    });

    const [openDrawerDropdown, setOpenDrawerDropdown] = useState(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex justify-end overflow-hidden animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
                role="button"
                tabIndex={0}
                aria-label="Close drawer"
            />
            <div
                className="relative w-full max-w-xl bg-white dark:bg-secondary-dark-bg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenDrawerDropdown(null);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpenDrawerDropdown(null);
                }}
                role="presentation"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-dark-input/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-orange/10 text-primary-orange">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Enable Consent</h2>
                            <p className="text-xs text-gray-500 font-medium">Configure permissions for {item?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
                        <X className="w-5 h-5 text-gray-400 group-hover:text-primary-orange transition-colors" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <CustomSelect 
                            label="Consent Duration"
                            value={formData.duration}
                            isOpen={openDrawerDropdown === 'duration'}
                            onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'duration' ? null : 'duration')}
                            options={['30 Days', '60 Days', '90 Days', '180 Days', '1 Year']}
                            onChange={(val) => setFormData({...formData, duration: val})}
                        />
                        <InputCard label="Consent Reason">
                            <input 
                                type="text" 
                                placeholder="Reason"
                                value={formData.reason}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-0 outline-none"
                            />
                        </InputCard>
                    </div>

                    <CustomSelect 
                        label="Allowed Transaction Category"
                        value={formData.transactionCategory}
                        isOpen={openDrawerDropdown === 'category'}
                        onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'category' ? null : 'category')}
                        options={['Category 1', 'Category 2', 'Category 3']}
                        onChange={(val) => setFormData({...formData, transactionCategory: val})}
                    />

                    <CustomSelect 
                        label="Open Banking Category"
                        value={formData.obCategory}
                        isOpen={openDrawerDropdown === 'ob'}
                        onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'ob' ? null : 'ob')}
                        options={['AISP', 'PISP']}
                        onChange={(val) => setFormData({...formData, obCategory: val})}
                    />

                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex gap-4">
                            <div className="flex-2">
                                <InputCard label="Allowed Bytes">
                                    <input 
                                        type="number" 
                                        placeholder="Number"
                                        value={formData.allowedBytes}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => setFormData({...formData, allowedBytes: e.target.value})}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-0 outline-none"
                                    />
                                </InputCard>
                            </div>
                            <div className="flex-1">
                                <CustomSelect 
                                    label="Unit"
                                    value={formData.byteUnit}
                                    isOpen={openDrawerDropdown === 'unit'}
                                    onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'unit' ? null : 'unit')}
                                    options={['KB', 'MB']}
                                    onChange={(val) => setFormData({...formData, byteUnit: val})}
                                />
                            </div>
                        </div>

                        {formData.obCategory === 'PISP' && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <CustomSelect 
                                    label="Allowed Transaction"
                                    value={formData.allowedTransaction}
                                    isOpen={openDrawerDropdown === 'transaction'}
                                    onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'transaction' ? null : 'transaction')}
                                    options={['Credit', 'Debit', 'Both']}
                                    onChange={(val) => setFormData({...formData, allowedTransaction: val})}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-dark-input/20 flex justify-end">
                    <button 
                        onClick={() => onSave(formData)}
                        className="px-8 py-2.5 bg-primary-orange text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnableDrawer;
