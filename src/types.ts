import { ServiceItem } from './constants';

export type ViewType = 'home' | 'explore' | 'ai' | 'faq' | 'about' | 'admin' | 'my-bookings';
export type CategoryType = 'all' | 'bike' | 'snorkeling' | 'tour';

export interface BookingFormType {
  name: string;
  phone: string;
  date: string;
  guests: string;
  duration: string;
  durationType: 'days' | 'hours';
  pickupLocation: string;
}

export interface FormErrorsType {
  name?: string;
  date?: string;
  phone?: string;
  pickupLocation?: string;
}

export interface TranslationType {
  nav: { home: string; services: string; guide: string; faq: string; about: string; contact: string; admin: string };
  hero: { badge: string; title: string; subtitle: string; desc: string; start: string; ask: string };
  about: { badge: string; title: string; subtitle: string; desc: string; trust: string; trustDesc: string; support: string; supportDesc: string };
  services: { badge: string; title: string; desc: string; all: string; bike: string; snorkeling: string; tour: string };
  ai: { 
    badge: string; 
    title: string; 
    desc: string; 
    placeholder: string; 
    ask: string; 
    loading: string; 
    insight: string;
    activity: string;
    budget: string;
    duration: string;
  };
  faq: { badge: string; title: string; desc: string };
  footer: { desc: string; links: string; location: string };
  booking: { 
    book: string; 
    wa: string; 
    name: string; 
    phone: string;
    pickup: string;
    pickupPlaceholder: string;
    date: string; 
    guests: string; 
    duration: string; 
    days: string; 
    hours: string; 
    confirm: string; 
    back: string; 
    success: string; 
    errorRequired: string; 
  };
}
