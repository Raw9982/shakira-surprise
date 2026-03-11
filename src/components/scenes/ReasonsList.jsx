"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const reasons = [
  { text: "Aku bisa jadi alarm gratis setiap pagi", emoji: "⏰", reaction: "☀️" },
  { text: "Kamu bakal punya teman curhat 24/7", emoji: "💬", reaction: "🫶" },
  { text: "Aku janji ga bakal lupa anniversary... mungkin", emoji: "🤭", reaction: "📅" },
  { text: "Kamu bakal dapat pelukan gratis unlimited", emoji: "🤗", reaction: "💝" },
  { text: "Aku bakal nonton drakor bareng walau ga ngerti", emoji: "📺", reaction: "🍿" },
  { text: "Janji bakal bawain makanan pas kamu laper", emoji: "🍕", reaction: "😋" },
  { text: "Aku bakal dengerin cerita kamu yg sama 100x", emoji: "👂", reaction: "😌" },
];

export default function ReasonsList() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const canvasRef = useRef(null);

  // Reveal reasons one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        const next = prev + 1;
        if (next <= reasons.length) {
          // Spawn floating reaction emoji
          setFloatingReactions(fr => [...fr, {
            id: Date.now(),
            emoji: reasons[next - 1].reaction,
            x: 20 + Math.random() * 60,
          }]);
        }
        if (next >= reasons.length) clearInterval(interval);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Remove floating reactions after anim
  useEffect(() => {
    if (floatingReactions.length > 0) {
      const timer = setTimeout(() => setFloatingReactions(fr => fr.slice(1)), 2000);
      return () => clearTimeout(timer);
    }
  }, [floatingReactions]);

  // Sparkle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener('resize', setSize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, phase: Math.random() * Math.PI * 2,
    }));

    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      dots.forEach(d => {
        const tw = (Math.sin(t * 2 + d.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 230, ${tw * 0.5 + 0.1})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', setSize); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0515 50%, #030108 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)' }}
      />

      {/* Floating reactions */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingReactions.map(r => (
            <motion.div key={r.id}
              initial={{ opacity: 1, y: '65%', x: `${r.x}%`, scale: 0.5 }}
              animate={{ opacity: 0, y: '15%', scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute text-3xl"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <motion.div className="text-4xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >📋</motion.div>
          <h2 className="text-2xl md:text-3xl font-serif text-white"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 20px rgba(255,45,117,0.3)' }}
          >
            Alasan Kamu Harus Bilang Mau
          </h2>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mx-auto mt-2 h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
          />
        </motion.div>

        {/* Reasons list */}
        <div className="space-y-3">
          {reasons.map((reason, i) => (
            <AnimatePresence key={i}>
              {i < visibleCount && (
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,45,117,0.08)',
                  }}
                >
                  {/* Number badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #ff2d75, #ff6b9d)', color: 'white' }}
                  >
                    {i + 1}
                  </div>

                  {/* Text */}
                  <p className="text-white/80 text-sm md:text-base flex-1">
                    {reason.text}
                  </p>

                  {/* Emoji */}
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-xl flex-shrink-0"
                  >
                    {reason.emoji}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {reasons.map((_, i) => (
            <motion.div key={i}
              animate={{
                scale: i < visibleCount ? 1 : 0.6,
                background: i < visibleCount
                  ? 'linear-gradient(135deg, #ff2d75, #ff6b9d)'
                  : 'rgba(255,255,255,0.15)',
              }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>

        {/* Fun bottom text */}
        <AnimatePresence>
          {visibleCount >= reasons.length && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, y: 0 }}
              className="text-center text-white/40 text-xs mt-4 italic"
            >
              Masih kurang alasan? Masih banyak loh... 😏
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
