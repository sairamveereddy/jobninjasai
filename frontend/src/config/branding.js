
// ============================================
// JobNinjas - CENTRALIZED BRANDING CONFIG
// ============================================
// Update these values to change branding across the entire app

export const BRAND = {
  // Core branding
  name: 'JobNinjas',
  oldName: 'JobNinjas.ai',
  domain: 'jobninjas.ai',

  // Taglines
  tagline: 'Apply Smarter, Land Faster',
  shortTagline: 'Your Personal Job Ninja',
  heroTagline: 'AI-Powered Career Coaching & Job Search Automation',

  // Contact
  contactEmail: 'hello@jobninjas.ai',
  supportEmail: 'support@jobninjas.ai',

  // Social/Links
  website: 'https://jobninjas.ai',

  // Logo (update path when new logo is ready)
  logoPath: '/logo.png',
  logoAlt: 'JobNinjas Logo',

  // Company info
  year: new Date().getFullYear(),
  copyright: `© ${new Date().getFullYear()} JobNinjas.ai. All rights reserved.`,
};

// ============================================
// PRODUCT TIERS
// ============================================

export const PRODUCTS = {
  AI_NINJA: {
    name: 'AI Ninja',
    path: '/ai-ninja',
    description: 'Self-serve AI-powered job applications',
    tagline: 'Apply smarter, not slower.',
  },
};

// ============================================
// PRICING CONFIGURATION
// ============================================

export const PRICING = {
  // ============================================
  // AI NINJA PLANS
  // ============================================
  NINJA_STARTER: {
    id: 'ninja-starter',
    name: 'AI Ninja Starter',
    price: 15,
    originalPrice: 19,
    priceDisplay: '$15',
    period: 'Monthly',
    calls: '1 call per week',
    description: 'Perfect for regular check-ins and guidance.',
    features: [
      '1 AI Ninja Call per week',
      'AI-generated report after every call',
      'Public AI Portfolio (Basic URL)',
      'Personalized career roadmap',
      'Basic Email Support',
    ],
  },
  NINJA_PRO: {
    id: 'ninja-pro',
    name: 'AI Ninja Pro',
    price: 59,
    originalPrice: 79,
    priceDisplay: '$59',
    period: 'Monthly',
    calls: 'Alternate day calls',
    popular: true,
    description: 'Accelerated growth with scheduled calls.',
    features: [
      '3-4 AI Ninja Calls per week',
      'Custom URL (username.jobninjas.ai)',
      'Verified Skill Badges on Portfolio',
      'Daily growth tips and roadmap adjustments',
      'Priority Support',
    ],
  },
  NINJA_ELITE: {
    id: 'ninja-elite',
    name: 'AI Ninja Elite',
    price: 99,
    originalPrice: 129,
    priceDisplay: '$99',
    period: 'Monthly',
    calls: 'Everyday calls',
    description: 'Maximum intensity for rapid career transition.',
    features: [
      '7 AI Ninja Calls per week (Daily)',
      'Premium Custom URL & Live Portfolio',
      'Advanced performance analytics',
      'Direct recruiter chat activation',
      '24/7 Priority Support',
    ],
  },
  NINJA_CREDIT: {
    id: 'ninja-credit',
    name: 'AI Ninja Call Credit',
    price: 5,
    priceDisplay: '$5',
    period: ' per credit',
    description: 'One-off call when you need it.',
    features: [
      '1 AI Ninja Call',
      'Immediate report generation',
      'No subscription required',
    ],
  },

};

// ============================================
// APPLICATION STATUSES
// ============================================

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  OFFER: 'offer',
  ON_HOLD: 'on_hold',
};

export const APPLICATION_STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  rejected: 'Rejected',
  offer: 'Offer',
  on_hold: 'On Hold',
};

// ============================================
// VISA TYPES
// ============================================

export const VISA_TYPES = [
  { value: 'opt', label: 'OPT' },
  { value: 'stem-opt', label: 'STEM OPT' },
  { value: 'h1b', label: 'H-1B' },
  { value: 'h4-ead', label: 'H4 EAD' },
  { value: 'l1', label: 'L1' },
  { value: 'gc', label: 'Green Card' },
  { value: 'citizen', label: 'US Citizen' },
  { value: 'pr', label: 'Permanent Resident' },
  { value: 'other', label: 'Other' },
];

// ============================================
// WORK TYPES
// ============================================

export const WORK_TYPES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

export default BRAND;


