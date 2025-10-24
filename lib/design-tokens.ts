// Design System Tokens for Debtfly

export const colors = {
  primary: {
    DEFAULT: '#7F6DF2',
    light: '#9688F2',
    dark: '#6B5DD9',
    hover: '#7261E0',
  },
  accent: {
    DEFAULT: '#BFF207',
    light: '#D7F205',
    dark: '#A3CC06',
    hover: '#AAD906',
  },
  dark: {
    DEFAULT: '#014034',
    light: '#023D31',
    muted: '#6B7280',
  },
  background: {
    DEFAULT: '#FFFFFF',
    surface: '#F9FAFB',
    hover: '#F3F4F6',
  },
  border: {
    DEFAULT: '#E5E7EB',
    light: '#F3F4F6',
    dark: '#D1D5DB',
  },
  text: {
    primary: '#014034',
    secondary: '#6B7280',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  status: {
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
};

// Debt stage colors for status badges
export const stageColors = {
  awaiting_signup: {
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#D1D5DB',
    label: 'Awaiting Signup',
  },
  disclosure_requested: {
    bg: '#DBEAFE',
    text: '#1E40AF',
    border: '#93C5FD',
    label: 'Disclosure Requested',
  },
  temporarily_unenforceable: {
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FCD34D',
    label: 'Temporarily Unenforceable',
  },
  under_review: {
    bg: '#E0E7FF',
    text: '#3730A3',
    border: '#A5B4FC',
    label: 'Under Review',
  },
  enforceable: {
    bg: '#FEE2E2',
    text: '#991B1B',
    border: '#FCA5A5',
    label: 'Enforceable',
  },
  permanently_unenforceable: {
    bg: '#D1FAE5',
    text: '#065F46',
    border: '#6EE7B7',
    label: 'Permanently Unenforceable',
  },
  written_off: {
    bg: '#F3F4F6',
    text: '#374151',
    border: '#D1D5DB',
    label: 'Written Off',
  },
};

// Typography scale
export const typography = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Spacing scale (px)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Animation durations
export const animation = {
  fast: '150ms',
  DEFAULT: '200ms',
  slow: '300ms',
  slower: '500ms',
};

// Breakpoints (matches Tailwind defaults)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

