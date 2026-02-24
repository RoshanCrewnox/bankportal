export const MASKING_ALGORITHMS = [
  {
    id: 'algo_msk_001',
    name: 'Partial Masking (Last X)',
    description: 'Masks all characters except the last specified number of digits.',
    example: '1234567890 -> ******7890',
    type: 'Masking',
    strength: 'Medium',
    params: [{ id: 'visibleCount', name: 'Visible Digits', type: 'number', default: 4 }]
  },
  {
    id: 'algo_msk_002',
    name: 'Full Masking',
    description: 'Replaces all characters with a specified mask character.',
    example: 'sensitive_data -> **************',
    type: 'Masking',
    strength: 'High',
    params: [{ id: 'maskChar', name: 'Mask Character', type: 'text', default: '*' }]
  },
  {
    id: 'algo_enc_001',
    name: 'AES-256 Encryption',
    description: 'Advanced Encryption Standard with 256-bit key.',
    example: 'Symmetric encryption for sensitive storage.',
    type: 'Encryption',
    strength: 'Maximum',
    params: []
  },
  {
    id: 'algo_hsh_001',
    name: 'SHA-256 Hashing',
    description: 'One-way cryptographic hash function.',
    example: 'user123 -> 5e884898da28047151d0e56f8...',
    type: 'Hashing',
    strength: 'Strong',
    params: []
  },
];

export const MASKING_LEVELS = [
  { id: 'light', name: 'Light', description: 'Basic protection for semi-sensitive data.' },
  { id: 'standard', name: 'Standard', description: 'Recommended for PII (Personally Identifiable Information).' },
  { id: 'strict', name: 'Strict', description: 'Maximum protection for highly sensitive financial data.' },
];
