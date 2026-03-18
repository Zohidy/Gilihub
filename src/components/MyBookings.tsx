import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Tag, User, Phone, Calendar, MapPin, Users, XCircle, RefreshCw, LogIn } from 'lucide-react';
import { db, collection, query, where, onSnapshot, orderBy, doc, updateDoc, Timestamp, auth, googleProvider, linkWithPopup } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { ConfirmationModal } from './ConfirmationModal';

interface Booking {
  id: string;
  itemName: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  date: string;
  guests: string;
  duration: string;
  durationType: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Timestamp;
  userId: string;
}

export const MyBookings: React.FC<{ userId: string | null }> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      
      setBookings(bookingData);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const cancelBooking = async (id: string) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: 'cancelled' });
      setCancelTarget(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleUpgrade = async () => {
    try {
      if (auth.currentUser) {
        await linkWithPopup(auth.currentUser, googleProvider);
        setUser(auth.currentUser);
        alert('Account linked successfully!');
      }
    } catch (error: any) {
      console.error("Error linking account:", error);
      if (error.code === 'auth/admin-restricted-operation') {
        alert('This operation is restricted. Please contact the administrator.');
      } else {
        alert('Failed to link account: ' + error.message);
      }
    }
  };

  if (!userId) {
    return (
      <section className="py-20 px-4 min-h-screen bg-island-sand flex items-center justify-center">
        <div className="max-w-md w-full skeuo-outer rounded-3xl p-10 text-center">
          <h2 className="text-xl text-island-deep mb-2">Please wait...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 min-h-screen bg-island-sand">
      <ConfirmationModal
        isOpen={!!cancelTarget}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        onConfirm={() => cancelTarget && cancelBooking(cancelTarget)}
        onCancel={() => setCancelTarget(null)}
      />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-6">
          <h2 className="text-3xl md:text-5xl text-island-deep tracking-tight">My Bookings</h2>
          {user?.isAnonymous && (
            <button 
              onClick={handleUpgrade}
              className="pill-button island-gradient text-white flex items-center justify-center gap-2 text-xs w-full sm:w-auto"
            >
              <LogIn size={16} />
              Save Account
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw size={40} className="text-island-teal animate-spin" />
            <p className="text-island-deep/40 font-bold uppercase tracking-widest text-[10px]">Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="skeuo-outer rounded-3xl p-10 text-center">
            <h3 className="text-xl text-island-deep mb-2">No bookings found</h3>
            <p className="text-island-deep/40 text-sm">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  className="skeuo-outer rounded-2xl p-6 md:p-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className={`px-3 py-1 rounded-full skeuo-inner text-[9px] font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'text-emerald-500' : booking.status === 'cancelled' ? 'text-rose-500' : 'text-amber-500'}`}>
                      {booking.status}
                    </div>
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => setCancelTarget(booking.id)}
                        className="pill-button bg-white text-rose-500 flex items-center justify-center gap-1.5 text-[10px] border border-rose-100 px-3 py-1"
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-xl text-island-deep mb-5 flex items-center gap-2">
                    <Tag size={18} className="text-island-teal" />
                    {booking.itemName}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-island-teal" />
                      <span className="text-xs font-bold text-island-deep">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-island-teal" />
                      <span className="text-xs font-bold text-island-deep">{booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-island-teal" />
                      <span className="text-xs font-bold text-island-deep">{booking.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-island-teal" />
                      <span className="text-xs font-bold text-island-deep">{booking.duration} {booking.durationType}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
