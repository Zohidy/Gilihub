import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQItem } from '../constants';
import { TranslationType } from '../types';

interface FAQProps {
  faqs: FAQItem[];
  openFaqIndex: number | null;
  setOpenFaqIndex: (index: number | null) => void;
  lang: 'id' | 'en';
  t: TranslationType;
}

export const FAQ: React.FC<FAQProps> = ({ faqs, openFaqIndex, setOpenFaqIndex, lang, t }) => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-island-teal/10 text-island-teal text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <HelpCircle size={14} />
            {t.faq.badge}
          </div>
          <h2 className="text-4xl md:text-6xl text-island-deep mb-6">{t.faq.title}</h2>
          <p className="text-island-deep/60">{t.faq.desc}</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
                openFaqIndex === idx ? 'skeuo-pressed scale-[1.02]' : 'skeuo-outer'
              }`}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full px-10 py-8 flex items-center justify-between text-left group"
              >
                <span className={`text-lg font-bold transition-colors ${openFaqIndex === idx ? 'text-island-teal' : 'text-island-deep'}`}>
                  {faq.question[lang]}
                </span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  openFaqIndex === idx ? 'island-gradient text-white rotate-180' : 'skeuo-inner text-island-deep/40 group-hover:text-island-teal'
                }`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  >
                    <div className="px-10 pb-10 text-island-deep/60 leading-relaxed text-base border-t border-island-deep/5 pt-8">
                      {faq.answer[lang]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
