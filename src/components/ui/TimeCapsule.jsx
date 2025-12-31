import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Lock, Unlock, Sparkles, Heart, Star } from "lucide-react";
import DustParticles from "./DustParticles"; // Import DustParticles yang sudah ada

// --- DATA GAMBAR BACKGROUND (SCATTERED MEMORIES) ---
// Gunakan foto-foto kecil/random kalian di sini
const SCATTERED_IMAGES = [
    "/images/2023/2023-3.jpg",
    "/images/2024/2024-1.jpg",
    "/images/2024/2024-6.jpg",
    "/images/2025/2025-9.jpg",
    "/images/2023/2023-6.jpg",
    "/images/2025/2025-14.jpg",
    "/images/2023/2023-1.jpg",
];
const imagePositions = [
    { top: "5%", left: "5%", rotate: -10 },
    { top: "10%", right: "8%", rotate: 15 },
    { bottom: "15%", left: "8%", rotate: 5 },
    { bottom: "5%", right: "5%", rotate: -15 },
    { top: "50%", left: "-5%", rotate: -20 }, 
    { top: "60%", right: "-2%", rotate: 10 },
];

// --- SUB-COMPONENT: PARTICLE EXPLOSION ---
const Particle = ({ delay }) => {
  const randomX = (Math.random() - 0.5) * 800; 
  const randomY = (Math.random() - 0.5) * 800;
  const colors = ["#fbbf24", "#f472b6", "#60a5fa", "#ffffff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{ x: randomX, y: randomY, scale: [0, 2, 0], opacity: [1, 1, 0] }}
      transition={{ duration: 2, ease: "easeOut", delay: delay }}
      className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full z-30 pointer-events-none"
      style={{ backgroundColor: color }}
    />
  );
};

const ConfettiExplosion = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-30">
      {particles.map((_, i) => (<Particle key={i} delay={Math.random() * 0.3} />))}
    </div>
  );
};

// --- SUB-COMPONENT: SCATTERED BACKGROUND IMAGES ---
const ScatteredBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {SCATTERED_IMAGES.map((img, i) => {
            const pos = imagePositions[i % imagePositions.length];
            return (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.4, scale: 1, y: [0, -15, 0] }} 
                    transition={{ 
                        opacity: { delay: 0.5 + (i * 0.1), duration: 1 },
                        scale: { delay: 0.5 + (i * 0.1), type: "spring" },
                        y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut" }
                    }}
                    style={{ ...pos }}
                    // RESPONSIVE FIX: Gambar lebih kecil di mobile (w-20) dan disembunyikan jika terlalu banyak (hidden md:block untuk sebagian)
                    className={`absolute w-20 h-20 md:w-48 md:h-48 p-2 bg-white shadow-lg rounded-sm transform ${i > 3 ? 'hidden md:block' : 'block'}`}
                >
                    <div className="w-full h-full overflow-hidden bg-gray-100">
                        <img src={img} alt="memory" className="w-full h-full object-cover grayscale opacity-80" style={{ transform: `rotate(${pos.rotate}deg)` }} />
                    </div>
                </motion.div>
            );
        })}
    </div>
);


