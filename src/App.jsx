import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Hourglass, Heart, Star, Sparkles, Quote, X } from "lucide-react";

// Components
import DustParticles from "./components/ui/DustParticles";
import Coverflow from "./components/ui/Coverflow";
import GalleryView from "./components/sections/GalleryView";
import ParallaxSection from "./components/sections/ParallaxSection";
import VelocityScroll from "./components/ui/VelocityScroll";
import ScribbleEnding from "./components/sections/ScribbleEnding";
import InteractiveDesk from "./components/sections/InteractiveDesk";
import StoryView from "./components/sections/StoryView"; 
import MusicPlayer from "./components/ui/MusicPlayer"; 
import TimeCapsule from "./components/ui/TimeCapsule";
import InfiniteCards from "./components/ui/InfiniteCards";
import LiveLyrics from "./components/ui/LiveLyrics";
import { cardData } from "./data/cardData";

// --- DATA CERITA (MINI STORY) ---
const miniStories = [
  {
    year: "2023",
    title: "THE BEGINNING",
    subtitle: "Permulaan",
    text1: "Tahun ini adalah awal dari semua cerita kita. Pertemuan yang terjadi secara tidak sengaja, memberikan jalan buat kita membangun hubungan yang gemas ini.",
    text2: "Bahagia, Marah, Cemburu.. itu sering sangat terjadi di tahun ini, yahh namanya juga tahun pertama kali hehe. Meski begitu, ini adalah tahun yang manis karena aku menemukan kamu.",
    images: ["/images/2023/2023-1.jpg", "/images/2023/2023-12.jpg"],
    color: "bg-pink-50"
  },
  {
    year: "2024",
    title: "THE GROWTH",
    subtitle: "Belajar memahami",
    text1: "Tahun ini, banyak banget hal yang kita dapatkan. Kita belajar bagaimana hubungan itu hanya bisa dibangun bersama dua orang dan bukan sendiri. Adu argumen kecil, diam yang panjang, tapi selalu ada jalan untuk kita berbaikan.",
    text2: "kita saling belajar memahami satu sama lain, balajar buat mengerti dan berkembang. Meski begitu, aku bersyukur kita tetap bertahan hingga akhir tahun 2024 dan cinta kamu tidak pernah berkurang love you.",
    images: ["/images/2024/2024-1.jpg", "/images/2024/2024-7.jpg"],
    color: "bg-blue-50"
  },
  {
    year: "2025",
    title: "THE HORIZON",
    subtitle: "Menatap masa depan",
    text1: "Tahun ini apaa yaa... Tahun ini aku ngerasa hubungan kita makin kuat. Meski kita masih saling adu paham, berantem, dan semacamnya.. tapi aku, kamu, kita masih saling memaafkan, memperbaiki. Entah sudah berapa kali maaf, tapi kita masih menerima.",
    text2: "Tahun ini juga banyak perjuangan kita ntah untuk diri sendiri atau untuk hubungan kita. Terimaaci untuk kamu yang sudah bertahan sejauh ini. Aku harap kita bisa terus bersama melewati tahun-tahun berikutnya. Aamiin.",
    images: ["/images/2025/2025-12-Landscape.jpg", "/images/2025/2025-9.jpeg"],
    color: "bg-purple-50"
  }
];

// --- HELPER: FLOATING DECORATION ---
const FloatingShape = ({ delay, children, className }) => (
    <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, delay: delay, ease: "easeInOut" }}
        className={`absolute z-0 pointer-events-none opacity-60 ${className}`}
    >
        {children}
    </motion.div>
);

