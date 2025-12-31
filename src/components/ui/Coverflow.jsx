import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/public/images/2023/2023-11.png", 
  "/public/images/2023/2023-2.jpg",
  "/public/images/2024/2024-1.jpg",
  "/public/images/2024/2024-6.jpg",
  "/public/images/2025/2025-11.jpg",
];

const Coverflow = () => {
  // Kita menggunakan "Page" index yang bisa minus atau plus tak terbatas
  // Ini kunci agar animasi tidak patah saat looping dari akhir ke awal
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Logic mengambil gambar berdasarkan page index (Modulus Math)
  const getImageIndex = (currentPage) => {
    const length = images.length;
    // Trik matematika untuk menangani angka negatif (agar looping mundur tetap jalan)
    return ((currentPage % length) + length) % length;
  };

  // Navigasi
  const paginate = useCallback((newDirection) => {
    setPage((prev) => prev + newDirection);
  }, []);

  // Auto-Play (Pause saat di-drag atau hover)
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isDragging, paginate]);

  // Logic Swipe / Drag
  const onDragEnd = (event, info) => {
    setIsDragging(false);
    const swipeThreshold = 50; // Jarak minimal geser untuk ganti gambar
    const { offset, velocity } = info;

    // Deteksi arah swipe
    if (offset.x > swipeThreshold || velocity.x > 500) {
      paginate(-1); // Swipe Kanan -> Mundur
    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
      paginate(1);  // Swipe Kiri -> Maju
    }
  };

  const renderImages = () => {
    // Kita merender 5 slot posisi relatif terhadap "page" saat ini
    // [-2, -1, 0, 1, 2]
    const range = [-2, -1, 0, 1, 2];

    return range.map((offset) => {
      // Index virtual sebenarnya (misal: page 10, offset -1 = 9)
      const actualIndex = page + offset; 
      // Ambil gambar yang sesuai dari array
      const imageSrc = images[getImageIndex(actualIndex)]; 
      
      const isCenter = offset === 0;

      // Responsive spacing
      const spacing = window.innerWidth < 768 ? 130 : 250; 
      const xPos = offset * spacing;

      return (
        <motion.div
          key={actualIndex} // GUNAKAN ACTUAL INDEX SEBAGAI KEY (PENTING AGAR TIDAK GLITCH)
          className={`absolute rounded-xl overflow-hidden border border-white/10 bg-gray-900 select-none
            ${isCenter 
                ? "z-30 w-[260px] h-[380px] md:w-[450px] md:h-[600px] shadow-2xl shadow-black/50" 
                : "z-10 w-[220px] h-[300px] md:w-[350px] md:h-[480px] brightness-[0.4] grayscale-[60%]"
            }`}
          
          // Initial state untuk animasi entry yang halus
          initial={{ 
            x: xPos,
            scale: 0.8,
            opacity: 0 
          }}
          
          // Animasi perubahan posisi
          animate={{
            x: xPos,
            scale: isCenter ? 1 : Math.abs(offset) === 2 ? 0.7 : 0.85,
            rotateY: offset * -15, // Rotasi 3D
            zIndex: 30 - Math.abs(offset),
            opacity: Math.abs(offset) > 2 ? 0 : 1, // Sembunyikan jika keluar dari range
          }}
          
          transition={{
            type: "spring",
            stiffness: 150, // Lebih responsif
            damping: 25,
            mass: 0.8
          }}
          
          style={{ 
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            cursor: isDragging ? 'grabbing' : 'grab', // Cursor berubah saat drag
            // Penting: touch-action none agar browser tidak scroll halaman saat swipe carousel
            touchAction: 'pan-y' 
          }}
          
          // Event Listener untuk Click (Pindah ke gambar yang diklik)
          onClick={() => {
            if (!isDragging && offset !== 0) paginate(offset);
          }}
        >
          <img 
            src={imageSrc} 
            alt="Memory" 
            className="w-full h-full object-cover pointer-events-none"
            draggable="false" // Matikan drag native browser pada gambar
          />
          
          {/* Overlay Gelap */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isCenter ? 'opacity-0' : 'opacity-40'}`} />
        </motion.div>
      );
    });
  };

  return (
    <div className="relative w-full h-[450px] md:h-[700px] flex flex-col items-center justify-center py-10">
      
      {/* Area Swipe / Drag Wrapper */}
      {/* Kita pasang drag listener di container pembungkus agar area swipe luas */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsDragging(true)} // Pause auto-play saat hover
        onMouseLeave={() => setIsDragging(false)}
        
        // --- AKTIVASI FITUR TOUCH/DRAG ---
        drag="x" // Hanya geser horizontal
        dragConstraints={{ left: 0, right: 0 }} // Snap back ke tengah
        dragElastic={0.05} // Efek karet saat ditarik
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
        // ---------------------------------
      >
        {renderImages()}
      </motion.div>

      {/* Navigasi Tombol (Tetap ada untuk Desktop user) */}
      <div className="flex items-center gap-6 mt-6 md:mt-2 z-40 pointer-events-auto">
        <button 
          onClick={() => paginate(-1)}
          className="p-3 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all text-gray-400 hover:text-white active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Indikator Dot */}
        <div className="flex gap-2">
            {images.map((_, idx) => (
                <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === getImageIndex(page) ? 'w-8 bg-white' : 'w-1.5 bg-gray-600'}`}
                />
            ))}
        </div>

        <button 
          onClick={() => paginate(1)}
          className="p-3 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all text-gray-400 hover:text-white active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <p className="mt-4 text-[10px] md:text-xs text-gray-500 tracking-widest uppercase opacity-60">
        Swipe or Drag to Explore
      </p>
    </div>
  );
};

export default Coverflow;