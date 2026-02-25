/**
 * domainConfig.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all available domains and their subdomains.
 *
 * This file is used by:
 *   1. BuilderForm  – to populate the Domain / Sub Domain dropdowns
 *   2. DomainConfiguration – to show the full list and let admins toggle visibility
 *
 * The "enabled" state is stored in localStorage under DOMAIN_CONFIG_KEY.
 * BuilderForm reads that key at runtime to filter what the user can pick.
 */

export const DOMAIN_CONFIG_KEY = 'domain_visibility_config';

/**
 * Master domain catalogue.
 * Each entry: { domain: string, subdomains: string[] }
 */
export const DOMAIN_CATALOGUE = [
  {
    domain: 'BFSI',
    subdomains: ['Investments', 'Insurance', 'Pensions', 'Loans', 'Credit cards', 'Wealth management', 'BNPL', 'Crypto'],
  },
  {
    domain: 'Telcom',
    subdomains: ['Telco payments'],
  },
  {
    domain: 'Utilities',
    subdomains: ['Utility bills'],
  },
  {
    domain: 'Retail',
    subdomains: ['BNPL'],
  },
  {
    domain: 'Oil&Gas',
    subdomains: [],
  },
  {
    domain: 'Healthcare',
    subdomains: [],
  },
  {
    domain: 'Lifescience',
    subdomains: [],
  },
];

/** Flat list of all domain labels – use as the full options list */
export const ALL_DOMAIN_OPTIONS = DOMAIN_CATALOGUE.map((d) => d.domain);

/** Flat list of every unique subdomain across all domains */
export const ALL_SUBDOMAIN_OPTIONS = [
  ...new Set(DOMAIN_CATALOGUE.flatMap((d) => d.subdomains)),
];

// ── Config helpers ─────────────────────────────────────────────────────────────

/** Load current domain visibility config from localStorage */
export const loadDomainConfig = () => {
  try {
    const raw = localStorage.getItem(DOMAIN_CONFIG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/** Persist domain visibility config to localStorage */
export const saveDomainConfig = (config) => {
  localStorage.setItem(DOMAIN_CONFIG_KEY, JSON.stringify(config));
};

/**
 * Returns the list of domain names that are currently enabled.
 * If a domain has never been configured it defaults to enabled (true).
 */
export const getEnabledDomains = (config = loadDomainConfig()) => {
  return ALL_DOMAIN_OPTIONS.filter((d) => config[d]?.enabled !== false);
};

/**
 * Returns the list of subdomains that are currently enabled for a given domain.
 * Falls back to all subdomains from the catalogue if not yet configured.
 */
export const getEnabledSubdomains = (domain, config = loadDomainConfig()) => {
  const entry = DOMAIN_CATALOGUE.find((d) => d.domain === domain);
  const allSubs = entry ? entry.subdomains : ALL_SUBDOMAIN_OPTIONS;

  // If the parent domain is disabled, return nothing
  if (config[domain]?.enabled === false) return [];

  return allSubs.filter((s) => config[domain]?.subdomains?.[s] !== false);
};

/**
 * Returns the union of enabled subdomains across ALL enabled domains.
 * Useful when the subdomain dropdown is not domain-specific.
 */
export const getAllEnabledSubdomains = (config = loadDomainConfig()) => {
  const enabledDomains = getEnabledDomains(config);
  const result = new Set();
  enabledDomains.forEach((d) => {
    getEnabledSubdomains(d, config).forEach((s) => result.add(s));
  });
  return [...result].sort();
};
