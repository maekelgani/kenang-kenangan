import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Ganti path ini sesuai gambar asli Anda di folder public
const images = [
  "/images/2023/2023-11.png", 
  "/images/2023/2023-2.jpg",
  "/images/2024/2024-1.jpg",
  "/images/2024/2024-6.jpg",
  "/images/2025/2025-11.jpg",
];

const Coverflow = () => {
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Logic mengambil gambar (Looping infinite)
  const getImageIndex = (currentPage) => {
    const length = images.length;
    return ((currentPage % length) + length) % length;
  };

  const paginate = useCallback((newDirection) => {
    setPage((prev) => prev + newDirection);
  }, []);

  // Auto-Play
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4000); // Sedikit diperlambat agar lebih tenang
    return () => clearInterval(interval);
  }, [isDragging, paginate]);

  // Logic Swipe / Drag
  const onDragEnd = (event, info) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    const { offset, velocity } = info;

    if (offset.x > swipeThreshold || velocity.x > 500) {
      paginate(-1); 
    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
      paginate(1); 
    }
  };

  const renderImages = () => {
    const range = [-2, -1, 0, 1, 2];

    return range.map((offset) => {
      const actualIndex = page + offset; 
      const imageSrc = images[getImageIndex(actualIndex)]; 
      const isCenter = offset === 0;

      // Responsive spacing
      const spacing = window.innerWidth < 768 ? 140 : 280; 
      const xPos = offset * spacing;

      return (
        <motion.div
          key={actualIndex}
          className={`absolute rounded-2xl overflow-hidden bg-white select-none shadow-xl
            ${isCenter 
                ? "z-30 w-[260px] h-[380px] md:w-[450px] md:h-[600px] border-4 border-white shadow-2xl ring-1 ring-gray-200" 
                : "z-10 w-[220px] h-[300px] md:w-[350px] md:h-[480px] brightness-100" // Hapus brightness/grayscale bawaan
            }`}
          
          initial={{ x: xPos, scale: 0.8, opacity: 0 }}
          animate={{
            x: xPos,
            scale: isCenter ? 1 : 0.85,
            rotateY: offset * -25, // Rotasi lebih tajam
            zIndex: 30 - Math.abs(offset),
            opacity: Math.abs(offset) > 2 ? 0 : 1,
            filter: isCenter ? "blur(0px)" : "blur(4px)", // EFEK BLUR UNTUK YANG TIDAK AKTIF
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1
          }}
          style={{ 
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y' 
          }}
          onClick={() => {
            if (!isDragging && offset !== 0) paginate(offset);
          }}
        >
          <img 
            src={imageSrc} 
            alt="Memory" 
            className="w-full h-full object-cover pointer-events-none bg-gray-100"
            draggable="false"
          />
          
          {/* Overlay Putih Transparan (Bukan Hitam) untuk efek 'Dreamy' */}
          <div className={`absolute inset-0 bg-white/40 transition-opacity duration-500 ${isCenter ? 'opacity-0' : 'opacity-100'}`} />
        </motion.div>
      );
    });
  };

  return (
    <div className="relative w-full h-[500px] md:h-[750px] flex flex-col items-center justify-center py-10 overflow-hidden">
      
      {/* Area Swipe / Drag Wrapper */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsDragging(true)}
        onMouseLeave={() => setIsDragging(false)}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
      >
        {renderImages()}
      </motion.div>

      {/* Navigasi Tombol (Tema Terang) */}
      <div className="flex items-center gap-8 mt-4 md:mt-8 z-40 pointer-events-auto">
        <button 
          onClick={() => paginate(-1)}
          className="p-3 rounded-full bg-white/80 hover:bg-white shadow-lg border border-gray-100 transition-all text-gray-400 hover:text-gray-900 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Indikator Dot */}
        <div className="flex gap-2">
            {images.map((_, idx) => (
                <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === getImageIndex(page) ? 'w-8 bg-gray-800' : 'w-1.5 bg-gray-300'}`}
                />
            ))}
        </div>

        <button 
          onClick={() => paginate(1)}
          className="p-3 rounded-full bg-white/80 hover:bg-white shadow-lg border border-gray-100 transition-all text-gray-400 hover:text-gray-900 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <p className="mt-6 text-[10px] md:text-xs text-gray-400 tracking-[0.2em] uppercase font-medium">
        Swipe or Drag to Explore
      </p>
    </div>
  );
};

export default Coverflow;