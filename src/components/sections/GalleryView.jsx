import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Heart, ArrowUp, Hash, Utensils, Sparkles } from "lucide-react"; // Tambah Icon Utensils & Sparkles
import DustParticles from "../ui/DustParticles";

// --- MOCK DATA (Silakan ganti path gambarnya nanti) ---

const FAVORITES = [
  "/images/2025/2025-11.jpg",
  "/images/2025/2025-16.jpg",
  "/images/2025/2025-17.jpg",
  "/images/2025/2025-5-Landscape.jpg",
];

const FOOD_DATA = [
  "/images/foodies/food-1.jpg", // Ganti dengan foto makanan
  "/images/foodies/food-2.jpg",
  "/images/foodies/food-3.jpg",
  "/images/foodies/food-4.jpg",
];

const RANDOM_DATA = [
  "/images/2023/2023-1.jpg", // Ganti dengan foto random/meme/lucu
  "/images/2023/2023-2.jpg",
  "/images/2023/2023-3.jpg",
  "/images/2023/2023-4.jpg",
];

const GALLERY_DATA = {
  2023: [
    "/images/2023/2023-1.jpg",
    "/images/2023/2023-2.jpg",
    "/images/2023/2023-3.jpg",
    "/images/2023/2023-4.jpg",
    "/images/2023/2023-5.jpg",
    "/images/2023/2023-6.jpg",
    "/images/2023/2023-7.jpg",
    "/images/2023/2023-8.jpg",
    "/images/2023/2023-9-Landscape.jpg",
    "/images/2023/2023-10.jpg",
    "/images/2023/2023-11.png",
    "/images/2023/2023-12.jpg",
  ],
  2024: [
    "/images/2024/2024-1.jpg",
    "/images/2024/2024-2.jpg",
    "/images/2024/2024-3.jpg",
    "/images/2024/2024-4.jpg",
    "/images/2024/2024-5.jpg",
    "/images/2024/2024-6.jpg",
    "/images/2024/2024-7.jpg",
    "/images/2024/2024-8.jpg",
    "/images/2024/2024-9.jpg",
    "/images/2024/2024-10.jpg",
    "/images/2024/2024-11.jpg",
  ],
  2025: [
    "/images/2025/2025-1-Landscape.jpg",
    "/images/2025/2025-2-Landscape.jpg",
    "/images/2025/2025-3-Landscape.jpg",
    "/images/2025/2025-4-Landscape.jpeg",
    "/images/2025/2025-5-Landscape.jpg",
    "/images/2025/2025-6-Landscape.jpg",
    "/images/2025/2025-12-Landscape.jpg",
    "/images/2025/2025-7.jpg",
    "/images/2025/2025-8.jpg",
    "/images/2025/2025-9.jpeg",
    "/images/2025/2025-10.jpg",
    "/images/2025/2025-11.jpg",
    "/images/2025/2025-13.jpg",
    "/images/2025/2025-14.jpg",
    "/images/2025/2025-15.jpg",
    "/images/2025/2025-16.jpg",
    "/images/2025/2025-17.jpg",
    "/images/2025/2025-18.jpg",
    "/images/2025/2025-19.jpg",
    "/images/2025/2025-20.jpg",
    "/images/2025/2025-21.jpg",
  ]
};

