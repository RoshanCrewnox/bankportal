import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Globe, ChevronDown, ChevronRight, RefreshCw, Info, Search } from 'lucide-react';
import { ThemeContext } from '../../../components/common/ThemeContext';
import {
  DOMAIN_CATALOGUE,
  ALL_DOMAIN_OPTIONS,
  loadDomainConfig,
  saveDomainConfig,
} from '../../../utils/domainConfig';

// ── Schema loader (local storage) ────────────────────────────────────────────
const SCHEMA_STORAGE_KEY = 'schema_registry_schemas';

const loadSchemas = () => {
  try {
    const raw = localStorage.getItem(SCHEMA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

/**
 * Count how many schemas use a given domain.
 */
const countSchemasForDomain = (schemas, domain) => {
  return schemas.filter((s) => {
    const domains = Array.isArray(s.cdm_domain) ? s.cdm_domain : (s.cdm_domain ? [s.cdm_domain] : []);
    return domains.includes(domain);
  }).length;
};

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange, isDark }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? 'bg-primary-orange' : isDark ? 'bg-white/10' : 'bg-gray-200'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// ── Domain Row ─────────────────────────────────────────────────────────────────
const DomainRow = ({ domain, subdomains, schemasCount, config, onToggleDomain, onToggleSubdomain, isDark, searchTerm }) => {
  const [expanded, setExpanded] = useState(true);
  const domainEnabled = config[domain]?.enabled ?? true;

  const filteredSubs = subdomains.filter(
    (sub) => !searchTerm || sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isDark
          ? 'bg-white/3 border-white/10'
          : 'bg-white border-gray-200 shadow-sm'
      } ${!domainEnabled ? 'opacity-60' : ''}`}
    >
      {/* Domain Header */}
      <div className={`flex items-center justify-between px-5 py-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          {/* Expand / collapse */}
          {subdomains.length > 0 ? (
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`p-1 rounded-md transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-7" />
          )}

          {/* Icon + name */}
          <div className={`p-2 rounded-lg ${domainEnabled ? 'bg-primary-orange/10 text-primary-orange' : isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            <Globe size={16} />
          </div>
          <div>
            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{domain}</span>
            <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {schemasCount} schema{schemasCount !== 1 ? 's' : ''} · {subdomains.length} subdomain{subdomains.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Enable toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${domainEnabled ? 'text-primary-orange' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {domainEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <Toggle enabled={domainEnabled} onChange={() => onToggleDomain(domain)} isDark={isDark} />
        </div>
      </div>

      {/* Subdomains */}
      {expanded && subdomains.length > 0 && (
        <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
          {filteredSubs.map((sub) => {
            const subEnabled = config[domain]?.subdomains?.[sub] ?? true;
            return (
              <div
                key={sub}
                className={`flex items-center justify-between px-6 py-3 pl-16 transition-colors ${
                  isDark ? 'hover:bg-white/3' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${subEnabled && domainEnabled ? 'bg-primary-orange' : isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{sub}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${subEnabled && domainEnabled ? (isDark ? 'text-gray-400' : 'text-gray-500') : isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                    {!domainEnabled ? 'Inherited off' : subEnabled ? 'Visible' : 'Hidden'}
                  </span>
                  <Toggle
                    enabled={subEnabled && domainEnabled}
                    onChange={() => domainEnabled && onToggleSubdomain(domain, sub)}
                    isDark={isDark}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const DomainConfiguration = ({ onBack }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [schemas, setSchemas]       = useState([]);
  const [config, setConfig]         = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [saved, setSaved]           = useState(false);

  // Load on mount
  const refresh = useCallback(() => {
    setSchemas(loadSchemas());
    setConfig(loadDomainConfig());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // All domains come from the master catalogue (DOMAIN_CATALOGUE), not just schemas
  // Schemas only contribute the usage count.
  const allDomains = ALL_DOMAIN_OPTIONS; // already sorted by catalogue order

  // Toggle helpers
  const toggleDomain = (domain) => {
    setConfig((prev) => {
      const current = prev[domain] ?? { enabled: true, subdomains: {} };
      return { ...prev, [domain]: { ...current, enabled: !current.enabled } };
    });
    setSaved(false);
  };

  const toggleSubdomain = (domain, sub) => {
    setConfig((prev) => {
      const current = prev[domain] ?? { enabled: true, subdomains: {} };
      const subs = current.subdomains ?? {};
      return {
        ...prev,
        [domain]: { ...current, subdomains: { ...subs, [sub]: !(subs[sub] ?? true) } },
      };
    });
    setSaved(false);
  };

  const handleSave = () => {
    saveDomainConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Stats
  const enabledDomainsCount   = allDomains.filter((d) => config[d]?.enabled !== false).length;
  const totalSubdomainsCount  = DOMAIN_CATALOGUE.reduce((acc, e) => acc + e.subdomains.length, 0);
  const enabledSubdomainsCount = DOMAIN_CATALOGUE.reduce((acc, entry) => {
    if (config[entry.domain]?.enabled === false) return acc;
    return acc + entry.subdomains.filter((s) => config[entry.domain]?.subdomains?.[s] !== false).length;
  }, 0);

  // Search filter
  const filteredDomains = allDomains.filter((d) => {
    const entry = DOMAIN_CATALOGUE.find((e) => e.domain === d);
    return (
      !searchTerm ||
      d.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry?.subdomains ?? []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className={`w-full flex flex-col gap-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Domains',      value: allDomains.length,      sub: 'in master catalogue' },
          { label: 'Enabled Domains',    value: enabledDomainsCount,    sub: 'visible in schema info' },
          { label: 'Total Subdomains',   value: totalSubdomainsCount,   sub: 'across all domains' },
          { label: 'Enabled Subdomains', value: enabledSubdomainsCount, sub: 'currently visible' },
        ].map(({ label, value, sub }) => (
          <div key={label} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/3 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="text-2xl font-extrabold text-primary-orange">{value}</div>
            <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Info Banner ── */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
        <Info size={16} className={`shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
        <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          All domains and subdomains from the <strong>Schema Builder</strong> master catalogue are listed below.
          Enable or disable them to control what appears in the <strong>Domain</strong> and <strong>Sub Domain</strong> dropdowns when onboarding new schemas.
          Click <strong>Save Configuration</strong> to apply.
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border flex-1 min-w-[200px] max-w-sm ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <Search size={15} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            placeholder="Search domains or subdomains…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-800 placeholder:text-gray-400'}`}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${
              saved
                ? 'bg-green-500 text-white shadow-green-500/20'
                : 'bg-primary-orange text-white hover:bg-orange-600 shadow-orange-500/20'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* ── Domain List ── */}
      {filteredDomains.length === 0 ? (
        <div className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No domains or subdomains match <strong>"{searchTerm}"</strong>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredDomains.map((domain) => {
            const entry = DOMAIN_CATALOGUE.find((e) => e.domain === domain);
            return (
              <DomainRow
                key={domain}
                domain={domain}
                subdomains={entry?.subdomains ?? []}
                schemasCount={countSchemasForDomain(schemas, domain)}
                config={config}
                onToggleDomain={toggleDomain}
                onToggleSubdomain={toggleSubdomain}
                isDark={isDark}
                searchTerm={searchTerm}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DomainConfiguration;
