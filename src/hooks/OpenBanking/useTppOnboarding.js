import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const STEPS = [
  { id: 1, title: 'Business Details', sub: 'Company information', icon: 'Building2' },
  { id: 2, title: 'Regulatory Info', sub: 'Authorization details', icon: 'ShieldCheck' },
  { id: 3, title: 'Technical Setup', sub: 'API configuration', icon: 'Settings2' },
  { id: 4, title: 'Permissions', sub: 'Scopes and domains', icon: 'Lock' },
];

export const useTppOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    business: {
      name: '',
      id: '',
      type: 'Account Information (AISP)',
      regNumber: '',
      address: '',
      country: '',
      website: '',
      email: '',
      phone: ''
    },
    regulatory: {
      authority: '',
      authNumber: '',
      authDate: ''
    },
    technical: {
      redirectUris: ['']
    },
    permissions: {
      scopes: []
    }
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Logic for completion (e.g., API call)
      console.log('Onboarding complete:', formData);
      navigate('/open-banking/provisioning');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addRedirectUri = () => {
    updateFormData('technical', 'redirectUris', [...formData.technical.redirectUris, '']);
  };

  const removeRedirectUri = (index) => {
    const newUris = formData.technical.redirectUris.filter((_, i) => i !== index);
    updateFormData('technical', 'redirectUris', newUris.length > 0 ? newUris : ['']);
  };

  const toggleScope = (scope) => {
    const newScopes = formData.permissions.scopes.includes(scope)
      ? formData.permissions.scopes.filter(s => s !== scope)
      : [...formData.permissions.scopes, scope];
    updateFormData('permissions', 'scopes', newScopes);
  };

  return {
    currentStep,
    formData,
    handleNext,
    handlePrev,
    updateFormData,
    addRedirectUri,
    removeRedirectUri,
    toggleScope,
    steps: STEPS
  };
};
