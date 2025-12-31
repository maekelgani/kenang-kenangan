import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Heart, Sparkles, Quote } from "lucide-react";

// --- DATA CERITA ---
// Catatan: Saya ganti gambar ke URL online dulu agar tidak blank. 
// Nanti ganti kembali ke path lokal Anda jika sudah jalan.
const stories = [
  {
    year: "2023",
    title: "THE BEGINNING",
    subtitle: "Permulaan.",
    img: "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?q=80&w=2000&auto=format&fit=crop", 
    content: "Tahun ini adalah awal dari semua cerita kita. Pertemuan yang terjadi secara tidak sengaja, memberikan jalan buat kita membangun hubungan yang gemas ini. Bahagia, Marah, Cemburu.. itu sering sangat terjadi di tahun ini, yahh namanya juga tahun pertama kali hehe. Meski begitu, ini adalah tahun yang manis karena aku menemukan kamu.",
    quote: "Pertemuan yang manis adalah awal dari segalanya."
  },
  {
    year: "2024",
    title: "THE GROWTH",
    subtitle: "Belajar memahami.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2000&auto=format&fit=crop",
    content: "Tahun ini, banyak banget hal yang kita dapatkan. Kita belajar bagaimana hubungan itu hanya bisa dibangun bersama dua orang dan bukan sendiri. Adu argumen kecil, diam yang panjang, tapi selalu ada jalan untuk kita berbaikan. kita saling belajar memahami satu sama lain, balajar buat mengerti dan berkembang. Meski begitu, aku bersyukur kita tetap bertahan hingga akhir tahun 2024 dan cinta kamu tidak pernah berkurang love you.",
    quote: "Pertengkaran kecil adalah bumbu dari sebuah hubungan yang kuat."
  },
  {
    year: "2025",
    title: "THE HORIZON",
    subtitle: "Menatap masa depan.",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop",
    content: "Tahun ini apaa yaa... Tahun ini aku ngerasa hubungan kita makin kuat. Meski kita masih saling adu paham, berantem, dan semacamnya.. tapi aku, kamu, kita masih saling memaafkan, memperbaiki. Entah sudah berapa kali maaf, tapi kita masih menerima. Tahun ini juga banyak perjuangan kita ntah untuk diri sendiri atau untuk hubungan kita. Terimaaci untuk kamu yang sudah bertahan sejauh ini. Aku harap kita bisa terus bersama melewati tahun-tahun berikutnya. Aamiin.",
    quote: "Membangun Pondasi Masa depan yang kuat Bersama."
  }
];