// --- KOMPONEN NAVIGASI CEPAT (UPDATED) ---
const QuickNav = ({ activeSection, onJump }) => {
  const sections = [
    { id: 'fav', label: 'Favorites', icon: <Heart size={14} /> },
    { id: '2023', label: '2023', icon: <Hash size={14} /> },
    { id: '2024', label: '2024', icon: <Hash size={14} /> },
    { id: '2025', label: '2025', icon: <Hash size={14} /> },
    { id: 'food', label: 'Food', icon: <Utensils size={14} /> }, // NEW
    { id: 'random', label: 'Random', icon: <Sparkles size={14} /> }, // NEW
  ];

  return (
    <div className="fixed top-20 left-0 w-full z-40 flex justify-center pointer-events-none">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-full p-1.5 flex gap-1 pointer-events-auto overflow-x-auto max-w-[95%] md:max-w-none no-scrollbar">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onJump(sec.id)}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeSection === sec.id 
                ? 'bg-gray-900 text-white shadow-md scale-105' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {sec.icon} {sec.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- KOMPONEN PHOTO CARD ---
const PhotoCard = ({ src, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
      className="relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10 pointer-events-none" />
      
      <img 
        src={src} 
        alt="Gallery" 
        className="w-full h-full object-cover aspect-[3/4] md:aspect-square transform transition-transform duration-700 group-hover:scale-110" 
        loading="lazy"
      />
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const GalleryView = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('fav');

  // Scroll to section handler
  const jumpToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const offset = 140; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Tambahkan 'food' dan 'random' ke list deteksi
      const sections = ['fav', '2023', '2024', '2025', 'food', 'random'];
      
      for (const sec of sections) {
        const el = document.getElementById(`section-${sec}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Logika sederhana: Jika bagian atas elemen berada di dekat viewport atas
          if (rect.top >= 0 && rect.top <= 400) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5F7FA] text-gray-800 font-sans selection:bg-pink-200">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DustParticles />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-20 w-[500px] h-[500px] bg-yellow-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* --- HEADER --- */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between">
         <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors group flex items-center gap-2"
         >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="text-sm font-bold uppercase tracking-wider hidden md:inline">Back</span>
         </button>
         <h2 className="text-lg font-bold tracking-[0.2em] uppercase text-gray-900">
            Our Gallery
         </h2>
         <div className="w-8" />
      </div>

      {/* --- QUICK NAVIGATION --- */}
      <QuickNav activeSection={activeSection} onJump={jumpToSection} />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-24 md:space-y-32">
        
        {/* 1. FAVORITE SECTION */}
        <section id="section-fav" className="scroll-mt-40">
            <div className="text-center mb-12">
                <motion.div 
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full mb-4 shadow-sm"
                >
                    <Star fill="currentColor" size={24} />
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">My Favorite Picture of You </h3>
                <p className="text-gray-500 font-serif italic">"Bagian Dari kamu yang aku suka."</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {FAVORITES.map((src, i) => (
                    <motion.div 
                        key={i}
                        className={`${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
                    >
                         <PhotoCard src={src} index={i} />
                    </motion.div>
                ))}
            </div>
        </section>

        {/* 2. YEARLY SECTIONS */}
        {[2023, 2024, 2025].map((year) => (
            <section key={year} id={`section-${year}`} className="scroll-mt-40 relative">
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-6xl md:text-8xl font-black text-gray-200 select-none absolute -left-4 md:-left-10 -top-10 md:-top-16 -z-10 scale-150 opacity-50">
                        {year}
                    </h3>
                    <div className="relative">
                        <h4 className="text-3xl md:text-4xl font-bold text-gray-900">{year}</h4>
                        <div className="h-1 w-full bg-gray-900 mt-2 rounded-full" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-2">
                        {GALLERY_DATA[year].length} Memories
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {GALLERY_DATA[year].map((src, i) => (
                        <PhotoCard key={i} src={src} index={i} />
                    ))}
                </div>
            </section>
        ))}

        {/* 3. FOOD SECTION (NEW) */}
        <section id="section-food" className="scroll-mt-40">
             <div className="text-center mb-12">
                <motion.div 
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-500 rounded-full mb-4 shadow-sm"
                >
                    <Utensils size={24} />
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">Our Culinary Journey</h3>
                <p className="text-gray-500 font-serif italic">"Makan enak, perut kenyang, hati senang."</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {FOOD_DATA.map((src, i) => (
                    <PhotoCard key={i} src={src} index={i} />
                ))}
            </div>
        </section>

        {/* 4. RANDOM SECTION (NEW) */}
        <section id="section-random" className="scroll-mt-40">
             <div className="text-center mb-12">
                <motion.div 
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-500 rounded-full mb-4 shadow-sm"
                >
                    <Sparkles size={24} />
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">Random Dumps</h3>
                <p className="text-gray-500 font-serif italic">"Hal-hal acak yang tak terlupakan."</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {RANDOM_DATA.map((src, i) => (
                    // Random Grid Layout biar terlihat 'Random'
                    <motion.div 
                        key={i}
                        className={`${i % 3 === 0 ? 'md:col-span-2' : ''}`}
                    >
                         <PhotoCard src={src} index={i} />
                    </motion.div>
                ))}
            </div>
        </section>

      </div>

      {/* --- FOOTER / SCROLL TOP --- */}
      <div className="fixed bottom-8 right-8 z-40">
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-4 bg-gray-900 text-white rounded-full shadow-xl hover:bg-gray-800 transition-colors"
        >
            <ArrowUp size={20} />
        </motion.button>
      </div>

    </div>
  );
};

export default GalleryView;