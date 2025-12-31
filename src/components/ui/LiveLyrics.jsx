import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Disc, Music } from "lucide-react"; 
import { lyricsData } from "../../data/lyrics"; 

const LiveLyrics = ({ currentTime }) => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  // --- INFO LAGU ---
  const songInfo = {
    title: "Bergema Sampai Selamanya",
    artist: "Nadhif Basalamah"
  };

  // --- LOGIKA AKTIF ---
  const activeIndex = useMemo(() => {
    let active = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (lyricsData[i].time <= currentTime) {
            active = i;
        } else {
            break; 
        }
    }
    return active;
  }, [currentTime]);

  // --- AUTO SCROLL ---
  useEffect(() => {
    const container = containerRef.current;
    const activeItem = itemsRef.current[activeIndex];

    if (container && activeItem) {
      const containerHeight = container.clientHeight;
      const itemHeight = activeItem.clientHeight;
      const itemTop = activeItem.offsetTop;
      const targetScroll = itemTop - (containerHeight / 2) + (itemHeight / 2);

      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-16 perspective-1000 px-4 md:px-0">
      
      {/* ==============================================
          HEADER INFO LAGU (RESPONSIVE & AESTHETIC)
         ============================================== */}
      <div className="flex justify-center mb-8 md:mb-12 relative z-30 px-4">
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ rotate: 1, scale: 1.02 }}
            className="relative group cursor-default w-full max-w-[90vw] md:max-w-2xl" // Responsive Width
        >
            {/* 1. Shadow Sketch (Belakang) */}
            <div className="absolute inset-0 bg-gray-900 rounded-sm translate-x-1.5 translate-y-1.5 md:translate-x-3 md:translate-y-3 rotate-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />

            {/* 2. Main Box (Depan) */}
            <div className="relative bg-white border-2 border-gray-900 p-4 md:p-6 rounded-sm flex items-center gap-4 md:gap-6 shadow-sm overflow-hidden">
                
                {/* --- VINYL RECORD (Responsive Size) --- */}
                <div className="relative shrink-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                        // Mobile: w-16 (64px), Desktop: w-24 (96px) -> Lebih proporsional
                        className="w-16 h-16 md:w-24 md:h-24 bg-gray-900 rounded-full flex items-center justify-center border-[3px] md:border-4 border-gray-200 shadow-inner"
                    >
                        {/* Label Tengah */}
                        <div className="w-6 h-6 md:w-10 md:h-10 bg-red-500 rounded-full border-2 border-white flex items-center justify-center relative z-10">
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black rounded-full" />
                        </div>
                        {/* Kilauan Vinyl */}
                        <div className="absolute inset-0 rounded-full border-t-2 border-white/20 rotate-45" />
                    </motion.div>
                    
                    {/* Icon Music Floating */}
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-white border border-gray-900 rounded-full p-1 text-gray-900 shadow-sm z-20">
                        <Music size={12} className="md:w-[16px] md:h-[16px]" />
                    </div>
                </div>

                {/* --- TEXT INFO --- */}
                <div className="flex flex-col overflow-hidden w-full relative z-10">
                    {/* Label Kecil */}
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Now Playing</span>
                        <div className="flex gap-1 opacity-50">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"/>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"/>
                        </div>
                    </div>

                    {/* Judul Lagu (Ukuran Font Dinamis) */}
                    <h3 className="text-lg md:text-3xl font-serif font-black text-gray-900 leading-tight truncate pr-2">
                        {songInfo.title}
                    </h3>
                    
                    {/* Nama Artis */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-1 mt-1">
                        <p className="text-xs md:text-lg text-gray-500 font-serif italic truncate w-[70%]">
                            {songInfo.artist}
                        </p>
                        {/* Visualizer Mini */}
                        <div className="flex items-end gap-[2px] h-3 md:h-4 opacity-40">
                            {[1,2,3,4].map(i => (
                                <motion.div 
                                    key={i}
                                    className="w-0.5 md:w-1 bg-gray-800 rounded-full"
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DEKORASI --- */}
                {/* Selotip Atas */}
                <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 w-16 md:w-24 h-4 md:h-6 bg-yellow-100/80 border border-yellow-200/50 rotate-1 backdrop-blur-sm shadow-sm z-20" />
                
                {/* Efek Kertas Kusut (Texture Overlay) - Opsional untuk detail */}
                <div className="absolute inset-0 bg-gray-50 opacity-10 pointer-events-none mix-blend-multiply" />
            </div>
        </motion.div>
      </div>

      {/* ==============================================
          2. LYRICS CONTAINER (SKETCH OUTLINE)
         ============================================== */}
      
      {/* Wrapper Relatif untuk Efek Sketsa */}
      <div className="relative mx-auto max-w-5xl">
          
          {/* A. Garis Sketsa Belakang (Miring) */}
          <div className="absolute inset-0 border-2 border-gray-300 rounded-xl translate-x-2 translate-y-3 rotate-1 pointer-events-none" />
          
          {/* B. Garis Sketsa Kedua (Sedikit Offset) */}
          <div className="absolute inset-0 border-2 border-gray-800 rounded-xl translate-x-1 translate-y-1 -rotate-[0.5deg] pointer-events-none z-0" />

          {/* C. Kotak Utama Lirik (Diperbesar) */}
          <div className="relative bg-white border-2 border-gray-900 rounded-xl h-[400px] md:h-[600px] overflow-hidden z-10 shadow-sm">
              
              {/* Masking Gradient (Agar lirik pudar di ujung) */}
              <div className="absolute inset-0 pointer-events-none z-20" 
                   style={{ background: 'linear-gradient(to bottom, #ffffff 5%, transparent 20%, transparent 80%, #ffffff 95%)' }} 
              />

              {/* Scroll Container */}
              <div 
                ref={containerRef} 
                className="relative w-full h-full overflow-y-auto no-scrollbar px-4 py-8 text-center scroll-smooth transform-style-3d"
              >
                <div className="h-[45%]" />

                {lyricsData.map((line, index) => {
                  const isActive = index === activeIndex;
                  const distance = index - activeIndex;
                  const rotateVal = Math.max(Math.min(distance * 15, 45), -45); 

                  return (
                    <motion.div
                      key={index}
                      ref={(el) => (itemsRef.current[index] = el)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isActive ? 1 : Math.max(0.15, 1 - Math.abs(distance) * 0.25),
                        scale: isActive ? 1.15 : Math.max(0.85, 1 - Math.abs(distance) * 0.1),
                        rotateX: rotateVal, 
                        y: 0,
                        filter: isActive ? "blur(0px)" : `blur(${Math.abs(distance) * 2}px)`,
                        color: isActive ? "#111827" : "#9ca3af"
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`
                        relative py-4 md:py-6 transition-all duration-500 ease-out cursor-default select-none
                        flex flex-col items-center justify-center
                      `}
                      style={{ transformOrigin: "center center" }}
                    >
                      <span className={`
                        relative z-10 px-4 transition-all duration-500
                        ${isActive 
                            ? "font-black text-3xl md:text-5xl tracking-tight text-gray-900" // Font diperbesar
                            : "font-serif italic text-xl md:text-2xl"
                        }
                      `}>
                        {line.text}
                        
                        {/* Sparkles Decoration */}
                        {isActive && (
                            <>
                                <motion.span 
                                    animate={{ scale: [0, 1, 0], rotate: 180 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-3 -right-6 text-yellow-400"
                                >
                                    <Sparkles size={24} fill="currentColor" />
                                </motion.span>
                            </>
                        )}
                      </span>
                    </motion.div>
                  );
                })}

                <div className="h-[45%]" />
              </div>
          </div>
      </div>

    </div>
  );
};

export default LiveLyrics;