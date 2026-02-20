import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTppOnboarding } from '../../hooks/OpenBanking/useTppOnboarding';
import BusinessDetailsStep from '../../components/OpenBanking/TppOnboarding/BusinessDetailsStep';
import RegulatoryInfoStep from '../../components/OpenBanking/TppOnboarding/RegulatoryInfoStep';
import TechnicalSetupStep from '../../components/OpenBanking/TppOnboarding/TechnicalSetupStep';
import PermissionsStep from '../../components/OpenBanking/TppOnboarding/PermissionsStep';

const TppOnboardingPage = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    formData, 
    handleNext, 
    handlePrev, 
    updateFormData, 
    addRedirectUri, 
    removeRedirectUri, 
    toggleScope,
    steps 
  } = useTppOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <BusinessDetailsStep formData={formData.business} updateFormData={updateFormData} />;
      case 2: return <RegulatoryInfoStep formData={formData.regulatory} updateFormData={updateFormData} />;
      case 3: return <TechnicalSetupStep formData={formData.technical} updateFormData={updateFormData} addRedirectUri={addRedirectUri} removeRedirectUri={removeRedirectUri} />;
      case 4: return <PermissionsStep formData={formData.permissions} toggleScope={toggleScope} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-darkbg animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="bg-white dark:bg-secondary-dark-bg border-b border-gray-100 dark:border-white/5 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/open-banking/provisioning')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">TPP Onboarding Flow</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium tracking-wider mt-0.5">Setup new provider credentials & permissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Progress Stepper */}
        <div className="lg:col-span-3">
          <div className="sticky top-10 space-y-8">
            <div className="space-y-6">
              {steps.map((step) => {
                const Icon = step.icon; // Icon needs to be handled if it's a string, but in the original it was a component reference. 
                // In my hook I used strings for simplicity, but I should probably import them or keep component refs.
                // Let's fix the hook to use icons from lucide-react.
                return (
                  <div key={step.id} className="flex items-center gap-4 group">
                    <div className={`
                      relative w-10 min-w-[40px] h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${currentStep === step.id ? 'bg-primary-orange text-white shadow-lg shadow-primary-orange/20 scale-110 z-10' : 
                        currentStep > step.id ? 'bg-primary-orange/10 text-primary-orange border-2 border-primary-orange/20' : 
                        'bg-white dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10'}
                    `}>
                      {currentStep > step.id ? <Check size={18} className="stroke-[3px]" /> : <span className="text-xs font-bold">{step.id}</span>}
                      {step.id < 4 && (
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 ${currentStep > step.id ? 'bg-primary-orange/30' : 'bg-gray-100 dark:bg-white/5'}`} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === step.id ? 'text-primary-orange' : 'text-gray-400'}`}>
                        Step {step.id}
                      </span>
                      <span className={`text-sm font-bold ${currentStep === step.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-primary-orange/5 rounded-3xl border border-primary-orange/10">
              <p className="text-xs text-primary-orange font-bold leading-relaxed">
                Complete all requirements to provision new TPP access to the Open Banking infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Form Content */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-secondary-dark-bg rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden flex flex-col min-h-[600px]">
            <div className="flex-1 p-10 md:p-14">
              <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderStep()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <button
                onClick={handlePrev}
                style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                className="flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl font-black text-[10px] tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-2.5 px-8 py-3 bg-primary-orange hover:bg-primary-orange/90 text-white rounded-xl font-black text-[10px] tracking-widest shadow-[0_8px_20_rgba(237,127,24,0.25)] hover:shadow-[0_12px_30px_rgba(237,127,24,0.35)] transition-all active:scale-95"
              >
                {currentStep === 4 ? 'Complete Onboarding' : 'Next Step'}
                {currentStep < 4 && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TppOnboardingPage;
