import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, ArrowRight, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { TranslationType } from '../types';

interface AIGuideProps {
  aiInput: string;
  setAiInput: (input: string) => void;
  aiActivity: string;
  setAiActivity: (activity: string) => void;
  aiBudget: string;
  setAiBudget: (budget: string) => void;
  aiDuration: string;
  setAiDuration: (duration: string) => void;
  aiRecommendation: any;
  setAiRecommendation: (rec: any) => void;
  isAiLoading: boolean;
  handleAiAsk: () => void;
  t: TranslationType;
}

export const AIGuide: React.FC<AIGuideProps> = ({ 
  aiInput, setAiInput, 
  aiActivity, setAiActivity,
  aiBudget, setAiBudget,
  aiDuration, setAiDuration,
  aiRecommendation, setAiRecommendation, 
  isAiLoading, handleAiAsk, t 
}) => {
  const activities = [
    { id: 'adventure', label: { id: 'Petualangan', en: 'Adventure' } },
    { id: 'relax', label: { id: 'Santai', en: 'Relaxation' } },
    { id: 'family', label: { id: 'Keluarga', en: 'Family' } },
    { id: 'water', label: { id: 'Wisata Air', en: 'Water Sports' } },
  ];

  const budgets = [
    { id: 'budget', label: { id: 'Hemat', en: 'Budget' } },
    { id: 'mid', label: { id: 'Menengah', en: 'Mid-range' } },
    { id: 'luxury', label: { id: 'Mewah', en: 'Luxury' } },
  ];

  const durations = [
    { id: '1day', label: { id: '1 Hari', en: '1 Day' } },
    { id: '3days', label: { id: '2-3 Hari', en: '2-3 Days' } },
    { id: '1week', label: { id: '1 Minggu', en: '1 Week' } },
  ];

  const lang = t.ai.activity === 'Jenis Aktivitas' ? 'id' : 'en';

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-island-teal/10 text-island-teal text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} />
            {t.ai.badge}
          </div>
          <h2 className="text-4xl md:text-6xl text-island-deep mb-6">{t.ai.title}</h2>
          <p className="text-island-deep/60">{t.ai.desc}</p>
        </div>

        <div className="glass-card rounded-[3rem] p-8 md:p-12 shadow-2xl border-white/40">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-island-teal mb-3 ml-1">{t.ai.activity}</label>
              <select 
                value={aiActivity}
                onChange={(e) => setAiActivity(e.target.value)}
                className="w-full bg-island-sand/50 border-none rounded-2xl py-4 px-6 text-island-deep focus:ring-2 focus:ring-island-teal/20 transition-all appearance-none skeuo-inner"
              >
                <option value="">{t.services.all}</option>
                {activities.map(a => <option key={a.id} value={a.id}>{a.label[lang]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-island-teal mb-3 ml-1">{t.ai.budget}</label>
              <select 
                value={aiBudget}
                onChange={(e) => setAiBudget(e.target.value)}
                className="w-full bg-island-sand/50 border-none rounded-2xl py-4 px-6 text-island-deep focus:ring-2 focus:ring-island-teal/20 transition-all appearance-none skeuo-inner"
              >
                <option value="">{t.services.all}</option>
                {budgets.map(b => <option key={b.id} value={b.id}>{b.label[lang]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-island-teal mb-3 ml-1">{t.ai.duration}</label>
              <select 
                value={aiDuration}
                onChange={(e) => setAiDuration(e.target.value)}
                className="w-full bg-island-sand/50 border-none rounded-2xl py-4 px-6 text-island-deep focus:ring-2 focus:ring-island-teal/20 transition-all appearance-none skeuo-inner"
              >
                <option value="">{t.services.all}</option>
                {durations.map(d => <option key={d.id} value={d.id}>{d.label[lang]}</option>)}
              </select>
            </div>
          </div>

          <div className="relative mb-8">
            <textarea 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder={t.ai.placeholder}
              className="w-full bg-island-sand/50 border-none rounded-[2rem] p-8 pr-20 text-island-deep placeholder:text-island-deep/30 focus:ring-2 focus:ring-island-teal/20 transition-all resize-none h-40 skeuo-inner"
            />
            <button 
              onClick={handleAiAsk}
              disabled={isAiLoading || !aiInput.trim()}
              className="absolute bottom-6 right-6 w-14 h-14 island-gradient rounded-2xl flex items-center justify-center text-white shadow-xl disabled:opacity-50 disabled:scale-95 transition-all hover:scale-105"
            >
              {isAiLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight size={24} />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {aiRecommendation ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="skeuo-outer rounded-[2rem] p-8 md:p-10 relative"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 text-island-teal">
                    <div className="w-10 h-10 bg-island-teal/10 rounded-xl flex items-center justify-center">
                      <MessageSquare size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">{t.ai.insight}</span>
                  </div>
                  <button 
                    onClick={() => setAiRecommendation(null)}
                    className="p-2 text-island-deep/20 hover:text-island-coral transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="markdown-body prose prose-island max-w-none text-island-deep/80 leading-relaxed">
                  <Markdown>{aiRecommendation}</Markdown>
                </div>
              </motion.div>
            ) : !isAiLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 skeuo-inner rounded-[2rem]"
              >
                <div className="w-16 h-16 skeuo-outer rounded-full flex items-center justify-center mx-auto mb-4 text-island-teal">
                  <Sparkles size={32} />
                </div>
                <p className="text-island-deep/30 text-sm font-medium">Asisten AI siap membantu merencanakan liburanmu.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
