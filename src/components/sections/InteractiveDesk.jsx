import { useRef } from "react";
import { motion } from "framer-motion";

// Data Foto Dummy
const polaroids = [
  { id: 1, src: "/public/images/2023/2023-1.jpg", text: "First Date", rotate: -6, x: -100, y: -50 },
  { id: 2, src: "/public/images/2023/2023-3.jpg", text: "Ice Cream", rotate: 12, x: 120, y: 40 },
  { id: 3, src: "/public/images/2023/2023-12.jpg", text: "Pantaiii!", rotate: -15, x: -50, y: 100 },
  { id: 4, src: "/public/images/2025/2025-1-Landscape.jpg", text: "Masak Masak", rotate: 8, x: 80, y: -80 },
  { id: 5, src: "/public/images/2024/2024-2.jpg", text: "Random Snap", rotate: -3, x: 0, y: 0 },
];

const InteractiveDesk = () => {
  const containerRef = useRef(null);

  // WARNA TEMA: Cool Silver/Gray (Sama persis dengan ScribbleEnding)
  const themeColor = "#FFFFFF"; 

  return (
    <div 
        className="relative w-full py-32 overflow-hidden flex flex-col items-center justify-center"
        // 1. Set background container utama ke warna Silver
        style={{ backgroundColor: themeColor }}
    >
      
      {/* --- LAYER 1: Background Pattern (Grid Halus) --- */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
             backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
             backgroundSize: '24px 24px'
        }}
      />

      {/* --- LAYER 2: Fade / Feather Effect (Masking) --- */}
      {/* PERBAIKAN: 
          Kita tidak pakai class Tailwind 'from-[#fdfdfd]' lagi karena itu warna putih.
          Kita pakai style inline dengan 'themeColor' (#F5F7FA) agar warnanya menyatu sempurna.
      */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
            background: `linear-gradient(to bottom, ${themeColor} 0%, transparent 20%, transparent 80%, ${themeColor} 100%)`
        }}
      />

      {/* Header Text */}
      <div className="text-center mb-16 relative z-10 pointer-events-none">
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Meja Kenangan</h2>
        <p className="text-gray-500 mt-2 font-serif italic">"Seret dan rapikan sesuka hatimu..."</p>
      </div>

      {/* Area Dragging */}
      <div ref={containerRef} className="relative z-10 w-full max-w-5xl h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        
        {polaroids.map((item, index) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.2} 
            whileHover={{ scale: 1.1, zIndex: 50, cursor: "grab" }}
            whileDrag={{ scale: 1.2, zIndex: 100, cursor: "grabbing" }}
            initial={{ 
                rotate: item.rotate, 
                x: item.x, 
                y: item.y,
                opacity: 0,
                scale: 0.5
            }}
            whileInView={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.5, delay: index * 0.1 } 
            }}
            viewport={{ once: true }}
            className="absolute bg-white p-3 pb-8 shadow-xl rounded-sm border border-gray-200 w-48 md:w-56"
          >
            {/* Lubang Paku / Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-300 shadow-inner border border-gray-400 z-10" />

            {/* Foto */}
            <div className="w-full h-40 md:h-48 bg-gray-100 overflow-hidden mb-3 pointer-events-none">
               <img 
                 src={item.src} 
                 alt={item.text} 
                 className="w-full h-full object-cover sepia-[0.2]" 
                 draggable="false" 
               />
            </div>
            
            {/* Tulisan Tangan */}
            <p className="font-serif text-center text-gray-600 transform -rotate-1 text-lg">
                {item.text}
            </p>

            {/* Efek Glossy / Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none opacity-50" />
          </motion.div>
        ))}

      </div>

    </div>
  );
};

export default InteractiveDesk;