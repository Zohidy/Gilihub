/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, 
  Waves, 
  Compass, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Star, 
  MessageSquare,
  X,
  Menu,
  Phone,
  ChevronDown,
  HelpCircle,
  Home,
  Search,
  User,
  Camera,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Globe,
  Users
} from 'lucide-react';
import { SERVICES, ServiceItem, FAQS, TRANSLATIONS, formatPrice } from './constants';
import { getTourRecommendation } from './services/geminiService';
import { db, collection, addDoc, serverTimestamp, auth, signInAnonymously, onAuthStateChanged } from './firebase';
import { getDocFromServer, doc } from 'firebase/firestore';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { Explore } from './components/Explore';
import { AIGuide } from './components/AIGuide';
import { FAQ } from './components/FAQ';
import { About } from './components/About';
import { MyBookings } from './components/MyBookings';
import { Admin } from './components/Admin';
import { BookingModal } from './components/BookingModal';
import { ViewType, CategoryType, BookingFormType, FormErrorsType } from './types';

export default function App() {
  const [view, setView] = useState<ViewType>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiActivity, setAiActivity] = useState('');
  const [aiBudget, setAiBudget] = useState('');
  const [aiDuration, setAiDuration] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('en');
  const [bookingStep, setBookingStep] = useState<'details' | 'form'>('details');
  const [bookingForm, setBookingForm] = useState<BookingFormType>({ 
    name: '', 
    phone: '',
    date: '', 
    guests: '1', 
    duration: '1', 
    durationType: 'days',
    pickupLocation: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch((error: any) => {
          console.error("Anonymous login error:", error);
          if (error.code === 'auth/admin-restricted-operation') {
            alert('Anonymous login is restricted. Please contact the administrator.');
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBookingConfirm = async () => {
    const errors: { name?: string; date?: string; phone?: string; pickupLocation?: string } = {};
    if (!bookingForm.name.trim()) errors.name = t.booking.errorRequired;
    
    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!bookingForm.phone.trim()) {
      errors.phone = t.booking.errorRequired;
    } else if (!phoneRegex.test(bookingForm.phone.trim())) {
      errors.phone = lang === 'id' ? 'Format nomor telepon tidak valid' : 'Invalid phone number format';
    }

    if (!bookingForm.date) errors.date = t.booking.errorRequired;
    if (!bookingForm.pickupLocation.trim()) errors.pickupLocation = t.booking.errorRequired;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, 'bookings'), {
        itemId: selectedItem?.id,
        itemName: selectedItem?.title[lang],
        customerName: bookingForm.name.trim(),
        customerPhone: bookingForm.phone.trim(),
        pickupLocation: bookingForm.pickupLocation.trim(),
        date: bookingForm.date,
        guests: parseInt(bookingForm.guests) || 1,
        duration: parseInt(bookingForm.duration) || 1,
        durationType: bookingForm.durationType,
        userId: userId,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setBookingSuccess(true);
      
      // Still provide WhatsApp option as a fallback/direct contact
      const message = encodeURIComponent(
        `*Halo GiliHub! Saya baru saja membuat booking di website:*\n\n` +
        `*Item:* ${selectedItem?.title[lang]}\n` +
        `*Nama:* ${bookingForm.name}\n` +
        `*WhatsApp:* ${bookingForm.phone}\n` +
        `*Lokasi Pengambilan:* ${bookingForm.pickupLocation}\n` +
        `*Tanggal:* ${bookingForm.date}\n` +
        `*Jumlah Orang:* ${bookingForm.guests}\n` +
        `*Durasi:* ${bookingForm.duration} ${bookingForm.durationType === 'days' ? t.booking.days : t.booking.hours}\n\n` +
        `Data sudah tersimpan di sistem. Mohon konfirmasinya. Terima kasih!`
      );

      // We open WhatsApp in a new tab but the data is already safe in Firebase
      window.open(`https://wa.me/6285293514808?text=${message}`, '_blank');
      
      setTimeout(() => {
        setSelectedItem(null);
        setBookingForm({ 
          name: '', 
          phone: '',
          date: '', 
          guests: '1', 
          duration: '1', 
          durationType: 'days',
          pickupLocation: ''
        });
        setFormErrors({});
        setBookingStep('details');
        setBookingSuccess(false);
        setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      console.error("Error saving booking:", error);
      setIsSubmitting(false);
      // Fallback to WhatsApp only if Firebase fails
      const message = encodeURIComponent(
        `*Halo GiliHub! Saya ingin melakukan booking:*\n\n` +
        `*Item:* ${selectedItem?.title[lang]}\n` +
        `*Nama:* ${bookingForm.name}\n` +
        `*WhatsApp:* ${bookingForm.phone}\n` +
        `*Lokasi Pengambilan:* ${bookingForm.pickupLocation}\n` +
        `*Tanggal:* ${bookingForm.date}\n` +
        `*Jumlah Orang:* ${bookingForm.guests}\n` +
        `*Durasi:* ${bookingForm.duration} ${bookingForm.durationType === 'days' ? t.booking.days : t.booking.hours}\n\n` +
        `Mohon konfirmasi ketersediaannya. Terima kasih!`
      );
      window.open(`https://wa.me/6285293514808?text=${message}`, '_blank');
    }
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredServices = activeCategory === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const rec = await getTourRecommendation(aiInput, aiActivity, aiBudget, aiDuration);
    setAiRecommendation(rec);
    setIsAiLoading(false);
  };

  const getIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case 'bike': return <Bike size={size} />;
      case 'waves': return <Waves size={size} />;
      case 'compass': return <Compass size={size} />;
      case 'camera': return <Camera size={size} />;
      default: return <MapPin size={size} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        view={view} 
        setView={setView} 
        lang={lang} 
        setLang={setLang} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        t={t} 
      />
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        view={view}
        setView={setView}
        t={t}
        user={auth.currentUser}
      />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/6285293514808" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-32 right-6 z-[90] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform md:bottom-10 md:right-10"
      >
        <Phone size={24} fill="currentColor" />
      </a>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-32 md:pb-0">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Hero setView={setView} t={t} />
              
              {/* Featured Services */}
              <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <span className="text-island-teal font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Pilihan Terbaik</span>
                    <h2 className="text-4xl md:text-6xl tracking-tight">Layanan Populer</h2>
                  </div>
                  <button onClick={() => setView('explore')} className="hidden md:flex items-center gap-2 text-island-teal font-bold group">
                    Lihat Semua <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {SERVICES.slice(0, 3).map(service => (
                    <div 
                      key={service.id}
                      onClick={() => {
                        setSelectedItem(service);
                        setBookingStep('details');
                      }}
                      className="group skeuo-outer rounded-[3rem] p-8 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 skeuo-inner rounded-2xl flex items-center justify-center text-island-teal mb-8 group-hover:scale-110 transition-transform">
                        {getIcon(service.icon, 28)}
                      </div>
                      <h3 className="text-2xl mb-3">{service.title[lang]}</h3>
                      <p className="text-island-deep/60 text-sm mb-6 line-clamp-2">{service.description[lang]}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-island-deep/5">
                        <span className="text-island-teal font-bold">{formatPrice(service.basePrice)}</span>
                        <div className="w-10 h-10 skeuo-inner rounded-full flex items-center justify-center text-island-teal opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Explore 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                filteredServices={filteredServices} 
                setSelectedItem={setSelectedItem} 
                setBookingStep={setBookingStep} 
                getIcon={getIcon} 
                lang={lang} 
                t={t} 
              />
            </motion.div>
          )}

          {view === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AIGuide 
                aiInput={aiInput} 
                setAiInput={setAiInput} 
                aiActivity={aiActivity}
                setAiActivity={setAiActivity}
                aiBudget={aiBudget}
                setAiBudget={setAiBudget}
                aiDuration={aiDuration}
                setAiDuration={setAiDuration}
                aiRecommendation={aiRecommendation} 
                setAiRecommendation={setAiRecommendation} 
                isAiLoading={isAiLoading} 
                handleAiAsk={() => handleAiAsk({ preventDefault: () => {} } as any)} 
                t={t} 
              />
            </motion.div>
          )}

          {view === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FAQ 
                faqs={FAQS}
                openFaqIndex={openFaqIndex} 
                setOpenFaqIndex={setOpenFaqIndex} 
                lang={lang} 
                t={t} 
              />
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <About t={t} />
            </motion.div>
          )}

          {view === 'my-bookings' && (
            <motion.div
              key="my-bookings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <MyBookings userId={userId} />
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Admin />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Booking Modal / Bottom Sheet */}
      <BookingModal 
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
        bookingStep={bookingStep} 
        setBookingStep={setBookingStep} 
        bookingForm={bookingForm} 
        setBookingForm={setBookingForm} 
        formErrors={formErrors} 
        setFormErrors={setFormErrors}
        isSubmitting={isSubmitting} 
        bookingSuccess={bookingSuccess} 
        handleBookingConfirm={handleBookingConfirm} 
        isMobile={isMobile} 
        getIcon={getIcon} 
        lang={lang} 
        t={t} 
      />
    </div>
  );
}
