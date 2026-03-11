"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "@/config/content";
import { ChevronRight } from "lucide-react";

import AudioPlayer from "@/components/ui/AudioPlayer";
import MatrixIntro from "@/components/scenes/MatrixIntro";
import BirthdayReveal from "@/components/scenes/BirthdayReveal";
import LoveMessage from "@/components/scenes/LoveMessage";
import ConfessionQuestion from "@/components/scenes/ConfessionQuestion";
import MessageInput from "@/components/scenes/MessageInput";
import PhotoStack from "@/components/scenes/PhotoStack";

// Scene flow (6 scenes):
// 0 = Matrix Intro
// 1 = Romantic Reveal
// 2 = Love Message
// 3 = Confession Question (Yes/No)
// 4 = Message Input ("Kamu bisa isi pesan untuk aku ya")
// 5 = Heart Celebration

const TOTAL_SCENES = 6;

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [starPositions] = useState(() =>
    Array.from({ length: 50 }, () => ({
      w: Math.random() * 2.5 + 0.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 4,
    }))
  );

  const nextScene = () => {
    if (currentScene < TOTAL_SCENES - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  // Love meter loading animation
  const handleStart = () => {
    setIsLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setHasStarted(true), 400);
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 200);
  };

  // Landing page
  if (!hasStarted) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 text-white font-sans p-6 text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #120625 0%, #080012 55%, #000000 100%)' }}
      >
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {starPositions.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
              className="absolute rounded-full"
              style={{
                width: s.w, height: s.w,
                left: `${s.left}%`, top: `${s.top}%`,
                background: 'radial-gradient(circle, rgba(255,200,230,0.9) 0%, rgba(255,45,117,0.3) 100%)',
              }}
            />
          ))}
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: '#ff2d75', top: '20%', left: '10%' }}
          />
          <motion.div animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-48 h-48 rounded-full blur-3xl opacity-10"
            style={{ background: '#a855f7', bottom: '20%', right: '15%' }}
          />
        </div>

        {/* Envelope */}
        <motion.div initial={{ y: -30, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 10 }}
          className="relative"
        >
          <motion.div animate={{ y: [0, -8, 0], rotate: [-2, 3, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-2"
            style={{ filter: 'drop-shadow(0 0 25px rgba(255,45,117,0.5))' }}
          >💌</motion.div>
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
              className="absolute w-1 h-1 rounded-full bg-pink-300"
              style={{ top: `${10 + i * 20}%`, right: `${-5 + i * 10}%` }}
            />
          ))}
        </motion.div>

        {/* Psst */}
        <motion.p initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.6, 0.4, 0.6], scale: 1 }}
          transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
          className="text-lg italic text-pink-300/50 mb-2 mt-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >Psst... 🤫</motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xs tracking-[0.4em] uppercase text-pink-300/50 mb-6"
        >There's something for you</motion.p>

        {/* Button OR Loading bar */}
        {!isLoading ? (
          <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(255,45,117,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="relative px-12 py-4 rounded-full text-lg font-semibold overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #ff2d75 0%, #ff6b9d 50%, #ff2d75 100%)',
              boxShadow: '0 0 35px rgba(255,45,117,0.4), 0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            <motion.div animate={{ x: [-250, 250] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
            />
            <span className="relative z-10">Open Message ✨</span>
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="w-64 flex flex-col items-center gap-3"
          >
            {/* Love meter label */}
            <p className="text-pink-300/70 text-xs tracking-widest uppercase">
              {loadingProgress < 30 ? '💕 Preparing feelings...'
                : loadingProgress < 60 ? '💗 Gathering courage...'
                : loadingProgress < 90 ? '💖 Almost ready...'
                : '💝 Ready!'}
            </p>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <motion.div
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #ff2d75, #ff6b9d, #ff2d75)',
                  boxShadow: '0 0 10px rgba(255,45,117,0.5)',
                }}
              />
            </div>

            <p className="text-white/30 text-xs">{Math.round(loadingProgress)}%</p>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.25 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-8 text-white/25 text-[10px] italic max-w-xs"
        >
          📜 By opening this message, you agree to smile uncontrollably
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-3 text-white/30 text-xs"
        >Turn on volume for the best experience 🎵</motion.p>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-pink-500/30">
      <AudioPlayer src={content.music} />

      <AnimatePresence mode="wait">
        {currentScene === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(15px)", scale: 1.05 }}
            transition={{ duration: 0.8 }} className="absolute inset-0"
          >
            <MatrixIntro name={content.name} introTitle={content.introTitle} />
          </motion.div>
        )}
        {currentScene === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }} className="absolute inset-0"
          >
            <BirthdayReveal message={content.revealMessage} />
          </motion.div>
        )}
        {currentScene === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1 }} className="absolute inset-0"
          >
            <LoveMessage text={content.loveMessage} />
          </motion.div>
        )}
        {currentScene === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(15px)" }}
            transition={{ duration: 0.8 }} className="absolute inset-0"
          >
            <ConfessionQuestion onYes={nextScene} />
          </motion.div>
        )}
        {currentScene === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }} className="absolute inset-0"
          >
            <MessageInput whatsappNumber={content.whatsappNumber} onDone={nextScene} />
          </motion.div>
        )}
        {currentScene === 5 && (
          <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }} className="absolute inset-0"
          >
            <PhotoStack photos={content.photos} message={content.closingMessage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEXT BUTTON (scenes 0-2 only — scene 3 has its own Yes, scene 4 has its own send) */}
      {currentScene <= 2 && (
        <motion.button key={`next-${currentScene}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          onClick={nextScene}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white/60 hover:text-white transition-all duration-300 group cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span className="group-hover:tracking-wider transition-all duration-300">Next</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
      )}
    </main>
  );
}
