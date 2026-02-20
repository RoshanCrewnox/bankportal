import React from 'react';
import { User, Building2, ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import StatusBadge from '../StatusBadge';

const ConsentLedger = ({ 
  searchTPP, 
  setSearchTPP, 
  searchCustomerID, 
  setSearchCustomerID, 
  filteredLedger, 
  openAccordion, 
  toggleAccordion, 
  internalTabs, 
  setInternalTab 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary-orange" /> Consent Ledger
        </h2>
        <div className="flex gap-3">
          <div className="relative w-64 group">
            <input
              type="text"
              placeholder="Search by TPP"
              value={searchTPP}
              onChange={(e) => setSearchTPP(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none transition-all dark:text-white"
            />
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-orange transition-colors" />
          </div>
          <div className="relative w-64 group">
            <input
              type="text"
              placeholder="Search by CustomerID"
              value={searchCustomerID}
              onChange={(e) => setSearchCustomerID(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none transition-all dark:text-white"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-orange transition-colors" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredLedger.map((customer) => {
          const isOpen = openAccordion === customer.customerId;
          const activeInternalTab = internalTabs[customer.customerId] || 'APIs';
          return (
            <div key={customer.customerId} className={`border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden transition-all ${isOpen ? 'ring-1 ring-primary-orange/30 shadow-lg' : 'hover:border-gray-300 dark:hover:border-white/10 shadow-sm'}`}>
              <div role="button" tabIndex={0} onClick={() => toggleAccordion(customer.customerId)} className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${isOpen ? 'bg-primary-orange/5 dark:bg-primary-orange/5' : 'bg-white dark:bg-secondary-dark-bg hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary-orange text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{customer.customerId}</h3>
                    <p className="text-xs text-gray-500 font-semibold tracking-wide">{customer.customerName}</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-primary-orange" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
              {isOpen && (
                <div className="p-6 bg-white dark:bg-darkbg border-t border-gray-200 dark:border-white/10 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 flex items-center gap-2 mb-2">
                      <LayoutGrid className="w-3.5 h-3.5" /> Customer details
                    </h4>
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
                      {['APIs', 'Products'].map((tab) => (
                        <button key={tab} onClick={() => setInternalTab(customer.customerId, tab)} className={`px-6 py-3 text-xs font-bold border-b-2 transition-all ${activeInternalTab === tab ? 'border-primary-orange text-primary-orange' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>{tab}</button>
                      ))}
                    </div>
                    <div className="space-y-8 pl-2">
                      {(activeInternalTab === 'APIs' ? customer.apis : customer.products).map((item) => (
                        <div key={item.name} className="space-y-4">
                          <div className="inline-flex items-center px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide">{item.name}</span>
                          </div>
                          <div className="space-y-2.5 pl-6">
                            {item.consents.map((consent, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-white/5 rounded-xl hover:border-primary-orange/30 hover:shadow-md transition-all group overflow-hidden relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary-orange transition-colors" />
                                <div className="min-w-[100px] flex items-center"><StatusBadge status={consent.status} /></div>
                                <div className="flex-1 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-400 opacity-70">Who:</span>
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{consent.granter}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-400 opacity-70">When:</span>
                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{consent.date}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
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

export default ConsentLedger;
