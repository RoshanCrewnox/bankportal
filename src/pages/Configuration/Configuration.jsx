import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../components/common/ThemeContext';
import { Settings, Shield, Globe, ChevronRight } from 'lucide-react';
import DataMasking from './components/DataMasking';
import DomainConfiguration from './components/DomainConfiguration';

// ── Landing cards definition ───────────────────────────────────────────────
const CONFIG_CARDS = [
  {
    id: 'masking',
    icon: Shield,
    title: 'Masking & Encryption Configuration',
    description: 'Manage data masking algorithms, field-level encryption and dynamic masking policies.',
    accent: 'orange',
  },
  {
    id: 'domain',
    icon: Globe,
    title: 'Domain Configuration',
    description: 'Configure domain-level settings, routing rules and environment bindings.',
    accent: 'blue',
  },
];

// ── Accent colour maps ─────────────────────────────────────────────────────
const ACCENT = {
  orange: {
    iconBg:   { dark: 'bg-orange-500/10 text-orange-400', light: 'bg-orange-100 text-orange-600' },
    border:   { dark: 'border-orange-500/20 hover:border-orange-500/50', light: 'border-orange-200 hover:border-orange-400' },
    chevron:  { dark: 'text-orange-400', light: 'text-orange-500' },
    glow:     'hover:shadow-orange-500/10',
  },
  blue: {
    iconBg:   { dark: 'bg-blue-500/10 text-blue-400', light: 'bg-blue-100 text-blue-600' },
    border:   { dark: 'border-blue-500/20 hover:border-blue-500/50', light: 'border-blue-200 hover:border-blue-400' },
    chevron:  { dark: 'text-blue-400', light: 'text-blue-500' },
    glow:     'hover:shadow-blue-500/10',
  },
};

// ── Main component ─────────────────────────────────────────────────────────
const Configuration = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [activePage, setActivePage] = useState(null); // null | 'masking' | 'domain'

  // ── Page: Masking & Encryption ──────────────────────────────────────────
  if (activePage === 'masking') {
    return (
      <div className="min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-100 text-orange-600'}`}>
            <Shield size={28} />
          </div>
          <div>
            <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Masking & Encryption Configuration
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Configure field-level masking algorithms and encryption policies
            </p>
          </div>
        </div>
        <div className="pt-2 mt-5">
          <DataMasking onBack={() => setActivePage(null)} />
        </div>
      </div>
    );
  }

  // ── Page: Domain Configuration ──────────────────────────────────────────
  if (activePage === 'domain') {
    return (
      <div className="min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-100 text-blue-600'}`}>
            <Globe size={28} />
          </div>
          <div>
            <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Domain Configuration
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Domain-level settings, routing rules and environment bindings
            </p>
          </div>
        </div>
        <div className="pt-2 mt-5">
          <DomainConfiguration onBack={() => setActivePage(null)} />
        </div>
      </div>
    );
  }

  // ── Landing page: two cards ─────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-100 text-orange-600'}`}>
          <Settings size={28} />
        </div>
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            System Configuration
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage global settings, security policies, and data protection rules
          </p>
        </div>
      </div>

      {/* Two-card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 mt-5">
        {CONFIG_CARDS.map(({ id, icon: Icon, title, description, accent }) => {
          const a = ACCENT[accent];
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`group w-full text-left p-7 rounded-2xl border transition-all duration-200 shadow-lg hover:shadow-xl ${a.glow} ${
                isDark
                  ? `bg-white/5 ${a.border.dark} hover:bg-white/8`
                  : `bg-white ${a.border.light} hover:bg-gray-50`
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Icon */}
                <div className={`p-3.5 rounded-xl shrink-0 ${isDark ? a.iconBg.dark : a.iconBg.light}`}>
                  <Icon size={28} />
                </div>

                {/* Chevron */}
                <div className={`mt-1 transition-transform duration-200 group-hover:translate-x-1 ${isDark ? a.chevron.dark : a.chevron.light}`}>
                  <ChevronRight size={22} />
                </div>
              </div>

              <div className="mt-5">
                <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Configuration;
