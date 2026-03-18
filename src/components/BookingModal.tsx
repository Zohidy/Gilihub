import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, MapPin, Calendar, Users, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../constants';
import { BookingFormType, FormErrorsType, TranslationType } from '../types';

interface BookingModalProps {
  selectedItem: ServiceItem | null;
  setSelectedItem: (item: ServiceItem | null) => void;
  bookingStep: 'details' | 'form';
  setBookingStep: (step: 'details' | 'form') => void;
  bookingForm: BookingFormType;
  setBookingForm: (form: BookingFormType) => void;
  formErrors: FormErrorsType;
  setFormErrors: (errors: FormErrorsType) => void;
  isSubmitting: boolean;
  bookingSuccess: boolean;
  handleBookingConfirm: () => void;
  isMobile: boolean;
  getIcon: (iconName: string, size?: number) => React.ReactNode;
  lang: 'id' | 'en';
  t: TranslationType;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  selectedItem,
  setSelectedItem,
  bookingStep,
  setBookingStep,
  bookingForm,
  setBookingForm,
  formErrors,
  setFormErrors,
  isSubmitting,
  bookingSuccess,
  handleBookingConfirm,
  isMobile,
  getIcon,
  lang,
  t
}) => {
  if (!selectedItem) return null;

  const calculatePrice = () => {
    if (!selectedItem) return 0;
    let price = selectedItem.basePrice;
    
    const duration = parseInt(bookingForm.duration) || 1;
    const guests = parseInt(bookingForm.guests) || 1;
    
    // Duration multiplier
    if (selectedItem.pricingRules?.durationMultiplier && bookingForm.durationType) {
      const multiplier = selectedItem.pricingRules.durationMultiplier[bookingForm.durationType] || 1;
      price *= multiplier * duration * guests;
    } else {
      price *= duration * guests;
    }
    
    // Demand multiplier
    if (selectedItem.pricingRules?.demandMultiplier) {
      price *= selectedItem.pricingRules.demandMultiplier;
    }
    
    return price;
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(calculatePrice());

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-[150] flex ${isMobile ? 'items-end' : 'items-center'} justify-center p-0 md:p-6`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSubmitting && setSelectedItem(null)}
          className="absolute inset-0 bg-island-deep/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 20 }}
          animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`relative w-full bg-island-sand overflow-hidden shadow-2xl flex flex-col ${isMobile ? 'mobile-bottom-sheet' : 'max-w-2xl rounded-[3rem] max-h-[90vh]'}`}
        >
          {isMobile && (
            <div className="w-16 h-1.5 bg-island-deep/10 rounded-full mx-auto mt-6 mb-2" />
          )}
          
          <button 
            onClick={() => !isSubmitting && setSelectedItem(null)}
            aria-label="Close booking modal"
            className={`absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-island-deep shadow-lg hover:bg-white transition-colors ${isMobile ? 'hidden' : ''}`}
          >
            <X size={24} />
          </button>

          <div className="overflow-y-auto no-scrollbar">
            <div className={`relative transition-all duration-500 ${bookingStep === 'form' ? 'h-32 sm:h-48' : 'h-64 sm:h-80'}`}>
              <img 
                src={`https://picsum.photos/seed/${selectedItem.id}/1200/800`} 
                alt={selectedItem.title[lang]} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-island-sand via-island-sand/50 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                {bookingStep === 'details' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-island-teal text-white text-[10px] font-bold uppercase tracking-wider mb-4 shadow-lg">
                    {selectedItem.category}
                  </div>
                )}
                <h2 id="modal-title" className={`${bookingStep === 'form' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} text-island-deep transition-all duration-500`}>{selectedItem.title[lang]}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-12 pt-0">
              <AnimatePresence mode="wait">
                {bookingStep === 'details' ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <p className="text-island-deep/60 leading-relaxed mb-10 text-lg">
                      {selectedItem.description[lang]}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-12">
                      <div className="skeuo-outer p-6 rounded-3xl">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-island-deep/30 mb-2">Harga Sewa</span>
                        <span className="text-xl font-bold text-island-teal">{formattedPrice}</span>
                      </div>
                      <div className="skeuo-outer p-6 rounded-3xl">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-island-deep/30 mb-2">Rating</span>
                        <div className="flex items-center gap-2">
                          {getIcon('Star', 20)}
                          <span className="text-xl font-bold text-island-deep">4.9/5.0</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setBookingStep('form')}
                      className="w-full pill-button island-gradient text-white shadow-xl shadow-island-teal/20 flex items-center justify-center gap-3 text-lg"
                      aria-label="Proceed to booking form"
                    >
                      {t.booking.book}
                      {getIcon('ArrowRight', 20)}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="space-y-6 mb-10">
                      
                      {/* Card 1: Contact Information */}
                      <div className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-island-deep/5 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-island-deep flex items-center gap-2 mb-2">
                          <User size={18} className="text-island-teal" />
                          Contact Information
                        </h3>
                        
                        <div>
                          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">{t.booking.name}</label>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-island-deep/30 group-focus-within:text-island-teal transition-colors">
                              <User size={18} />
                            </div>
                            <input 
                              id="name"
                              type="text" 
                              value={bookingForm.name}
                              onChange={(e) => {
                                setBookingForm({...bookingForm, name: e.target.value});
                                if (formErrors.name) setFormErrors({...formErrors, name: undefined});
                              }}
                              className={`w-full bg-white border border-island-deep/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-island-teal focus:border-transparent transition-all skeuo-inner group-hover:border-island-teal/30 ${formErrors.name ? 'ring-2 ring-island-coral bg-island-coral/5 border-island-coral/20' : ''}`}
                              placeholder="John Doe"
                              aria-required="true"
                              aria-invalid={!!formErrors.name}
                            />
                          </div>
                          {formErrors.name && <p className="text-island-coral text-[10px] font-bold mt-2 uppercase tracking-wider ml-1">{formErrors.name}</p>}
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">{t.booking.phone}</label>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-island-deep/30 group-focus-within:text-island-teal transition-colors">
                              <Phone size={18} />
                            </div>
                            <input 
                              id="phone"
                              type="tel" 
                              value={bookingForm.phone}
                              onChange={(e) => {
                                setBookingForm({...bookingForm, phone: e.target.value});
                                if (formErrors.phone) setFormErrors({...formErrors, phone: undefined});
                              }}
                              className={`w-full bg-white border border-island-deep/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-island-teal focus:border-transparent transition-all skeuo-inner group-hover:border-island-teal/30 ${formErrors.phone ? 'ring-2 ring-island-coral bg-island-coral/5 border-island-coral/20' : ''}`}
                              placeholder="0812..."
                              aria-required="true"
                              aria-invalid={!!formErrors.phone}
                            />
                          </div>
                          {formErrors.phone && <p className="text-island-coral text-[10px] font-bold mt-2 uppercase tracking-wider ml-1">{formErrors.phone}</p>}
                        </div>
                      </div>

                      {/* Card 2: Booking Details */}
                      <div className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-island-deep/5 shadow-sm space-y-6">
                        <h3 className="text-sm font-bold text-island-deep flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-island-teal" />
                          Booking Details
                        </h3>

                        <div>
                          <label htmlFor="pickup" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">{t.booking.pickup}</label>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-island-deep/30 group-focus-within:text-island-teal transition-colors">
                              <MapPin size={18} />
                            </div>
                            <input 
                              id="pickup"
                              type="text" 
                              value={bookingForm.pickupLocation}
                              onChange={(e) => {
                                setBookingForm({...bookingForm, pickupLocation: e.target.value});
                                if (formErrors.pickupLocation) setFormErrors({...formErrors, pickupLocation: undefined});
                              }}
                              className={`w-full bg-white border border-island-deep/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-island-teal focus:border-transparent transition-all skeuo-inner group-hover:border-island-teal/30 ${formErrors.pickupLocation ? 'ring-2 ring-island-coral bg-island-coral/5 border-island-coral/20' : ''}`}
                              placeholder={t.booking.pickupPlaceholder}
                              aria-required="true"
                              aria-invalid={!!formErrors.pickupLocation}
                            />
                          </div>
                          {formErrors.pickupLocation && <p className="text-island-coral text-[10px] font-bold mt-2 uppercase tracking-wider ml-1">{formErrors.pickupLocation}</p>}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="date" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">{t.booking.date}</label>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-island-deep/30 group-focus-within:text-island-teal transition-colors">
                                <Calendar size={18} />
                              </div>
                              <input 
                                id="date"
                                type="date" 
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingForm.date}
                                onChange={(e) => {
                                  setBookingForm({...bookingForm, date: e.target.value});
                                  if (formErrors.date) setFormErrors({...formErrors, date: undefined});
                                }}
                                className={`w-full bg-white border border-island-deep/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-island-teal focus:border-transparent transition-all skeuo-inner group-hover:border-island-teal/30 ${formErrors.date ? 'ring-2 ring-island-coral bg-island-coral/5 border-island-coral/20' : ''}`}
                                aria-required="true"
                                aria-invalid={!!formErrors.date}
                              />
                            </div>
                            {formErrors.date && <p className="text-island-coral text-[10px] font-bold mt-2 uppercase tracking-wider ml-1">{formErrors.date}</p>}
                          </div>
                          <div>
                            <label htmlFor="guests" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">{t.booking.guests}</label>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-island-deep/30 group-focus-within:text-island-teal transition-colors">
                                <Users size={18} />
                              </div>
                              <select 
                                id="guests"
                                value={bookingForm.guests}
                                onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                                className="w-full bg-white border border-island-deep/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-island-teal focus:border-transparent transition-all skeuo-inner group-hover:border-island-teal/30 appearance-none"
                              >
                                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n.toString()}>{n} {lang === 'id' ? 'Orang' : 'People'}</option>)}
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-island-deep/30">
                                <ChevronDown size={18} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="duration" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">{t.booking.duration}</label>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-island-deep/30 group-focus-within:text-island-teal transition-colors">
                                <Clock size={18} />
                              </div>
                              <select 
                                id="duration"
                                value={bookingForm.duration}
                                onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
                                className="w-full bg-white border border-island-deep/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-island-teal focus:border-transparent transition-all skeuo-inner group-hover:border-island-teal/30 appearance-none"
                              >
                                {(bookingForm.durationType === 'days' ? [1,2,3,4,5,6,7] : [1,2,3,4,5,6,7,8,9,10,11,12]).map(n => <option key={n} value={n.toString()}>{n}</option>)}
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-island-deep/30">
                                <ChevronDown size={18} />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-island-teal mb-3 ml-1">&nbsp;</label>
                            <div className="flex bg-island-sand/30 p-1 rounded-2xl" role="radiogroup" aria-label="Duration type">
                              <button 
                                onClick={() => {
                                  const newDuration = Math.min(parseInt(bookingForm.duration) || 1, 7);
                                  setBookingForm({...bookingForm, durationType: 'days', duration: newDuration.toString()});
                                }}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${bookingForm.durationType === 'days' ? 'bg-white shadow-sm text-island-teal' : 'text-island-deep/40'}`}
                                role="radio"
                                aria-checked={bookingForm.durationType === 'days'}
                              >
                                {t.booking.days}
                              </button>
                              <button 
                                onClick={() => {
                                  const newDuration = Math.min(parseInt(bookingForm.duration) || 1, 12);
                                  setBookingForm({...bookingForm, durationType: 'hours', duration: newDuration.toString()});
                                }}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${bookingForm.durationType === 'hours' ? 'bg-white shadow-sm text-island-teal' : 'text-island-deep/40'}`}
                                role="radio"
                                aria-checked={bookingForm.durationType === 'hours'}
                              >
                                {t.booking.hours}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Price Card */}
                      <div className="bg-island-teal/10 border border-island-teal/20 p-6 rounded-3xl flex justify-between items-center">
                        <span className="text-sm font-bold text-island-deep/80 uppercase tracking-widest">Total Price</span>
                        <span className="text-2xl font-bold text-island-teal">{formattedPrice}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setBookingStep('details');
                          setFormErrors({});
                        }}
                        disabled={isSubmitting}
                        className="flex-1 pill-button bg-island-sand text-island-deep disabled:opacity-50"
                        aria-label="Back to details"
                      >
                        {t.booking.back}
                      </button>
                      <button 
                        onClick={handleBookingConfirm}
                        disabled={isSubmitting}
                        className="flex-[2] pill-button island-gradient text-white shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
                        aria-label="Confirm booking"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {bookingSuccess ? <CheckCircle2 size={18} /> : 'Mengirim...'}
                          </>
                        ) : (
                          t.booking.confirm
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
