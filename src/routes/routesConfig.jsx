import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import NewLoginContainer from '../components/auth/NewLogin/NewLoginContainer';
import OpenBankingDashboard from '../pages/OpenBanking/OpenBankingDashboard';
import Provisioning from '../pages/OpenBanking/Provisioning';
import TppOnboardingPage from '../pages/OpenBanking/TppOnboardingPage';
import ConsentCenter from '../pages/OpenBanking/ConsentCenter';
import SchemaRegistryPage from '../pages/SchemaRegistry/SchemaRegistryPage';
import FieldsRegistryPage from '../pages/SchemaRegistry/FieldsRegistryPage';
import SchemaFlowPage from '../pages/SchemaRegistry/SchemaFlowPage';

/**
 * Public routes that do not require authentication
 */
export const publicRoutes = [
  {
    name: 'Login',
    path: '/login',
    element: <NewLoginContainer />
  },
  {
    name: 'Two Factor Auth',
    path: '/twofactorauth',
    element: <NewLoginContainer />
  }
];

/**
 * Private routes that require authentication
 * These will be rendered within the PrivateLayout
 */
export const privateRoutes = [
  {
    name: 'Open Banking',
    path: 'open-banking',
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        element: <OpenBankingDashboard />
      },
      {
        name: 'Provisioning',
        path: 'provisioning',
        element: <Provisioning />
      },
      {
        name: 'TPP Onboarding',
        path: 'tpp-onboarding',
        element: <TppOnboardingPage />
      },
      {
        name: 'Consent Center',
        path: 'consent-center',
        element: <ConsentCenter />
      }
    ]
  },
  {
    name: 'Schema Registry',
    path: 'schema-registry',
    children: [
      {
        path: '',
        element: <Navigate to="builder" replace />
      },
      {
        name: 'Schema Builder',
        path: 'builder',
        element: <SchemaRegistryPage />
      },
      {
        name: 'Fields Registry',
        path: 'fields',
        element: <FieldsRegistryPage />
      },
      {
        name: 'Schema Flow',
        path: 'flow',
        element: <SchemaFlowPage />
      }
    ]
  },
  {
    name: 'Root',
    index: true,
    element: <Navigate to="/open-banking/dashboard" replace />
  },
  {
    name: 'Not Found',
    path: '*',
    element: <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">Page under construction</div>
  }
];