// --- MAIN COMPONENT ---
const TimeCapsule = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const intervalRef = useRef(null);

  const startHolding = () => {
    if (isUnlocked) return;
    setIsHolding(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setIsUnlocked(true); return 100;
        }
        return prev + 2.5; 
      });
    }, 30);
  };

  const stopHolding = () => {
    if (isUnlocked) return;
    setIsHolding(false);
    clearInterval(intervalRef.current);
    setProgress(0);
  };

  return (
    <div className={`relative w-full py-20 md:py-32 flex flex-col items-center justify-center transition-all duration-1000 ${isUnlocked ? 'min-h-[80vh] md:min-h-screen bg-slate-50' : 'bg-gradient-to-b from-white to-slate-50'} overflow-hidden`}>
      
      <AnimatePresence mode="wait">
        
        {/* --- STATE 1: LOCKED --- */}
        {!isUnlocked ? (
          <motion.div 
            key="lock-state"
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex flex-col items-center gap-8 px-4"
          >
             <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Kunci Harapan 2026</h3>
                <p className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase animate-pulse">
                    {isHolding ? "Terus Tahan..." : "Tekan & Tahan"}
                </p>
            </div>
            <div 
                className="relative group cursor-pointer"
                onMouseDown={startHolding} onMouseUp={stopHolding} onMouseLeave={stopHolding} onTouchStart={startHolding} onTouchEnd={stopHolding}
            >
                {/* SVG Responsif: Ukuran lebih kecil di mobile (w-32) */}
                <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90 drop-shadow-xl">
                    {/* Circle Radius disesuaikan: Mobile r=60, Desktop r=76 */}
                    <circle cx="50%" cy="50%" r="45%" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                    <motion.circle 
                        cx="50%" cy="50%" r="45%" 
                        stroke="#111827" strokeWidth="6" fill="none" 
                        pathLength="100" // Cara mudah menghitung progress tanpa manual pixel
                        strokeDasharray="100" 
                        strokeDashoffset={100 - progress} 
                        strokeLinecap="round" 
                        className="transition-all duration-75 ease-linear" 
                    />
                </svg>
                
                {/* Button Icon Responsif */}
                <motion.div 
                    animate={isHolding ? { scale: 0.95 } : { scale: 1 }} 
                    className={`absolute top-2 left-2 right-2 bottom-2 rounded-full flex items-center justify-center transition-colors duration-500 ${isHolding ? 'bg-gray-900 text-white' : 'bg-white text-gray-400'}`}
                >
                    {isHolding ? <Fingerprint size={48} className="animate-pulse" /> : <Lock size={32} />}
                </motion.div>
            </div>
          </motion.div>
        ) : (
          
          /* --- STATE 2: UNLOCKED --- */
          <motion.div 
            key="unlocked-state"
            className="relative z-20 w-full h-full flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 z-0">
                 <DustParticles /> 
            </div>
            {/* Background Images: Hidden di mobile sangat kecil, atau ditata ulang */}
            <div className="hidden md:block">
                <ScatteredBackground />
            </div>
            <ConfettiExplosion /> 

            {/* CARD UTAMA RESPONSIVE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 }}
                // RESPONSIVE CLASS: p-6 (mobile) vs p-20 (desktop)
                className="relative bg-white/95 backdrop-blur-sm p-6 md:p-20 rounded-3xl md:rounded-[3rem] shadow-2xl border border-white/50 text-center w-full max-w-sm md:max-w-4xl z-10 mx-auto"
            >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute top-4 left-4 md:top-6 md:left-8 text-yellow-400 opacity-50"><Star size={24} /></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-4 right-4 md:bottom-6 md:right-8 text-pink-400 opacity-50"><Heart size={24} /></motion.div>

                {/* Icon Header */}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="relative w-16 h-16 md:w-24 md:h-24 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-xl">
                    <Unlock className="w-8 h-8 md:w-10 md:h-10" />
                    <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-spin-slow w-6 h-6 md:w-8 md:h-8" />
                </motion.div>

                <div className="relative z-10 space-y-4 md:space-y-8">
                    {/* Judul Responsif */}
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                        HAPPY <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500">
                            NEW YEAR 2026
                        </span>
                    </motion.h2>
                    
                    <motion.div initial={{ width: 0 }} animate={{ width: "120px" }} transition={{ delay: 0.9 }} className="h-1 md:h-1.5 bg-gray-200 mx-auto rounded-full" />

                    {/* Body Text Responsif */}
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-gray-700 font-serif text-base md:text-2xl leading-relaxed max-w-2xl mx-auto px-2">
                        "Terima kasih sudah mengunci harapan pada akhir tahun ini.
                        kita akhiri tahun 2025 dengan masih terus bareng yaa..
                        terimakasih banyak sekali lagi aku ucapkan untuk kamu.
                        Semoga di tahun depan, <span className="font-bold text-gray-900">Kamu semakin sayang samaa aku</span>,
                        dan <span className="font-bold text-gray-900">dan Cinta sama mamasss</span>.
                        <br/><br/>
                        <span className="block mt-4 md:mt-6 font-black text-xl md:text-3xl text-gray-900 not-italic bg-yellow-100/80 px-4 py-2 inline-block rounded-lg transform -rotate-1">
                            Aku Sayang Kamu, Lovee youu!!.
                        </span>"
                    </motion.p>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="pt-4 md:pt-8">
                         <button onClick={() => window.location.reload()} className="px-8 py-3 md:px-10 md:py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95">
                            Simpan & Mulai Perjalanan Baru di 2026
                        </button>
                    </motion.div>
                </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeCapsule;