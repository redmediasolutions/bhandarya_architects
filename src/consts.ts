export const SITE_TITLE = 'Bhandary Architects';
export const UPLOADS = '/uploads';

/** Helper: resolve an image path under public/uploads */
export const img = (path: string) => `${UPLOADS}/${path}`;

export const NAV = [
  { label: 'Homepage', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About Us', href: '/about-us' },
];

export const CONTACT = {
  phone: '+91 98765 43210',
  email: 'info@bhandaryassociates.com',
  location: 'Mangalore, India',
};

/** Animated counter targets on the homepage stats bar */
export const STATS = [
  { value: 30, suffix: '+', label: 'YEARS OF EXCELLENCE' },
  { value: 150, suffix: '+', label: 'PROJECTS COMPLETED' },
  { value: 30, suffix: '+', label: 'YEARS OF EXCELLENCE' },
];
