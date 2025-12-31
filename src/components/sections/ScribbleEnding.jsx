import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart } from "lucide-react";

// --- KOMPONEN: FLOATING HEARTS EFFECT ---
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, 
      delay: Math.random() * 0.5,  
      scale: Math.random() * 0.5 + 0.5, 
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute bottom-10 right-6 pointer-events-none z-50">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            y: -200 - Math.random() * 100, 
            x: heart.x 
          }}
          transition={{ 
            duration: 1.5 + Math.random(), 
            delay: heart.delay,
            ease: "easeOut"
          }}
          className="absolute"
        >
          <Heart fill="#ef4444" className="text-red-500 w-6 h-6 drop-shadow-sm" />
        </motion.div>
      ))}
    </div>
  );
};

// --- KOMPONEN: TOMBOL LOVE INTERAKTIF ---
const LoveButton = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [showEffects, setShowEffects] = useState(false);

    const handleClick = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            setShowEffects(true);
            setTimeout(() => setShowEffects(false), 2500);
        }
    };

    return (
        <div className="absolute bottom-6 right-6 z-50">
            {showEffects && <FloatingHearts />}

            <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }} 
                className="relative group focus:outline-none"
            >
                <div className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${isLiked ? 'bg-red-200 opacity-60' : 'bg-gray-100 opacity-0 group-hover:opacity-100'}`} />
                
                <div className={`relative p-3 rounded-full transition-all duration-300 shadow-sm border ${isLiked ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                    <Heart 
                        size={24}
                        className={`transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-300 hover:text-red-300'}`}
                    />
                </div>
            </motion.button>
        </div>
    );
};


// --- GRAFIS PENDUKUNG ---
const RotatingCross = ({ top, left, right, size = 100, scrollYProgress, direction = 1 }) => {
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360 * direction]);
    return (
        <motion.div 
            style={{ top, left, right, rotate, width: size, height: size }}
            className="absolute text-gray-200 pointer-events-none z-0 opacity-60"
        >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <rect x="45" y="0" width="10" height="100" fill="currentColor"/>
                <rect x="0" y="45" width="100" height="10" fill="currentColor"/>
            </svg>
        </motion.div>
    );
};

const MorphingShape = ({ top, left, right, scrollYProgress, range = [0.2, 0.6], reverse = false }) => {
    const borderRadius = useTransform(scrollYProgress, range, reverse ? ["0%", "50%"] : ["50%", "0%"]);
    const rotate = useTransform(scrollYProgress, range, [0, 180]);
    const scale = useTransform(scrollYProgress, range, [0.8, 1.2]);
    return (
        <motion.div 
            style={{ top, left, right, borderRadius, rotate, scale }}
            className="absolute w-16 h-16 md:w-24 md:h-24 border-2 border-gray-200 pointer-events-none z-0 opacity-50"
        />
    );
};

const FloatingTriangle = ({ top, left, right, scrollYProgress }) => {
    const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, -90]);
    return (
        <motion.div style={{ top, left, right, y, rotate }} className="absolute w-20 h-20 pointer-events-none z-0 opacity-40 text-gray-300">
             <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M50 10 L90 90 L10 90 Z" /></svg>
        </motion.div>
    );
}

