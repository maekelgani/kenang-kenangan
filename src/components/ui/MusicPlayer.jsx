import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const MusicPlayer = () => {
  // --- KONFIGURASI LAGU ---
  const SONG_META = {
    title: "Sempurna",               
    artist: "Andra & The Backbone",  
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273b55d26c578e30129b0a7e86e", 
    audioUrl: "/music/music-1.mp3"   
  };
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const bars = [1, 2, 3, 4];

  // --- FITUR AUTO PLAY ---
  useEffect(() => {
    // Coba mainkan lagu saat komponen dimuat (Mount)
    const attemptPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true); // Jika berhasil, set status jadi playing
        } catch (error) {
          console.log("Autoplay dicegah oleh browser. Menunggu interaksi user.");
          setIsPlaying(false); // Jika gagal, set status jadi pause
        }
      }
    };

    attemptPlay();
  }, []); // Array kosong [] artinya dijalankan sekali saat web dibuka

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-[100] flex items-center gap-2"
    >
      {/* Tambahkan 'autoPlay' di tag audio sebagai backup */}
      <audio ref={audioRef} src={SONG_META.audioUrl} loop autoPlay />

      <motion.div
        className="relative bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-full flex items-center p-1.5 pr-5 cursor-pointer overflow-hidden group hover:shadow-pink-100/50 transition-shadow"
        onClick={togglePlay}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* ... (SISA KODE TAMPILAN SAMA SEPERTI SEBELUMNYA) ... */}
        
        {/* --- COVER ART --- */}
        <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0"
        >
            <img src={SONG_META.coverUrl} alt="Cover" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                {isPlaying ? <Pause size={14} className="text-white fill-current" /> : <Play size={14} className="text-white fill-current ml-0.5" />}
            </div>
        </motion.div>

        {/* --- TEXT INFO --- */}
        <div className="flex flex-col ml-3 mr-2 overflow-hidden">
            <div className="flex items-center gap-2 h-3 mb-0.5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">
                    {isPlaying ? "Now Playing" : "Paused"}
                </span>
                {isPlaying && (
                    <div className="flex items-end gap-[2px] h-2">
                        {bars.map((bar) => (
                            <motion.div
                                key={bar}
                                className="w-[2px] bg-pink-500 rounded-full"
                                animate={{ height: [2, 8, 2] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: bar * 0.1, ease: "easeInOut" }}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800 truncate max-w-[120px] leading-tight">{SONG_META.title}</span>
                <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{SONG_META.artist}</span>
            </div>
        </div>

        {/* --- MUTE BUTTON --- */}
        <button onClick={toggleMute} className="ml-1 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

      </motion.div>
    </motion.div>
  );
};

export default MusicPlayer;