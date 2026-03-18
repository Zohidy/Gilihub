export interface ServiceItem {
  id: string;
  title: { id: string; en: string };
  description: { id: string; en: string };
  basePrice: number; // Base price in IDR
  pricingRules?: {
    demandMultiplier?: number;
    seasonMultiplier?: number;
    durationMultiplier?: { [key: string]: number }; // e.g., { 'days': 1, 'hours': 0.2 }
  };
  icon: 'bike' | 'waves' | 'compass' | 'camera' | 'map';
  category: 'bike' | 'snorkeling' | 'tour';
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'b1',
    title: { id: 'Sepeda Premium Gili', en: 'Gili Premium Bike' },
    description: { 
      id: 'Sepeda nyaman dengan keranjang depan dan kunci pengaman, cocok untuk keliling pulau.', 
      en: 'Comfortable bike with front basket and safety lock, perfect for island cruising.' 
    },
    basePrice: 50000,
    pricingRules: { durationMultiplier: { 'days': 1, 'hours': 0.2 } },
    icon: 'bike',
    category: 'bike'
  },
  {
    id: 'b2',
    title: { id: 'Sepeda Listrik (E-Bike)', en: 'Electric Bike (E-Bike)' },
    description: { 
      id: 'Keliling pulau tanpa lelah dengan sepeda listrik modern. Baterai tahan lama.', 
      en: 'Explore the island effortlessly with modern electric bikes. Long-lasting battery.' 
    },
    basePrice: 150000,
    pricingRules: { durationMultiplier: { 'days': 1, 'hours': 0.2 } },
    icon: 'bike',
    category: 'bike'
  },
  {
    id: 's1',
    title: { id: 'Set Snorkeling Lengkap', en: 'Full Snorkeling Set' },
    description: { 
      id: 'Masker, snorkel, dan fin berkualitas tinggi.', 
      en: 'High-quality mask, snorkel, and fins.' 
    },
    basePrice: 35000,
    pricingRules: { durationMultiplier: { 'days': 1, 'hours': 0.2 } },
    icon: 'waves',
    category: 'snorkeling'
  },
  {
    id: 's2',
    title: { id: 'Snorkeling Trip 3 Gili', en: '3 Gili Snorkeling Trip' },
    description: { 
      id: 'Trip snorkeling bersama grup mengunjungi Turtle Point, Statue Meno, dan Garden Fish.', 
      en: 'Group snorkeling trip visiting Turtle Point, Meno Statue, and Garden Fish.' 
    },
    basePrice: 150000,
    pricingRules: { demandMultiplier: 1.2 },
    icon: 'waves',
    category: 'snorkeling'
  },
  {
    id: 't1',
    title: { id: 'Private Glass Bottom Boat', en: 'Private Glass Bottom Boat' },
    description: { 
      id: 'Tour 3 Gili (Trawangan, Meno, Air) dengan kapal lantai kaca.', 
      en: '3 Gili Tour (Trawangan, Meno, Air) with glass bottom boat.' 
    },
    basePrice: 1200000,
    pricingRules: { demandMultiplier: 1.5 },
    icon: 'compass',
    category: 'tour'
  },
  {
    id: 't2',
    title: { id: 'Sunset Horse Riding', en: 'Sunset Horse Riding' },
    description: { 
      id: 'Menikmati matahari terbenam sambil berkuda di pinggir pantai.', 
      en: 'Enjoy the sunset while horseback riding on the beach.' 
    },
    basePrice: 250000,
    pricingRules: { demandMultiplier: 1.3 },
    icon: 'camera',
    category: 'tour'
  }
];

export interface FAQItem {
  question: { id: string; en: string };
  answer: { id: string; en: string };
}

export const FAQS: FAQItem[] = [
  {
    question: { id: "Apakah ada kendaraan bermotor di Gili Trawangan?", en: "Are there motorized vehicles in Gili Trawangan?" },
    answer: { id: "Tidak, Gili Trawangan adalah pulau bebas kendaraan bermotor. Transportasi utama adalah sepeda, jalan kaki, atau menggunakan Cidomo (kereta kuda).", en: "No, Gili Trawangan is a motorized vehicle-free island. Main transportations are bicycles, walking, or using Cidomo (horse carriage)." }
  },
  {
    question: { id: "Bagaimana cara menyewa sepeda?", en: "How to rent a bike?" },
    answer: { id: "Anda bisa memesan langsung melalui aplikasi ini atau mengunjungi gerai kami di Main Street. Kami menyediakan kunci gembok untuk keamanan sepeda Anda.", en: "You can book directly through this app or visit our outlet on Main Street. We provide locks for your bike security." }
  },
  {
    question: { id: "Apakah alat snorkeling dibersihkan secara rutin?", en: "Are snorkeling gears cleaned regularly?" },
    answer: { id: "Ya, semua peralatan snorkeling kami disterilisasi dengan standar kesehatan yang ketat setelah setiap penggunaan untuk menjamin kebersihan dan keamanan Anda.", en: "Yes, all our snorkeling equipment is sterilized with strict health standards after each use to ensure your cleanliness and safety." }
  },
  {
    question: { id: "Kapan waktu terbaik untuk Snorkeling?", en: "When is the best time for Snorkeling?" },
    answer: { id: "Pagi hari sekitar jam 8-10 pagi biasanya adalah waktu terbaik karena air lebih tenang dan visibilitas sangat jernih.", en: "Morning around 8-10 AM is usually the best time as the water is calmer and visibility is very clear." }
  },
  {
    question: { id: "Apakah tour private boat sudah termasuk asuransi?", en: "Does the private boat tour include insurance?" },
    answer: { id: "Ya, semua paket tour kami sudah termasuk asuransi perjalanan dasar dan didampingi oleh pemandu berlisensi.", en: "Yes, all our tour packages include basic travel insurance and are accompanied by licensed guides." }
  },
  {
    question: { id: "Metode pembayaran apa yang diterima?", en: "What payment methods are accepted?" },
    answer: { id: "Kami menerima pembayaran tunai (IDR) dan transfer bank lokal.", en: "We accept cash (IDR) and local bank transfers." }
  },
  {
    question: { id: "Bagaimana kebijakan pembatalan?", en: "What is the cancellation policy?" },
    answer: { id: "Pembatalan dapat dilakukan hingga 24 jam sebelum waktu pemesanan untuk pengembalian dana penuh.", en: "Cancellations can be made up to 24 hours before the booking time for a full refund." }
  },
  {
    question: { id: "Apakah ada ATM di pulau?", en: "Are there ATMs on the island?" },
    answer: { id: "Ya, ada beberapa ATM yang tersedia di area utama dekat pelabuhan.", en: "Yes, there are several ATMs available in the main area near the harbor." }
  }
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

export const TRANSLATIONS = {
  id: {
    nav: { home: 'Beranda', services: 'Layanan', guide: 'AI Guide', faq: 'FAQ', about: 'Tentang', contact: 'Hubungi Kami', admin: 'Admin' },
    hero: { badge: 'Jelajahi Surga', title: 'Pelarian ke', subtitle: 'Trawangan', desc: 'Penyewaan sepeda premium, alat snorkeling, dan paket tour wisata eksklusif di pulau tanpa polusi.', start: 'Mulai Petualangan', ask: 'Tanya AI Guide' },
    about: { badge: 'Warisan Kami', title: 'Menghadirkan Keajaiban Sejak 2015', subtitle: 'Kisah Kami', desc: 'GiliHub lahir dari kecintaan kami pada keindahan alam Gili Trawangan. Kami percaya bahwa cara terbaik menikmati pulau ini adalah dengan melambat—bersepeda menyusuri pantai, menyelami jernihnya air laut, dan menikmati matahari terbenam yang magis.', trust: 'Terpercaya', trustDesc: '5000+ pelanggan puas dengan layanan kami.', support: 'Layanan 24/7', supportDesc: 'Kami siap membantu Anda kapan saja.' },
    services: { badge: 'Penyewaan Premium', title: 'Layanan Eksklusif', desc: 'Pilih perlengkapan terbaik untuk melengkapi liburan mewah Anda di Gili.', all: 'Semua', bike: 'Sepeda', snorkeling: 'Snorkeling', tour: 'Tour' },
    ai: { 
      badge: 'AI Travel Concierge', 
      title: 'Rencanakan Petualanganmu', 
      desc: 'Beri tahu kami preferensi Anda, dan asisten cerdas kami akan merancang pengalaman Gili yang sempurna.', 
      placeholder: "Contoh: 'Saya ingin snorkeling di tempat yang sepi'...", 
      ask: 'Tanya AI', 
      loading: 'Menganalisis...', 
      insight: 'Wawasan Ahli:',
      activity: 'Jenis Aktivitas',
      budget: 'Anggaran',
      duration: 'Durasi'
    },
    faq: { badge: 'Dukungan', title: 'Bantuan & FAQ', desc: 'Segala hal yang perlu Anda ketahui sebelum menjelajahi Gili.' },
    footer: { desc: 'Penyedia layanan wisata premium di Gili Trawangan sejak 2015. Kami berkomitmen menghadirkan kemewahan dalam kesederhanaan alam.', links: 'Tautan Cepat', location: 'Lokasi' },
    booking: { 
      book: 'Pesan Sekarang', 
      wa: 'WhatsApp', 
      name: 'Nama Lengkap', 
      phone: 'Nomor WhatsApp',
      pickup: 'Lokasi Pengambilan',
      pickupPlaceholder: 'Contoh: Hotel Vila Ombak / Pelabuhan',
      date: 'Tanggal', 
      guests: 'Jumlah Orang', 
      duration: 'Durasi Sewa', 
      days: 'Hari', 
      hours: 'Jam', 
      confirm: 'Konfirmasi Pesanan', 
      back: 'Kembali', 
      success: 'Membuka WhatsApp...', 
      errorRequired: 'Kolom ini wajib diisi' 
    }
  },
  en: {
    nav: { home: 'Home', services: 'Services', guide: 'AI Guide', faq: 'FAQ', about: 'About', contact: 'Contact Us', admin: 'Admin' },
    hero: { badge: 'Explore Paradise', title: 'Escape to', subtitle: 'Trawangan', desc: 'Premium bike rentals, snorkeling gear, and exclusive tour packages on a pollution-free island.', start: 'Start Adventure', ask: 'Ask AI Guide' },
    about: { badge: 'Our Legacy', title: 'Bringing Magic Since 2015', subtitle: 'Our Story', desc: 'GiliHub was born from our love for the natural beauty of Gili Trawangan. We believe the best way to enjoy this island is to slow down—cycling along the beach, diving into crystal clear waters, and enjoying magical sunsets.', trust: 'Trusted', trustDesc: '5000+ satisfied customers with our services.', support: '24/7 Service', supportDesc: 'We are ready to help you anytime.' },
    services: { badge: 'Premium Rentals', title: 'Exclusive Services', desc: 'Choose the best equipment to complement your luxury holiday in Gili.', all: 'All', bike: 'Bikes', snorkeling: 'Snorkeling', tour: 'Tours' },
    ai: { 
      badge: 'AI Travel Concierge', 
      title: 'Plan Your Adventure', 
      desc: 'Tell us your preferences, and our smart assistant will design the perfect Gili experience.', 
      placeholder: "Example: 'I want to snorkel in a quiet place'...", 
      ask: 'Ask AI', 
      loading: 'Analyzing...', 
      insight: 'Expert Insight:',
      activity: 'Activity Type',
      budget: 'Budget',
      duration: 'Duration'
    },
    faq: { badge: 'Support', title: 'Help & FAQ', desc: 'Everything you need to know before exploring Gili.' },
    footer: { desc: 'Premium travel service provider in Gili Trawangan since 2015. We are committed to bringing luxury in the simplicity of nature.', links: 'Quick Links', location: 'Location' },
    booking: { 
      book: 'Book Now', 
      wa: 'WhatsApp', 
      name: 'Full Name', 
      phone: 'WhatsApp Number',
      pickup: 'Pickup Location',
      pickupPlaceholder: 'Example: Hotel Vila Ombak / Harbor',
      date: 'Date', 
      guests: 'Number of People', 
      duration: 'Rental Duration', 
      days: 'Days', 
      hours: 'Hours', 
      confirm: 'Confirm Booking', 
      back: 'Back', 
      success: 'Opening WhatsApp...', 
      errorRequired: 'This field is required' 
    }
  }
};
