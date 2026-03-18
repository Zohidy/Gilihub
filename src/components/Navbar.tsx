import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Search, Sparkles, HelpCircle, User, Globe, Menu, X, Compass, ShieldCheck, LogIn, LogOut, Calendar } from 'lucide-react';
import { ViewType, TranslationType } from '../types';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  t: TranslationType;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView, lang, setLang, isMenuOpen, setIsMenuOpen, t }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/admin-restricted-operation') {
        alert('This operation is restricted. Please contact the administrator.');
      } else {
        alert('Login failed: ' + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (view === 'admin') setView('home');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="glass-card rounded-full px-8 py-4 flex items-center justify-between border-white/60">
            <div className="flex items-center gap-3 cursor-pointer group skeuo-outer p-2 rounded-2xl" onClick={() => setView('home')}>
              <div className="w-10 h-10 island-gradient rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <Compass size={24} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-island-deep">Gili<span className="text-island-teal">Hub</span></span>
            </div>
            
            <div className="flex items-center gap-2 skeuo-inner p-1.5 rounded-full">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  aria-label={`Go to ${item.label}`}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    view === item.id 
                      ? 'island-gradient text-white scale-105' 
                      : 'text-island-deep/60 hover:text-island-teal'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                aria-label={`Switch language to ${lang === 'id' ? 'English' : 'Indonesian'}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-island-sand text-island-deep text-xs font-bold uppercase tracking-wider hover:bg-island-teal/10 transition-colors skeuo-outer"
              >
                <Globe size={14} />
                {lang === 'id' ? 'ID' : 'EN'}
              </button>
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="w-10 h-10 rounded-full skeuo-outer flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  aria-label="Login"
                  className="w-10 h-10 rounded-full skeuo-outer flex items-center justify-center text-island-teal hover:bg-island-teal/5 transition-colors"
                >
                  <LogIn size={18} />
                </button>
              )}

              <button 
                aria-label="Contact us"
                className="pill-button island-gradient text-white text-sm shadow-xl hover:shadow-island-teal/20 hover:-translate-y-0.5 transition-all"
              >
                {t.nav.contact}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden px-4 pb-6 pointer-events-none">
        <div className="max-w-md mx-auto glass-card rounded-[2.5rem] p-2 flex items-center justify-between border-white/60 pointer-events-auto skeuo-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              aria-label={`Go to ${item.label}`}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-[2rem] transition-all duration-300 ${
                view === item.id 
                  ? 'island-gradient text-white scale-105' 
                  : 'text-island-deep/40'
              }`}
            >
              <item.icon size={view === item.id ? 22 : 20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] md:hidden px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setView('home')}>
            <div className="w-10 h-10 island-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
              <Compass size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-island-deep">Gili<span className="text-island-teal">Hub</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              aria-label={`Switch language to ${lang === 'id' ? 'English' : 'Indonesian'}`}
              className="w-12 h-12 rounded-2xl skeuo-outer flex items-center justify-center text-island-deep"
            >
              <Globe size={20} />
            </button>
            
            {user ? (
              <button 
                onClick={handleLogout}
                aria-label="Logout"
                className="w-12 h-12 rounded-2xl skeuo-outer flex items-center justify-center text-rose-500"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                aria-label="Login"
                className="w-12 h-12 rounded-2xl skeuo-outer flex items-center justify-center text-island-teal"
              >
                <LogIn size={20} />
              </button>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="w-12 h-12 rounded-2xl skeuo-outer flex items-center justify-center text-island-deep"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
