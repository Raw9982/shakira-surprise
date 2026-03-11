"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSoundEffects from '@/hooks/useSoundEffects';

export default function BirthdayReveal({ message }) {
  const canvasRef = useRef(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { playWhoosh } = useSoundEffects();

  useEffect(() => {
    const t1 = setTimeout(() => { setEnvelopeOpen(true); playWhoosh(); }, 800);
    const t2 = setTimeout(() => setShowMessage(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [playWhoosh]);

  // Sparkle + hearts canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener('resize', setSize);

    const sparkles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const hearts = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      size: Math.random() * 8 + 5,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.25 + 0.05,
      wobble: Math.random() * 0.4 - 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const drawHeart = (cx, cy, size, opacity) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(size / 20, size / 20);
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.bezierCurveTo(-10, -15, -20, 0, 0, 15);
      ctx.moveTo(0, -5);
      ctx.bezierCurveTo(10, -15, 20, 0, 0, 15);
      ctx.fillStyle = `rgba(255, 45, 117, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      // 4-pointed stars
      sparkles.forEach(s => {
        const tw = (Math.sin(t * 2 + s.phase) + 1) / 2;
        if (tw > 0.3) {
          const sz = s.r * tw;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - sz * 2);
          ctx.lineTo(s.x + sz * 0.5, s.y - sz * 0.5);
          ctx.lineTo(s.x + sz * 2, s.y);
          ctx.lineTo(s.x + sz * 0.5, s.y + sz * 0.5);
          ctx.lineTo(s.x, s.y + sz * 2);
          ctx.lineTo(s.x - sz * 0.5, s.y + sz * 0.5);
          ctx.lineTo(s.x - sz * 2, s.y);
          ctx.lineTo(s.x - sz * 0.5, s.y - sz * 0.5);
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 220, 240, ${tw * 0.7})`;
          ctx.fill();
        }
      });

      hearts.forEach(h => {
        drawHeart(h.x, h.y, h.size, h.opacity);
        h.y -= h.speed;
        h.x += Math.sin(t * 0.5 + h.phase) * h.wobble;
        if (h.y < -20) { h.y = canvas.height + 20; h.x = Math.random() * canvas.width; }
      });

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener('resize', setSize); cancelAnimationFrame(rafId); };
  }, []);

  const words = message.split(' ');

  return (
    <div className="fixed inset-0 z-40 overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0515 50%, #030108 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-lg">
        {/* Envelope + scroll animation */}
        <motion.div className="relative mb-8"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 14 }}
        >
          <motion.div
            animate={envelopeOpen ? { rotateX: -180, y: -10 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="relative"
            style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-1, 2, -1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl md:text-8xl"
              style={{ filter: 'drop-shadow(0 0 25px rgba(255,45,117,0.5))' }}
            >
              💌
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {envelopeOpen && (
              <motion.div
                initial={{ y: 0, opacity: 0, scale: 0.5 }}
                animate={{ y: -20, opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl"
              >
                📜
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparkle burst around envelope */}
          {envelopeOpen && [0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              className="absolute text-xl pointer-events-none"
              style={{
                top: `${20 + Math.sin(i * 1.5) * 30}%`,
                left: `${50 + Math.cos(i * 1.5) * 40}%`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="w-20 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mb-6"
        />

        {/* Word-by-word blur reveal */}
        <AnimatePresence>
          {showMessage && (
            <motion.h2
              className="text-2xl md:text-4xl font-serif leading-relaxed text-white"
              style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 30px rgba(255,45,117,0.25)' }}
            >
              {words.map((word, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: i * 0.12, duration: 0.4, ease: 'easeOut' }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          )}
        </AnimatePresence>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="mt-6 w-20 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent"
        />
      </div>
    </div>
  );
}
