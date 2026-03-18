import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Tag, User, Phone, Calendar, MapPin, Users, XCircle, RefreshCw, LogIn, Lock, Search, CheckCircle, Trash2 } from 'lucide-react';
import { db, collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc, auth, googleProvider, signInWithPopup } from '../firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
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
  adminNotes?: string;
}

export const Admin: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      if (isAuthReady) setLoading(false);
      return;
    }

    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    
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
  }, [isAuthReady, user]);

  const updateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, 'update', 'bookings/' + id);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await deleteDoc(bookingRef);
      setDeleteTarget(null);
    } catch (error) {
      handleFirestoreError(error, 'delete', 'bookings/' + id);
    }
  };

  const updateNote = async (id: string, note: string) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { adminNotes: note });
    } catch (error) {
      handleFirestoreError(error, 'update', 'bookings/' + id);
    }
  };

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    alert('Error: ' + (error instanceof Error ? error.message : String(error)));
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-500';
      case 'cancelled': return 'text-rose-500';
      default: return 'text-amber-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={18} />;
      case 'cancelled': return <XCircle size={18} />;
      default: return <Clock size={18} />;
    }
  };

  if (isAuthReady && (!user || user.email !== 'zohidydy@gmail.com')) {
    return (
      <section className="py-32 px-6 min-h-screen bg-island-sand flex items-center justify-center">
        <div className="max-w-md w-full skeuo-outer rounded-[3rem] p-12 text-center">
          <div className="w-20 h-20 skeuo-inner rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl text-island-deep mb-4">Access Restricted</h2>
          <p className="text-island-deep/60 mb-8">
            You must be logged in as an administrator to view this page.
          </p>
          {!user && (
            <button 
              onClick={() => signInWithPopup(auth, googleProvider)}
              className="pill-button island-gradient text-white w-full flex items-center justify-center gap-3"
            >
              <LogIn size={20} />
              Login with Google
            </button>
          )}
          {user && user.email !== 'zohidydy@gmail.com' && (
            <div className="p-4 skeuo-inner rounded-2xl text-xs text-rose-500 font-bold uppercase tracking-widest">
              Logged in as: {user.email}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 min-h-screen bg-island-sand">
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        onConfirm={() => deleteTarget && deleteBooking(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-8 mb-10">
          <div>
            <span className="text-island-teal font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Admin Panel</span>
            <h2 className="text-3xl md:text-5xl text-island-deep tracking-tight">Booking Management</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-island-deep' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-500' },
              { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-500' },
              { label: 'Cancelled', value: stats.cancelled, color: 'text-rose-500' },
            ].map(stat => (
              <div key={stat.label} className="skeuo-outer rounded-xl p-3 text-center">
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-island-deep/40">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="skeuo-inner rounded-xl px-4 py-2 flex items-center gap-3 flex-grow">
              <Search size={16} className="text-island-deep/30" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-xs font-medium text-island-deep w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex skeuo-inner p-1 rounded-xl overflow-x-auto">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filter === f 
                      ? 'island-gradient text-white shadow-lg' 
                      : 'text-island-deep/40 hover:text-island-teal'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw size={40} className="text-island-teal animate-spin" />
            <p className="text-island-deep/40 font-bold uppercase tracking-widest text-[10px]">Loading Bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="skeuo-outer rounded-3xl p-10 text-center">
            <div className="w-16 h-16 skeuo-inner rounded-full flex items-center justify-center mx-auto mb-4 text-island-deep/10">
              <Search size={32} />
            </div>
            <h3 className="text-xl text-island-deep mb-2">No bookings found</h3>
            <p className="text-island-deep/40 text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="skeuo-outer rounded-2xl p-6 md:p-8 flex flex-col gap-6"
                >
                  <div className="flex justify-between items-center">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full skeuo-inner text-[9px] font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-island-deep/30">
                      {booking.createdAt?.toDate().toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl text-island-deep flex items-center gap-2">
                    <Tag size={18} className="text-island-teal" />
                    {booking.itemName}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30">Customer</div>
                        <div className="text-xs font-bold text-island-deep">{booking.customerName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
                        <Phone size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30">WhatsApp</div>
                        <div className="text-xs font-bold text-island-deep">{booking.customerPhone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30">Date</div>
                        <div className="text-xs font-bold text-island-deep">{booking.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30">Pickup</div>
                        <div className="text-xs font-bold text-island-deep">{booking.pickupLocation}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
                        <Users size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30">Guests</div>
                        <div className="text-xs font-bold text-island-deep">{booking.guests}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 skeuo-inner rounded-lg flex items-center justify-center text-island-teal">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30">Duration</div>
                        <div className="text-xs font-bold text-island-deep">{booking.duration} {booking.durationType}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-tight text-island-deep/30 mb-2">Admin Notes</div>
                    <textarea
                      className="w-full skeuo-inner rounded-lg p-3 text-xs text-island-deep bg-transparent border-none outline-none"
                      placeholder="Add private notes..."
                      defaultValue={booking.adminNotes}
                      onBlur={(e) => updateNote(booking.id, e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="flex-1 pill-button island-gradient text-white flex items-center justify-center gap-2 text-[10px] py-2"
                        >
                          <CheckCircle size={14} />
                          Confirm
                        </button>
                        <button 
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="flex-1 pill-button bg-white text-rose-500 flex items-center justify-center gap-2 text-[10px] py-2 border border-rose-100"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setDeleteTarget(booking.id)}
                      className="w-10 pill-button bg-white text-rose-500 flex items-center justify-center border border-rose-100"
                      aria-label="Delete booking"
                    >
                      <Trash2 size={14} />
                    </button>
                    {booking.status !== 'pending' && (
                      <div className="skeuo-inner px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest text-island-deep/20 text-center flex-grow flex items-center justify-center">
                        Status Locked
                      </div>
                    )}
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
