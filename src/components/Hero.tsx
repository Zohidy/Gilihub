import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { ViewType, TranslationType } from '../types';
import { WeatherWidget } from './WeatherWidget';

interface HeroProps {
  setView: (view: ViewType) => void;
  t: TranslationType;
}

export const Hero: React.FC<HeroProps> = ({ setView, t }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/gili-trawangan/1920/1080?blur=2" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-20 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-island-sand/50 via-transparent to-island-sand" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-island-teal/10 text-island-teal text-xs font-bold uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles size={14} />
              {t.hero.badge}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-island-deep mb-8 leading-[0.9] tracking-tighter"
            >
              {t.hero.title} <br />
              <span className="text-island-teal italic font-light">{t.hero.subtitle}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto lg:mx-0 text-lg md:text-xl text-island-deep/60 mb-12 leading-relaxed text-balance"
            >
              {t.hero.desc}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <button 
                onClick={() => setView('explore')}
                className="w-full sm:w-auto pill-button island-gradient text-white shadow-2xl flex items-center justify-center gap-3 group hover:scale-105 transition-transform"
              >
                {t.hero.start}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView('ai')}
                className="w-full sm:w-auto pill-button skeuo-outer text-island-deep flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                <Sparkles size={20} className="text-island-teal" />
                {t.hero.ask}
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hidden lg:block"
          >
            <WeatherWidget />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-island-deep/10 flex justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-island-teal animate-bounce" />
        </div>
      </div>
    </section>
  );
};
