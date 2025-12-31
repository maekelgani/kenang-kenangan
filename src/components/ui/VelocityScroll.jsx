import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Mengubah kecepatan scroll menjadi kecepatan teks
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Logic wrapping (agar teks looping terus menerus tanpa putus)
  // Rentang -20% sampai -45% disesuaikan dengan jumlah 4 children span
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Ubah arah jika scroll berbalik (atas/bawah)
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap m-0 flex flex-nowrap">
      <motion.div 
        className="font-black uppercase text-5xl md:text-8xl flex whitespace-nowrap flex-nowrap text-gray-200/80" 
        style={{ x }}
      >
        {/* Render 4 kali agar looping mulus */}
        <span className="block mr-8 md:mr-24">{children} </span>
        <span className="block mr-8 md:mr-24">{children} </span>
        <span className="block mr-8 md:mr-24">{children} </span>
        <span className="block mr-8 md:mr-24">{children} </span>
      </motion.div>
    </div>
  );
}

export default function VelocityScroll() {
  return (
    <section className="py-10 md:py-20 relative z-30 bg-transparent rotate-[-2deg] mix-blend-multiply pointer-events-none">
      <ParallaxText baseVelocity={-2}>I Love You — Forever & Always — </ParallaxText>
      <ParallaxText baseVelocity={2}>Every Moment Matters — You & Me — </ParallaxText>
    </section>
  );
}