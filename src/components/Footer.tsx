import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Phone, MessageSquare } from 'lucide-react';
import { ViewType, TranslationType } from '../types';
import { auth } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface FooterProps {
  setView: (view: ViewType) => void;
  lang: 'id' | 'en';
  t: TranslationType;
}

export const Footer: React.FC<FooterProps> = ({ setView, lang, t }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const links: ViewType[] = ['home', 'explore', 'ai', 'faq', 'about'];
  if (user && user.email === 'zohidydy@gmail.com') {
    links.push('admin');
  }

  return (
    <footer className="bg-island-deep text-white pt-24 pb-32 md:pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-island-deep">
                <Compass size={24} />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">Gili<span className="text-island-teal">Hub</span></span>
            </div>
            <p className="text-white/50 max-w-md leading-relaxed mb-8">
              {t.footer.desc}
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'TikTok'].map(social => (
                <a key={social} href="#" aria-label={`Follow us on ${social}`} className="w-12 h-12 rounded-xl skeuo-outer flex items-center justify-center hover:island-gradient hover:text-white transition-all group">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-island-teal/20 rounded-sm group-hover:bg-white/20" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8">{t.footer.links}</h4>
            <ul className="space-y-4">
              {links.map(v => (
                <li key={v}>
                  <button 
                    onClick={() => {
                      setView(v);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label={`Go to ${v}`}
                    className="text-white/50 hover:text-island-teal transition-colors text-sm font-medium capitalize flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-island-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                    {v}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8">{t.footer.location}</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-xl skeuo-inner flex items-center justify-center text-island-teal flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="text-sm text-white/50 leading-relaxed">Main Street, Gili Trawangan, Lombok, NTB</span>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-xl skeuo-inner flex items-center justify-center text-island-teal flex-shrink-0">
                  <Phone size={20} />
                </div>
                <span className="text-sm text-white/50">+62 812 3456 7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          <p>© 2026 GiliHub. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
