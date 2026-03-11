"use client";
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function LoveMessage({ text }) {
  const canvasRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [lineEmojis, setLineEmojis] = useState([]);
  const lines = text.split('\n');

  // Per-line emoji that pops when line appears
  const emojiPerLine = ['💫', '🌟', '🌸', '💝', '✨'];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setVisibleLines(index);
      // Spawn floating emoji for this line
      setLineEmojis(prev => [...prev, {
        id: Date.now(),
        emoji: emojiPerLine[(index - 1) % emojiPerLine.length],
        x: 40 + Math.random() * 20,
      }]);
      if (index >= lines.length) clearInterval(interval);
    }, 900);
    return () => clearInterval(interval);
  }, [lines.length]);

  // Remove emojis after animation
  useEffect(() => {
    if (lineEmojis.length > 0) {
      const timer = setTimeout(() => {
        setLineEmojis(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lineEmojis]);

  // Connected particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener('resize', setSize);

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }));

    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      // Connection lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dx = p.x - q.x; const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255, 45, 117, ${(1 - dist / 80) * 0.06})`;
            ctx.stroke();
          }
        });
      });

      particles.forEach(p => {
        const tw = (Math.sin(t * 2 + p.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 230, ${tw * 0.6 + 0.1})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener('resize', setSize); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center p-6"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0515 50%, #020008 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.5) 100%)' }}
      />

      {/* Floating line emojis */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {lineEmojis.map(e => (
          <motion.div key={e.id}
            initial={{ opacity: 1, y: '55%', x: `${e.x}%`, scale: 0.5 }}
            animate={{ opacity: 0, y: '20%', scale: 1.5 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute text-2xl"
          >
            {e.emoji}
          </motion.div>
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 max-w-xl w-full text-center p-8 md:p-12 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,45,117,0.12)',
          boxShadow: '0 0 60px rgba(255,45,117,0.08), 0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Pulsating glow */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(255,45,117,0.08), inset 0 0 15px rgba(255,45,117,0.03)',
              '0 0 50px rgba(255,45,117,0.25), inset 0 0 30px rgba(255,45,117,0.08)',
              '0 0 20px rgba(255,45,117,0.08), inset 0 0 15px rgba(255,45,117,0.03)',
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
        />

        {/* Opening quotation */}
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute top-4 left-6 text-6xl text-pink-400 font-serif select-none pointer-events-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >"</motion.div>

        {/* Top emoji */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255,45,117,0.6))' }}
        >💕</motion.div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mb-8 h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
        />

        {/* Lines with slide-in */}
        <div className="space-y-4 min-h-[200px]">
          {lines.map((line, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -25 : 25, filter: 'blur(6px)' }}
              animate={i < visibleLines ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-lg md:text-2xl leading-relaxed text-white/90"
              style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 15px rgba(255,45,117,0.15)' }}
            >
              {line}
            </motion.p>
          ))}

          {visibleLines < lines.length && (
            <motion.span animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[2px] h-6 bg-pink-400 ml-1"
            />
          )}
        </div>

        {/* Closing quotation */}
        <motion.div initial={{ opacity: 0 }}
          animate={visibleLines >= lines.length ? { opacity: 0.15 } : {}}
          transition={{ duration: 0.5 }}
          className="absolute bottom-4 right-6 text-6xl text-pink-400 font-serif select-none pointer-events-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >"</motion.div>

        <motion.div initial={{ scaleX: 0 }}
          animate={visibleLines >= lines.length ? { scaleX: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
        />
      </motion.div>
    </div>
  );
}
