import React from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Clock } from 'lucide-react';
import { TranslationType } from '../types';

interface AboutProps {
  t: TranslationType;
}

export const About: React.FC<AboutProps> = ({ t }) => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/gili-life/800/1000" 
                alt="Gili Life" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 glass-card p-8 rounded-[2.5rem] shadow-2xl hidden md:block max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 island-gradient rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold text-island-deep">{t.about.trust}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-island-teal">Verified Service</div>
                </div>
              </div>
              <p className="text-sm text-island-deep/60 leading-relaxed">{t.about.trustDesc}</p>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-island-teal/10 text-island-teal text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <User size={14} />
              {t.about.badge}
            </div>
            <h2 className="text-4xl md:text-6xl text-island-deep mb-8 leading-tight">{t.about.title}</h2>
            <p className="text-lg text-island-deep/60 mb-12 leading-relaxed">{t.about.desc}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 skeuo-outer rounded-[2rem]">
                <div className="w-12 h-12 skeuo-inner rounded-xl flex items-center justify-center text-island-teal mb-6">
                  <Clock size={24} />
                </div>
                <h4 className="text-xl text-island-deep mb-2">{t.about.support}</h4>
                <p className="text-sm text-island-deep/50">{t.about.supportDesc}</p>
              </div>
              <div className="p-8 skeuo-outer rounded-[2rem]">
                <div className="w-12 h-12 skeuo-inner rounded-xl flex items-center justify-center text-island-teal mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-xl text-island-deep mb-2">Safety First</h4>
                <p className="text-sm text-island-deep/50">Your safety is our top priority in every adventure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
