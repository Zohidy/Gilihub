import React from 'react';
import { motion } from 'motion/react';
import { Bike, Waves, Compass, Camera, Map, Star, ArrowRight } from 'lucide-react';
import { ServiceItem, formatPrice } from '../constants';
import { CategoryType, TranslationType } from '../types';

interface ExploreProps {
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  filteredServices: ServiceItem[];
  setSelectedItem: (item: ServiceItem) => void;
  setBookingStep: (step: 'details' | 'form') => void;
  getIcon: (iconName: string, size?: number) => React.ReactNode;
  lang: 'id' | 'en';
  t: TranslationType;
}

export const Explore: React.FC<ExploreProps> = ({ 
  activeCategory, 
  setActiveCategory, 
  filteredServices, 
  setSelectedItem, 
  setBookingStep,
  getIcon,
  lang, 
  t 
}) => {

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-island-teal/10 text-island-teal text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Compass size={14} />
            {t.services.badge}
          </div>
          <h2 className="text-4xl md:text-6xl text-island-deep mb-6">{t.services.title}</h2>
          <p className="text-island-deep/60 max-w-2xl mx-auto">{t.services.desc}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {(['all', 'bike', 'snorkeling', 'tour'] as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-label={`Filter by ${cat}`}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                  ? 'island-gradient text-white scale-105' 
                  : 'skeuo-outer text-island-deep/60 hover:text-island-teal'
              }`}
            >
              {t.services[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group skeuo-outer rounded-[2.5rem] p-8 hover:-translate-y-2 transition-all duration-500 flex flex-col"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 skeuo-inner rounded-2xl flex items-center justify-center text-island-teal group-hover:rotate-6 transition-transform">
                  {getIcon(service.icon)}
                </div>
                <div className="flex items-center gap-1 text-island-gold">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold">4.9</span>
                </div>
              </div>
              
              <h3 className="text-2xl text-island-deep mb-4 group-hover:text-island-teal transition-colors">{service.title[lang]}</h3>
              <p className="text-island-deep/50 text-sm leading-relaxed mb-8 flex-grow">{service.description[lang]}</p>
              
              <div className="pt-8 border-t border-island-deep/5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-island-deep/30 mb-1">Mulai dari</span>
                  <span className="text-lg font-bold text-island-teal">{formatPrice(service.basePrice)}</span>
                </div>
                <button 
                  onClick={() => setSelectedItem(service)}
                  aria-label={`Book ${service.title[lang]}`}
                  className="w-12 h-12 rounded-full skeuo-outer text-island-deep flex items-center justify-center group-hover:island-gradient group-hover:text-white transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
