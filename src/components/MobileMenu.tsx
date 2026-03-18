import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Search, Sparkles, HelpCircle, User, Calendar, ShieldCheck } from 'lucide-react';
import { ViewType, TranslationType } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  view: ViewType;
  setView: (view: ViewType) => void;
  t: TranslationType;
  user: any;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, view, setView, t, user }) => {
  const navItems: { id: ViewType; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: t.nav.home },
    { id: 'explore', icon: Search, label: t.nav.services },
    { id: 'ai', icon: Sparkles, label: t.nav.guide },
    { id: 'faq', icon: HelpCircle, label: t.nav.faq },
    { id: 'about', icon: User, label: t.nav.about },
  ];

  if (user) {
    navItems.push({ id: 'my-bookings', icon: Calendar, label: 'My Bookings' });
  }

  if (user && user.email === 'zohidydy@gmail.com') {
    navItems.push({ id: 'admin', icon: ShieldCheck, label: t.nav.admin });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[110] bg-island-sand p-6 md:hidden"
        >
          <div className="flex justify-end mb-8">
            <button onClick={onClose} className="w-12 h-12 rounded-2xl skeuo-outer flex items-center justify-center text-island-deep">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  onClose();
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold ${
                  view === item.id ? 'island-gradient text-white' : 'text-island-deep'
                }`}
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
