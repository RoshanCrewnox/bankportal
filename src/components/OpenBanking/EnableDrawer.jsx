import React, { useState, useEffect } from 'react';
import { Cpu, X } from 'lucide-react';
import CustomSelect from './CustomSelect';

const InputCard = ({ label, children }) => (
    <div className="space-y-1.5 relative">
        <p className="text-xs text-gray-400 font-semibold tracking-wide ml-1">{label}</p>
        <div className="w-full p-3 bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-white/5 rounded-xl transition-all font-semibold text-gray-800 dark:text-gray-100">
            {children}
        </div>
    </div>
);

const EnableDrawer = ({ isOpen, onClose, item, onSave, config }) => {
    const [isCustomDuration, setIsCustomDuration] = useState(false);
    const [formData, setFormData] = useState({
        duration: config?.duration || '90 Days',
        reason: '',
        transactionCategory: 'Credit',
        obCategory: 'AISP',
        allowedBytes: '',
        byteUnit: 'KB',
        allowedTransaction: 'Both'
    });

    useEffect(() => {
        if (!isCustomDuration && config?.duration) {
            setFormData(prev => ({ ...prev, duration: config.duration }));
        }
    }, [isCustomDuration, config?.duration]);

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
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white capitalize">Enable consent</h2>
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
                        {/* Consent duration dropdown */}
                        <div className="space-y-1.5">
                            <span className="text-xs text-gray-400 font-semibold px-1">Consent duration</span>
                            <CustomSelect 
                                value={formData.duration}
                                isOpen={openDrawerDropdown === 'duration'}
                                onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'duration' ? null : 'duration')}
                                options={['30 Days', '60 Days', '90 Days', '180 Days', '1 Year']}
                                onChange={(val) => setFormData({...formData, duration: val})}
                                disabled={!isCustomDuration}
                            />
                        </div>
                        {/* Custom duration toggle */}
                        <div className="space-y-1.5">
                            <span className="text-xs text-gray-400 font-semibold px-1">Enable custom duration</span>
                            <div className="flex items-center px-1 h-[42px]">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCustomDuration(!isCustomDuration);
                                    }}
                                    className={`w-9 h-5 rounded-full relative transition-colors ${isCustomDuration ? 'bg-primary-orange' : 'bg-gray-300 dark:bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCustomDuration ? 'left-[20px]' : 'left-[4px]'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <InputCard label="Consent reason">
                                <textarea 
                                    placeholder="Enter reason for consent request..."
                                    value={formData.reason}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    className="w-full bg-transparent border-none p-0 text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-0 outline-none resize-none h-20"
                                />
                            </InputCard>
                        </div>

                        <CustomSelect 
                            label="Allowed transaction category"
                            value={formData.transactionCategory}
                            isOpen={openDrawerDropdown === 'category'}
                            onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'category' ? null : 'category')}
                            options={['Credit', 'Debit', 'Both']}
                            onChange={(val) => setFormData({...formData, transactionCategory: val})}
                        />

                        <CustomSelect 
                            label="Open banking category"
                            value={formData.obCategory}
                            isOpen={openDrawerDropdown === 'ob'}
                            onToggle={() => setOpenDrawerDropdown(openDrawerDropdown === 'ob' ? null : 'ob')}
                            options={['AISP', 'PISP']}
                            onChange={(val) => setFormData({...formData, obCategory: val})}
                        />
                    </div>

                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex gap-4">
                            <div className="flex-2">
                                <InputCard label="Allowed bytes">
                                    <input 
                                        type="number" 
                                        placeholder="Number"
                                        value={formData.allowedBytes}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => setFormData({...formData, allowedBytes: e.target.value})}
                                        className="w-full bg-transparent border-none p-0 text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-0 outline-none"
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
                                    label="Allowed transaction"
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
                        className="px-8 py-2.5 bg-primary-orange text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-[0.98] transition-all tracking-wide"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnableDrawer;
