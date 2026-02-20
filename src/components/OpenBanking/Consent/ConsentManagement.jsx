import React from 'react';
import { User, Building2, ChevronDown, ChevronUp, LayoutGrid, Cpu } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const ConsentManagement = ({ 
  filteredManagement, 
  openAccordion, 
  toggleAccordion, 
  internalTabs, 
  setInternalTab, 
  isConfigOpen, 
  setIsConfigOpen, 
  config, 
  setConfig, 
  searchMngtCustomerID, 
  setSearchMngtCustomerID, 
  openConfigDropdown, 
  setOpenConfigDropdown, 
  popoverRef, 
  handleSaveConfig, 
  setDrawerState 
}) => {
  return (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex justify-end gap-3 items-start relative">
        <div className="relative">
          <button 
            onClick={() => setIsConfigOpen(!isConfigOpen)} 
            className={`flex items-center gap-2 px-6 py-2 rounded-lg border text-sm font-semibold transition-all ${isConfigOpen ? 'bg-primary-orange text-white border-primary-orange shadow-lg hover:brightness-110' : 'bg-primary-orange text-white border-primary-orange hover:brightness-110'}`}
          >
            Configuration
          </button>
          {isConfigOpen && (
            <div ref={popoverRef} className="absolute top-12 left-0 w-80 bg-white dark:bg-secondary-dark-bg border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-6 space-y-6 z-50 animate-in fade-in zoom-in duration-200">
              <div className="space-y-5">
                <CustomSelect 
                  label="Consent Duration" 
                  value={config.duration} 
                  isOpen={openConfigDropdown === 'duration'} 
                  onToggle={() => setOpenConfigDropdown(openConfigDropdown === 'duration' ? null : 'duration')} 
                  options={['30 Days', '60 Days', '90 Days', '180 Days', '1 Year']} 
                  onChange={(val) => setConfig({...config, duration: val})} 
                />
                <CustomSelect 
                  label="Allowed Regions" 
                  value={config.regions} 
                  searchable={true} 
                  isOpen={openConfigDropdown === 'regions'} 
                  onToggle={() => setOpenConfigDropdown(openConfigDropdown === 'regions' ? null : 'regions')} 
                  options={['UK, EU', 'Global', 'APAC', 'North America', 'Middle East', 'South America', 'Africa', 'India', 'Southeast Asia']} 
                  onChange={(val) => setConfig({...config, regions: val})} 
                />
              </div>
              <button onClick={handleSaveConfig} className="w-full py-3 bg-primary-orange text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-[0.98] transition-all tracking-wide">Save Configuration</button>
            </div>
          )}
        </div>
        <div className="relative w-72 group">
          <input 
            type="text" 
            placeholder="Search by CustomerID" 
            value={searchMngtCustomerID} 
            onChange={(e) => setSearchMngtCustomerID(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none transition-all dark:text-white shadow-sm" 
          />
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-orange transition-colors" />
        </div>
      </div>

      <div className="space-y-3">
        {filteredManagement.map((customer) => {
          const isOpen = openAccordion === customer.customerId;
          const activeInternalTab = internalTabs[customer.customerId] || 'APIs';
          return (
            <div key={customer.customerId} className={`border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden transition-all ${isOpen ? 'ring-1 ring-primary-orange/30 shadow-lg' : 'hover:border-gray-300 dark:hover:border-white/10 shadow-sm'}`}>
              <div role="button" tabIndex={0} onClick={() => toggleAccordion(customer.customerId)} className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${isOpen ? 'bg-primary-orange/5 dark:bg-primary-orange/5' : 'bg-white dark:bg-secondary-dark-bg hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary-orange text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}><User className="w-5 h-5" /></div>
                  <div><h3 className="font-bold text-gray-900 dark:text-white">{customer.customerId}</h3><p className="text-xs text-gray-500 font-semibold tracking-wide">{customer.customerName}</p></div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-primary-orange" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
              {isOpen && (
                <div className="p-6 bg-white dark:bg-darkbg border-t border-gray-200 dark:border-white/10 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-2 mb-2"><LayoutGrid className="w-3.5 h-3.5" /> Customer details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Email', 'Phone', 'Status'].map((f) => (
                        <div key={f} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          <p className="text-xs text-gray-500 font-semibold mb-0.5">{f}</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{customer.details[f.toLowerCase()]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex border-b border-gray-100 dark:border-white/10">
                      {['APIs', 'Products', 'TPP'].map((tab) => (
                        <button key={tab} onClick={() => setInternalTab(customer.customerId, tab)} className={`px-6 py-3 text-xs font-bold border-b-2 transition-all ${activeInternalTab === tab ? 'border-primary-orange text-primary-orange' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>{tab}</button>
                      ))}
                    </div>
                    <div className="space-y-8 pl-2">
                      {(activeInternalTab === 'APIs' ? customer.apis : activeInternalTab === 'Products' ? customer.products : customer.tpps).map((item) => (
                        <div key={item.name} className="space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="inline-flex items-center px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm"><span className="text-xs text-gray-700 dark:text-gray-300 tracking-wide font-semibold">{item.name} Name and Details</span></div>
                            <button onClick={() => setDrawerState({ isOpen: true, item })} className="flex items-center gap-2 px-4 py-2 bg-primary-orange/10 text-primary-orange rounded-lg text-xs font-semibold hover:bg-primary-orange/20 transition-all border border-primary-orange/20 shadow-sm"><Cpu className="w-3.5 h-3.5" /> Enable Consent</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsentManagement;
