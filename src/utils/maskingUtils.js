/**
 * Core masking logic to apply selected algorithm to a value.
 * Mandatory Rules: Pure function, < 40 lines.
 */
export const applyMask = (val, algoId, overrides = {}) => {
  if (!val) return '';
  
  switch(algoId) {
    case 'algo_msk_001': {
      const visibleCount = parseInt(overrides.visibleCount) || 4;
      if (val.length <= visibleCount) return val;
      return '*'.repeat(val.length - visibleCount) + val.slice(-visibleCount);
    }
    case 'algo_msk_002': {
      const maskChar = overrides.maskChar || '*';
      return maskChar.repeat(val.length);
    }
    case 'algo_hsh_001': {
      // Mock hash for UI display
      return '5e884898da28... (SHA-256)';
    }
    case 'algo_enc_001': {
      // Mock encryption for UI display
      return 'enc_v1_' + btoa(val).slice(0, 12) + '...';
    }
    default:
      return val;
  }
};