// --- MILESTONE COMPONENT ---
const Milestone = ({ year, img, align = "left", top, scrollYProgress, startRange, endRange }) => {
  const isLeft = align === "left";
  
  const dotOpacity = useTransform(scrollYProgress, [startRange, startRange + 0.05], [0, 1]);
  const dotScale = useTransform(scrollYProgress, [startRange, startRange + 0.05], [0, 1.2]);

  const contentOpacity = useTransform(scrollYProgress, [startRange + 0.05, endRange], [0, 1]);
  const contentX = useTransform(scrollYProgress, [startRange + 0.05, endRange], [isLeft ? -50 : 50, 0]);

  return (
    <div className={`absolute w-full max-w-5xl px-4 md:px-12 flex ${isLeft ? 'justify-start' : 'justify-end'} z-20 pointer-events-none`} style={{ top }}>
      <div className={`relative flex items-start gap-4 md:gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <motion.div style={{ opacity: dotOpacity, scale: dotScale }} className="flex flex-col items-center pt-2">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-600 ring-4 ring-gray-100 shadow-xl z-10" />
            <div className="w-px h-full bg-gradient-to-b from-gray-300 to-transparent absolute top-5 -z-10" />
        </motion.div>
        
        <motion.div style={{ opacity: contentOpacity, x: contentX }} className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
            <span className="text-6xl md:text-8xl font-black text-gray-200 absolute -z-10 -mt-6 md:-mt-10 select-none opacity-50">{year}</span>
            <span className="text-3xl md:text-4xl font-bold text-gray-700 mb-4 z-10 relative">{year}</span>
            <div className="p-2 bg-white shadow-xl rounded-sm rotate-1 w-40 md:w-64 transition-transform duration-500 hover:rotate-0 hover:scale-105 pointer-events-auto border border-gray-100">
                <img src={img} alt={year} className="w-full h-28 md:h-40 object-cover bg-gray-50 grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ScribbleEnding = ({ onExploreClick }) => {
  const containerRef = useRef(null);

  const themeColor = "#ffffff"; 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"] 
  });

  // PERBAIKAN LOGIC SCROLL:
  // 1. Path Progress selesai lebih cepat (0.85)
  const pathProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  // 2. Card muncul LEBIH AWAL (mulai 0.75 selesai 0.9) agar pas berhenti langsung kelihatan
  const cardOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.75, 0.9], [0.9, 1]);
  
  // 3. Card bergerak dari bawah ke posisi normal dengan jarak tempuh lebih pendek agar cepat sampai
  const cardY = useTransform(scrollYProgress, [0.75, 0.9], [50, 0]);

  return (
    <div 
        ref={containerRef} 
        className="relative w-full min-h-[350vh] md:min-h-[300vh] flex flex-col items-center justify-start py-20 overflow-hidden"
        style={{ backgroundColor: themeColor }}
    >
      
      {/* Background Fade/Feather */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
            background: `linear-gradient(to bottom, ${themeColor} 0%, transparent 20%, transparent 80%, ${themeColor} 100%)`
        }}
      />

      {/* Background Particles */}
      <RotatingCross top="5%" left="-5%" scrollYProgress={scrollYProgress} direction={1} />
      <MorphingShape top="15%" right="5%" scrollYProgress={scrollYProgress} range={[0, 0.3]} />
      <FloatingTriangle top="35%" left="5%" scrollYProgress={scrollYProgress} />
      <RotatingCross top="50%" right="10%" size={60} scrollYProgress={scrollYProgress} direction={-1} />
      <MorphingShape top="65%" left="8%" scrollYProgress={scrollYProgress} range={[0.5, 0.9]} reverse={true} />
      <FloatingTriangle top="85%" right="2%" scrollYProgress={scrollYProgress} />

      {/* SVG Path */}
      {/* PERBAIKAN: pathLength dipersingkat (L 50 1000) agar berhenti agak ke atas, tidak sampai bawah banget */}
      <div className="absolute top-0 w-full max-w-3xl h-full pointer-events-none z-10">
        <svg viewBox="0 0 100 1200" fill="none" preserveAspectRatio="none" className="w-full h-[90%] overflow-visible">
          <motion.path
            d="M 50 0 C 50 150, 15 250, 15 350 C 15 450, 85 550, 85 650 C 85 750, 50 850, 50 950 L 50 1000" // PERBAIKAN PATH (Berhenti lebih atas)
            stroke="url(#silverGlow)" strokeWidth="6" strokeLinecap="round" className="opacity-60 blur-md"
            style={{ pathLength: pathProgress }}
          />
          <motion.path
            d="M 50 0 C 50 150, 15 250, 15 350 C 15 450, 85 550, 85 650 C 85 750, 50 850, 50 950 L 50 1000" // SAMA
            stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 20" 
            style={{ pathLength: pathProgress }}
          />
          <defs>
            <linearGradient id="silverGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#9ca3af" /> 
              <stop offset="100%" stopColor="#4b5563" /> 
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Milestones */}
      <Milestone year="2023" img="/images/2023/2023-12.jpg" align="left" top="15%" scrollYProgress={scrollYProgress} startRange={0.1} endRange={0.2} />
      <Milestone year="2024" img="/images/2024/2024-6.jpg" align="right" top="40%" scrollYProgress={scrollYProgress} startRange={0.35} endRange={0.45} />

      {/* Message Card */}
      <div className="flex-grow"></div> 
      <motion.div style={{ opacity: cardOpacity, scale: cardScale, y: cardY }} className="relative z-30 mt-auto mb-40 md:mb-60 px-6 w-full max-w-xl">
        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                <span className="absolute -inset-6 rounded-full bg-gray-200 opacity-40 animate-pulse" />
                <span className="relative w-4 h-4 block rounded-full bg-gray-800 ring-4 ring-white shadow-lg" />
            </div>
            <span className="mt-6 text-7xl font-black text-transparent tracking-tighter drop-shadow-sm" style={{ WebkitTextStroke: "1px #9ca3af" }}>2025</span>
        </div>

        {/* --- KARTU UTAMA --- */}
        <div className="relative bg-white p-6 md:p-8 rounded-sm shadow-2xl border border-gray-200 rotate-1 transform transition-transform hover:rotate-0 duration-500">
          
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#fef08a]/80 rotate-[-3deg] shadow-sm backdrop-blur-sm z-10 opacity-90" />

          <div className="w-full h-48 md:h-56 mb-8 overflow-hidden rounded-sm bg-gray-100">
             <img src="/images/2025/2025-1-Landscape.jpg" alt="Us" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
          </div>

          {/* Padding bottom lebih besar di mobile agar text tidak ketutup tombol love */}
          <div className="space-y-6 text-center px-1 md:px-2 pb-24 md:pb-10">
            <h3 className="text-xl md:text-2xl font-serif text-gray-800 font-bold relative inline-block z-0">
              <span className="relative z-10">Teruntuk yang aku sayang,</span>
              <span className="absolute bottom-1 -left-2 -right-2 h-3 bg-[#fef08a] -z-0 -rotate-1 opacity-60 mix-blend-multiply"></span>
            </h3>
            
            <p className="text-gray-600 leading-loose font-sans text-sm md:text-base tracking-wide">
              Terimaaci buat kamu yang maw bertahan sampai sejauh ini. 
              Web Galeri ini aku buat bukan hanya sekedar iseng, namun untuk merayakan setiap detik hubungan kita yang sudah terlewat.
              dan ini adalah kata-kata sayang aku untuk kamu. semoga kita terus seperti ini yaa
            </p>
            
            <p className="text-gray-900 font-medium font-serif italic text-base md:text-lg pt-2">
              "Dan Dari sekarang.. ayo kita buat banyaa kenangan indah di 2026 ini."
            </p>

            <div className="pt-8 border-t border-gray-100 mt-6 flex flex-col items-center gap-2">
                 <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">With All My Love</p>
                 <p className="font-serif text-2xl md:text-3xl text-gray-800 rotate-[-4deg]">Orang yang kamu sayang</p>
            </div>
          </div>
          
          {/* TOMBOL LOVE */}
          <LoveButton />
        </div>
      </motion.div>

    </div>
  );
};

export default ScribbleEnding;