// --- KOMPONEN: INTERACTIVE FOOTER (Heart Reveal) ---
const InteractiveFooter = ({ onBack }) => {
    const [clicks, setClicks] = useState(0);
    const [isExploded, setIsExploded] = useState(false);
    
    // Threshold: Butuh 5 kali klik untuk membuka pesan
    const CLICK_THRESHOLD = 5; 

    const handleClick = () => {
        if (isExploded) return;

        if (clicks + 1 >= CLICK_THRESHOLD) {
            setIsExploded(true); // Trigger ledakan
        } else {
            setClicks(prev => prev + 1);
        }
    };

    // Hitung skala berdasarkan jumlah klik
    const scale = 1 + (clicks * 0.3);
    
    // Hitung warna: Dari Gray-300 ke Red-500
    const heartColor = clicks === 0 ? "#d1d5db" : clicks > 2 ? "#ef4444" : "#f87171";

    return (
        <footer className="relative py-32 bg-[#f4f4f5] flex flex-col items-center justify-center text-center overflow-hidden min-h-[60vh]">
            
            <AnimatePresence mode="wait">
                {!isExploded ? (
                    /* FASE 1: TOMBOL HATI */
                    <motion.div 
                        key="heart-trigger"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ scale: 3, opacity: 0, filter: "blur(10px)" }}
                        className="flex flex-col items-center gap-6 z-10 cursor-pointer"
                        onClick={handleClick}
                    >
                        <p className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase animate-pulse">
                            {clicks === 0 ? "Tap the heart" : clicks < 3 ? "Keep tapping..." : "Almost there!"}
                        </p>

                        <motion.div
                            animate={{ scale: scale, color: heartColor }}
                            whileTap={{ scale: scale * 0.9 }}
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <Heart size={48} fill={clicks > 0 ? "currentColor" : "none"} strokeWidth={1.5} />
                        </motion.div>
                    </motion.div>
                ) : (
                    /* FASE 2: KARTU PESAN (FINAL CARD) */
                    <motion.div 
                        key="secret-card"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        className="relative bg-white p-10 md:p-14 max-w-lg mx-6 shadow-2xl border border-gray-200 text-center z-10 rounded-sm"
                    >
                        {/* Hiasan Sudut */}
                        <div className="absolute -top-6 -right-6 text-yellow-400">
                            <Sparkles size={48} className="animate-spin-slow" />
                        </div>
                        
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border-4 border-[#f4f4f5]">
                            <Heart fill="white" className="text-white w-8 h-8" />
                        </div>

                        <div className="mt-6 space-y-6">
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                                Terima Kasih
                            </h3>
                            <p className="text-gray-600 font-serif leading-relaxed text-lg">
                                "Tidak ada akhir untuk cerita kita, karena setiap hari bersamamu adalah halaman baru yang favorit. Terima kasih sudah membaca sampai sini. I Love You."
                            </p>
                            
                            <div className="pt-8 mt-4 border-t border-dashed border-gray-200">
                                <button 
                                    onClick={onBack}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-700 hover:scale-105 transition-all font-bold uppercase tracking-widest text-xs shadow-lg"
                                >
                                    Kembali ke Menu Utama
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Decor */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />
        </footer>
    );
};

// --- KOMPONEN CHAPTER ---
const StoryChapter = ({ data, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Parallax Text
  const yearY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={ref} className="relative flex flex-col md:flex-row min-h-screen border-b border-gray-200 overflow-hidden">
      
      {/* BAGIAN KIRI (STICKY) */}
      <div className="w-full md:w-[40%] bg-[#f4f4f5] md:h-screen md:sticky md:top-0 flex flex-col justify-center items-center relative overflow-hidden p-8 z-10 border-r border-gray-200 min-h-[50vh]">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative w-full h-full flex flex-row-reverse items-center justify-center md:justify-between gap-8">
            <motion.h2 style={{ y: yearY }} className="text-[6rem] md:text-[12rem] font-black text-gray-300/80 writing-vertical-rl rotate-180 select-none leading-none tracking-tighter">
                {data.year}
            </motion.h2>
            <div className="flex flex-col gap-4 z-10">
                <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="border-l-4 border-gray-900 pl-6 py-2">
                    <span className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase block mb-2">Chapter 0{index + 1}</span>
                    <h3 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight uppercase">{data.title}</h3>
                    <p className="text-lg md:text-xl text-gray-500 font-serif italic mt-2">{data.subtitle}</p>
                </motion.div>
            </div>
        </div>
      </div>

      {/* BAGIAN KANAN (SCROLL) */}
      <div className="w-full md:w-[60%] bg-white relative z-0">
        <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden relative">
            <motion.div className="w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }}>
                <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20" />
            </motion.div>
        </div>
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
            <p className="text-lg md:text-xl leading-loose text-gray-700 font-sans text-justify">{data.content}</p>
            <div className="mt-12 p-8 bg-gray-50 rounded-sm border border-gray-100 relative group hover:border-gray-300 transition-colors">
                <Quote className="absolute top-4 left-4 text-gray-300 w-8 h-8 rotate-180 group-hover:text-gray-900 transition-colors" />
                <p className="text-xl md:text-2xl font-bold text-gray-800 text-center italic relative z-10 font-serif">"{data.quote}"</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const StoryView = ({ onBack }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200 selection:text-black">
        
        {/* Simple Particle Effect (CSS Only - Aman dari Error Import) */}
        <div className="fixed inset-0 pointer-events-none z-[60] opacity-30 mix-blend-multiply">
             <div className="absolute inset-0" style={{ background: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
        </div>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-12 sticky top-0 bg-[#fdfdfd]/80 backdrop-blur-md py-4 px-6 z-40 border-b border-gray-100">
            <button onClick={onBack} className="p-3 rounded-full hover:bg-gray-100 transition-colors group">
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <h2 className="text-xl font-bold tracking-widest uppercase">Kembali Ke Beranda</h2>
        </div>

        {/* PROGRESS BAR */}
        <motion.div className="fixed top-[73px] left-0 right-0 h-1 bg-gray-900 origin-left z-50" style={{ scaleX }} />

        {/* HERO */}
        <section className="h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden pt-20">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="z-10 text-center px-4 max-w-4xl">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 mb-6 leading-tight">KUMPULAN <br/> CERITA KITA</h1>
                <div className="h-1 w-24 bg-gray-900 mx-auto mb-6" />
                <p className="text-lg md:text-2xl text-gray-500 font-serif italic tracking-wide">"Every love story is beautiful, but ours is my favorite."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-10 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Scroll Down</span>
                <div className="w-[1px] h-12 bg-gray-300" />
            </motion.div>
        </section>

        {/* CHAPTERS */}
        <main>
            {stories.map((story, index) => (
                <StoryChapter key={index} data={story} index={index} />
            ))}
        </main>

        {/* FOOTER BARU YANG INTERAKTIF */}
        <InteractiveFooter onBack={onBack} />

    </div>
  );
};

export default StoryView;