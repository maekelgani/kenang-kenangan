import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DustParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Membuat 25 partikel acak
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Posisi X (%)
      y: Math.random() * 100, // Posisi Y (%)
      size: Math.random() * 4 + 2, // Ukuran random
      duration: Math.random() * 10 + 10, // Durasi animasi
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-gray-400 rounded-full opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0], // Gerakan naik turun
            opacity: [0.2, 0.5, 0.2], // Kelap kelip halus
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default DustParticles;