// --- SUB-KOMPONEN: STORY ITEM (ENHANCED) ---
const StorySectionItem = ({ data, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax & Motion
    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const opacityText = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
    const yText = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

    const rotate1 = index % 2 === 0 ? -6 : 6;
    const rotate2 = index % 2 === 0 ? 6 : -6;
    const isEven = index % 2 === 0;

    return (
        <div ref={ref} className="relative py-32 md:py-48 border-b border-gray-100/50 overflow-hidden">
            
            {/* Background Blob Decoration */}
            <div className={`absolute top-1/2 ${isEven ? 'left-0' : 'right-0'} -translate-y-1/2 w-[500px] h-[500px] ${data.color} rounded-full blur-[100px] opacity-60 -z-10 pointer-events-none`} />

            {/* BIG NUMBER BACKGROUND */}
            <div className={`absolute top-10 ${isEven ? 'right-10' : 'left-10'} text-[20rem] font-black text-gray-50 opacity-40 select-none -z-10 leading-none`}>
                0{index + 1}
            </div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
                
                {/* KOLOM TEKS */}
                <motion.div 
                    style={{ opacity: opacityText, y: yText }}
                    className={`space-y-8 ${!isEven ? 'md:order-2' : ''}`}
                >
                    {/* Header Group */}
                    <div className="space-y-2">
                         <div className="flex items-center gap-4 mb-4">
                            {/* PERBAIKAN: Border lebih halus (gray-200) dan teks abu-abu */}
                            <span className="px-4 py-1 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-widest bg-white text-gray-500 shadow-sm">
                                {data.year}
                            </span>
                            <div className="h-[1px] w-20 bg-gray-200"></div>
                         </div>
                        
                        <h3 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight uppercase">
                            {data.title}
                        </h3>
                        <p className="text-xl md:text-2xl font-serif italic text-gray-400">
                            "{data.subtitle}"
                        </p>
                    </div>
                    
                    {/* Content Text */}
                    <div className="space-y-6 text-gray-600 leading-relaxed font-sans text-lg md:text-xl">
                        <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-gray-900">
                            {data.text1}
                        </p>
                        <p>{data.text2}</p>
                    </div>

                    {/* Decorative Quote Icon */}
                    <Quote className="text-gray-200 w-12 h-12 rotate-180" />
                </motion.div>

                {/* KOLOM FOTO PARALLAX & DECORATION */}
                <div className="relative h-[400px] md:h-[600px] w-full flex justify-center items-center">
                    
                    {/* Floating Shapes */}
                    <FloatingShape delay={0} className="-top-10 left-10 text-yellow-400">
                        <Star fill="currentColor" size={48} />
                    </FloatingShape>
                    <FloatingShape delay={1.5} className="bottom-20 right-10 text-pink-400">
                        <Heart fill="currentColor" size={40} />
                    </FloatingShape>
                    <FloatingShape delay={2} className="top-1/2 -right-5 text-purple-300">
                        <Sparkles size={32} />
                    </FloatingShape>

                    {/* Foto 1 (Besar) */}
                    <motion.div 
                        style={{ y: y1, rotate: rotate1 }}
                        className="absolute w-56 h-72 md:w-72 md:h-96 bg-white p-3 shadow-2xl rounded-sm z-10 left-0 md:left-4 top-10 transform transition-transform hover:scale-105 duration-500"
                    >
                        <div className="w-full h-full overflow-hidden bg-gray-100">
                             <img src={data.images[0]} alt="Memory 1" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                        {/* Tape effect */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-200/80 rotate-2 shadow-sm" />
                    </motion.div>

                    {/* Foto 2 (Kecil) */}
                    <motion.div 
                        style={{ y: y2, rotate: rotate2 }}
                        className="absolute w-48 h-60 md:w-60 md:h-72 bg-white p-3 shadow-2xl rounded-sm z-20 right-0 md:right-4 bottom-10 transform transition-transform hover:scale-105 duration-500"
                    >
                        <div className="w-full h-full overflow-hidden bg-gray-100">
                             <img src={data.images[1]} alt="Memory 2" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 -rotate-3 shadow-sm" />
                    </motion.div>

                </div>
            </div>
        </div>
    );
};


function App() {
  const ref = useRef(null);
  const [audioTime, setAudioTime] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Mouse Tilt Effect Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (isMobile || currentView !== 'home') return; 
    const rect = ref.current.getBoundingClientRect();
    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const { scrollYProgress } = useScroll();
  const opacityText = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const yText = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);
  const themeColor = "#FFFFFF"; 

  // --- RENDER UTAMA ---
  return (
    <>
      {/* 1. MUSIC PLAYER */}
      <MusicPlayer onTimeUpdate={(time) => setAudioTime(time)}/>

      {/* 2. LOGIKA TAMPILAN */}
      
      {/* A. VIEW: GALLERY */}
      {currentView === 'gallery' && (
        <GalleryView onBack={() => setCurrentView('home')} />
      )}

      {/* B. VIEW: STORY */}
      {currentView === 'story' && (
        <StoryView onBack={() => setCurrentView('home')} />
      )}

      {/* C. VIEW: HOME (Default) */}
      <div 
         ref={ref}
         onMouseMove={handleMouseMove}
         style={{ display: currentView === 'home' ? 'block' : 'none' }}
         className={`relative min-h-[200vh] bg-[${themeColor}] text-gray-800 overflow-x-hidden font-sans selection:bg-pink-200`}
      >
          {/* BACKGROUND LAYERS */}
          {/* PERBAIKAN: Opacity dikurangi dari 0.5 menjadi 0.1 agar grid halus dan aesthetic */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-10" style={{ backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          
          <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${themeColor} 0%, transparent 30%, transparent 70%, ${themeColor} 100%)` }} />
          <DustParticles />
          <div className="fixed left-6 md:left-12 w-[1px] h-screen bg-gray-900/10 z-0"></div>

          {!isMobile && (
            <motion.div className="fixed w-8 h-8 border border-gray-400 rounded-full pointer-events-none z-50 mix-blend-difference" style={{ x: mouseX, y: mouseY, left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }} />
          )}

          {/* SECTION 1: HERO */}
          <section className="h-screen w-full flex flex-col items-center justify-center perspective-1000 px-4 relative z-10">
            <motion.div style={{ rotateX: isMobile ? 0 : rotateX, rotateY: isMobile ? 0 : rotateY, transformStyle: "preserve-3d" }} className="relative z-10 text-center">
              <motion.h1 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.2 }} className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 mb-4 md:mb-6 drop-shadow-lg leading-tight">
                Semua kenangan <br /> tersimpan di sini
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="text-sm md:text-2xl font-serif italic text-gray-500 max-w-xs md:max-w-2xl mx-auto">
                “I love you, from the beginning to the end of everything.”
              </motion.p>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 text-gray-400 text-xs md:text-sm">
              Scroll ke bawah
            </motion.div>
          </section>

          {/* SECTION 2: COVERFLOW */}
          <section className={`min-h-screen py-10 md:py-20 px-4 relative z-20 bg-gradient-to-b from-transparent via-[${themeColor}]/80 to-[${themeColor}]`}>
            <div className="mb-10 md:mb-16"><Coverflow /></div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-24">
                <button onClick={() => setCurrentView('gallery')} className="group relative px-8 py-3 bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 w-0 bg-gray-900 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
                    <span className="relative flex items-center gap-3 text-sm md:text-base font-medium tracking-widest uppercase text-gray-800">
                        Lihat Galeri Penuh <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </motion.div>
            </section>

            <div className="mt-8">
                <LiveLyrics currentTime={audioTime} />
            </div>

            {/* Text perjalanan waktu */}
            {/* --- UPGRADED: PERJALANAN WAKTU SECTION --- */}
            <motion.div 
                style={{ opacity: opacityText, y: yText }} 
                className="relative z-30 max-w-xs md:max-w-4xl mx-auto text-center py-20 md:py-32" // Padding diperbesar
            >
                {/* Background Radial Glow agar teks tidak "tenggelam" */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/80 blur-3xl -z-10 rounded-full pointer-events-none"></div>

                {/* 1. ICON HEADER (Jam Pasir & Sparkles) */}
                <div className="flex justify-center mb-8 relative">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }} // Putaran lebih pelan & elegan
                        className="relative z-10 p-5 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl border border-gray-100 ring-4 ring-gray-50/50"
                    >
                        <Hourglass size={40} className="text-gray-800" strokeWidth={1.2} />
                    </motion.div>
                    
                    {/* Dekorasi Sparkles Melayang */}
                    <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6], rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-4 right-[42%] text-yellow-400 drop-shadow-md"
                    >
                        <Sparkles size={28} />
                    </motion.div>
                </div>

                {/* 2. JUDUL (Typography Upgrade - Lebih Besar) */}
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 drop-shadow-sm">
                    Perjalanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-900 italic font-serif">Waktu</span>
                </h2>

                {/* 3. DECORATIVE DIVIDER (Garis Pemisah) */}
                <div className="flex items-center justify-center gap-6 mb-8 opacity-50">
                    <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                    <div className="flex gap-2 text-gray-400">
                        <Star size={12} fill="currentColor" className="animate-pulse" />
                        <Star size={16} fill="currentColor" />
                        <Star size={12} fill="currentColor" className="animate-pulse" />
                    </div>
                    <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>

                {/* 4. PARAGRAF (Lebih Puitis & Jelas) */}
                <div className="relative px-4">
                    {/* Tanda Kutip Besar Samar */}
                    <Quote size={80} className="absolute -top-10 -left-4 md:left-10 text-gray-100 rotate-180 -z-10" />
                    
                    <p className="text-base md:text-2xl text-gray-600 font-serif leading-relaxed md:leading-loose max-w-3xl mx-auto">
                        "Setiap detik yang berlalu adalah jejak yang tak mungkin terhapus. <br className="hidden md:block"/>
                        Di antara <span className="font-bold text-gray-900 bg-yellow-100/80 px-2 py-0.5 rounded-md mx-1 shadow-sm">tawa 2023</span>, 
                        air mata bahagia di <span className="font-bold text-gray-900 bg-pink-100/80 px-2 py-0.5 rounded-md mx-1 shadow-sm">2024</span>, 
                        dan seribu harapan baru di <span className="font-bold text-gray-900 bg-blue-100/80 px-2 py-0.5 rounded-md mx-1 shadow-sm">2025</span>."
                    </p>

                    <Quote size={80} className="absolute -bottom-10 -right-4 md:right-10 text-gray-100 -z-10" />
                </div>

            </motion.div>

          
          {/* SECTION 3: PARALLAX */}
          <ParallaxSection />
          
          {/* SECTION 4: VELOCITY */}
          <div className="relative z-20 -mt-20 mb-20"><VelocityScroll /></div>
          
          {/* SECTION 5: INTERACTIVE DESK */}
          <InteractiveDesk />

          <section className="relative z-20 bg-white border-b border-gray-100">
              <div className="text-center pt-20 pb-10">
                  <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Momen Spesial Lainnya</h3>
                  <p className="text-gray-500 mt-2">Klik kartu untuk melihat detail</p>
              </div>
              <InfiniteCards items={cardData} />
          </section>

          {/* --- SECTION BARU: MINI STORY TIMELINE (ENHANCED) --- */}
          <section className="relative z-0 py-20 bg-white overflow-hidden">
            <div className="text-center mb-32 px-6 relative z-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4"
                >
                    KISAH KITA
                </motion.h2>
                <div className="w-24 h-2 bg-gray-900 mx-auto mt-4 rounded-full" />
                <p className="mt-4 text-gray-500 font-serif italic text-xl">The chapters of our love.</p>
            </div>

            {/* Loop data cerita */}
            {miniStories.map((story, index) => (
                <StorySectionItem key={index} data={story} index={index} />
            ))}
          </section>

          {/* SECTION 6: SCRIBBLE ENDING */}
          <section className="bg-white relative z-20">
            <ScribbleEnding />
          </section>
          
          <section className="bg-white relative z-30 pb-10">
             <TimeCapsule />
          </section>

          <footer className={`h-40 flex items-center justify-center bg-[${themeColor}] border-t border-gray-100`}>
            <p className="text-gray-400 text-sm">© 2025 Memory Gallery.</p>
          </footer>
      </div>
    </>
  );
}

export default App;