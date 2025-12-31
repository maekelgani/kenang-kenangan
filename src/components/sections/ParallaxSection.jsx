import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Helper Component untuk Kolom Gambar
const Column = ({ images, y }) => {
  return (
    <motion.div 
      style={{ y }} 
      className="relative flex flex-col gap-4 w-1/3 min-w-[120px]"
    >
      {images.map((src, i) => (
        <div key={i} className="relative rounded-lg overflow-hidden h-[200px] md:h-[300px] w-full">
          <img src={src} alt="Parallax" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      ))}
    </motion.div>
  );
};

const ParallaxSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Membuat kecepatan scroll berbeda untuk tiap kolom
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]); // Naik cepat
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);  // Turun
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]); // Naik lambat

  const images1 = [
     "/public/images/2023/2023-1.jpg", 
     "/public/images/2024/2024-2.jpg", 
     "/public/images/2025/2025-1-Landscape.jpg",
     "/public/images/2025/2025-3-Landscape.jpg"
  ];
  const images2 = [
     "/public/images/2023/2023-9-Landscape.jpg", 
     "/public/images/2024/2024-6.jpg", 
     "/public/images/2025/2025-11.jpg"
  ];
  const images3 = [
     "/public/images/2023/2023-4.jpg", 
     "/public/images/2024/2024-1.jpg", 
     "/public/images/2025/2025-5-Landscape.jpg",
     "/public/images/2024/2024-7.jpg"
  ];

  return (
    <div ref={containerRef} className="h-[80vh] overflow-hidden bg-gray-50 flex items-center justify-center relative my-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdfdfd] via-transparent to-[#fdfdfd] z-20 pointer-events-none" />
      
      <div className="flex gap-4 md:gap-8 w-full max-w-5xl px-4 -translate-y-20 rotate-[-5deg] scale-110">
        <Column images={images1} y={y1} />
        <Column images={images2} y={y2} />
        <Column images={images3} y={y3} />
      </div>
      
      <div className="outline-2 absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
        <h2 className="text-5xl md:text-8xl font-black text-gray-100/90 mix-blend-overlay tracking-tighter uppercase text-center">
            Unforgettable <br/> Moments
        </h2>
      </div>
    </div>
  );
};

export default ParallaxSection;