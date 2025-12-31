import { useState, useRef, useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useAnimationFrame, 
  AnimatePresence 
} from "framer-motion";
import { X } from "lucide-react";

const InfiniteCards = ({ items }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  
  // Duplikasi item 4x agar looping sangat mulus dan tidak pernah "habis" di layar lebar
  const duplicatedItems = [...items, ...items, ...items, ...items];

  // Motion Value untuk posisi X
  const x = useMotionValue(0);
  
  // Refs untuk status interaksi
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  
  // Kecepatan dasar (pixel per frame)
  const baseVelocity = 0.5;

  // --- LOGIKA ANIMASI INFINITE (FRAME-BY-FRAME) ---
  useAnimationFrame((t, delta) => {
    if (!scrollerRef.current) return;

    // 1. Hitung lebar SATU set item (Total width / 4 karena kita duplikasi 4x)
    const totalWidth = scrollerRef.current.scrollWidth;
    const singleSetWidth = totalWidth / 4;

    // 2. Tentukan pergerakan
    if (!isDragging.current) {
        // Jika tidak di-drag, jalan otomatis
        // Jika di-hover, perlambat sampai berhenti (opsional, di sini kita stop total)
        const moveBy = isHovered.current ? 0 : -baseVelocity * (delta / 10);
        x.set(x.get() + moveBy);
    }

    // 3. LOGIKA TELEPORTASI (LOOPING SEAMLESS)
    // Ambil nilai x saat ini
    let currentX = x.get();

    // Jika sudah geser melebihi lebar 1 set, kembalikan ke 0
    // Karena gambar di set ke-2 sama dengan set ke-1, mata tidak akan melihat perubahannya
    if (currentX <= -singleSetWidth) {
        currentX += singleSetWidth;
        x.set(currentX);
    } 
    // Handle jika user geser paksa ke kanan (mundur) sampai habis
    else if (currentX > 0) {
        currentX -= singleSetWidth;
        x.set(currentX);
    }
  });

  // --- HANDLER DRAG MANUAL (PAN) ---
  // Kita gunakan onPan alih-alih drag bawaan agar tidak konflik dengan animasi x.set di atas
  const onPanStart = () => {
    isDragging.current = true;
  };

  const onPan = (event, info) => {
    // Tambahkan delta drag ke posisi x saat ini
    x.set(x.get() + info.delta.x);
  };

  const onPanEnd = () => {
    isDragging.current = false;
  };

  // Modal Handlers
  const openModal = (item) => {
    isHovered.current = true; // Stop animasi saat modal buka
    setSelectedCard(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    isHovered.current = false;
    setSelectedCard(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <div 
        ref={containerRef} 
        className="relative z-20 py-10 md:py-20 overflow-hidden bg-white mask-gradient-horizontal"
        // Pause saat hover mouse
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => { isHovered.current = false; }}
      >
         <style>{`.mask-gradient-horizontal { -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); }`}</style>

        <motion.div
          ref={scrollerRef}
          style={{ x }} // Binding nilai X
          className="flex gap-4 md:gap-8 w-max px-4 cursor-grab active:cursor-grabbing touch-pan-y" // touch-pan-y penting agar bisa scroll vertikal di HP
          
          // Event Listener Geser Manual
          onPanStart={onPanStart}
          onPan={onPan}
          onPanEnd={onPanEnd}
        >
          {duplicatedItems.map((item, idx) => (
            <Card key={`${item.id}-${idx}`} item={item} onClick={() => openModal(item)} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <Modal card={selectedCard} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

// --- KARTU (FIXED PORTRAIT RATIO) ---
const Card = ({ item, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      // UKURAN FIXED:
      // Mobile: 160px x 240px
      // Desktop: 250px x 350px
      className="relative w-[160px] h-[240px] md:w-[250px] md:h-[350px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group perspective-1000"
      whileHover={{
        scale: 1.02,
        rotateY: 10,
        zIndex: 10,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gray-900 transition-transform duration-500 group-hover:rotate-y-6 border border-gray-200 shadow-lg rounded-xl overflow-hidden">
         <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 pointer-events-none" // pointer-events-none agar gambar tidak ter-drag browser
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-sm md:text-lg line-clamp-1">{item.title}</h3>
            <p className="text-gray-300 text-[10px] md:text-xs">{item.date}</p>
          </div>
      </div>
       {/* Efek Folder Belakang */}
       <div className="absolute inset-0 bg-gray-100 rounded-xl -z-10 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 border border-gray-200"></div>
    </motion.div>
  );
};

// --- MODAL (RESPONSIVE FIX) ---
const Modal = ({ card, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        // Max Height & Overflow untuk scroll di HP
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col md:flex-row max-h-[85vh] md:max-h-[600px]"
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-20">
            <X size={20} className="text-gray-800" />
        </button>

        {/* Gambar Modal */}
        <div className="w-full md:w-1/2 h-64 md:h-auto flex-shrink-0 bg-gray-100">
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
        </div>

        {/* Text Area: Scrollable */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{card.date}</p>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{card.title}</h2>
          <div className="w-12 h-1 bg-gray-200 mb-6 flex-shrink-0"></div>
          <p className="text-gray-600 text-sm md:text-lg leading-relaxed font-serif italic">
            "{card.description}"
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfiniteCards;