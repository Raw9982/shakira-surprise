"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageInput({ whatsappNumber, onDone }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const canvasRef = useRef(null);
  const textareaRef = useRef(null);

  // Sparkle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener('resize', setSize);

    const hearts = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.2 + 0.05,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.3 - 0.15,
    }));

    const drawHeart = (cx, cy, size, opacity) => {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(size / 20, size / 20);
      ctx.beginPath(); ctx.moveTo(0, -5);
      ctx.bezierCurveTo(-10, -15, -20, 0, 0, 15);
      ctx.moveTo(0, -5);
      ctx.bezierCurveTo(10, -15, 20, 0, 0, 15);
      ctx.fillStyle = `rgba(255, 45, 117, ${opacity})`;
      ctx.fill(); ctx.restore();
    };

    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      hearts.forEach(h => {
        drawHeart(h.x, h.y, h.size, h.opacity);
        h.y -= h.speed; h.x += Math.sin(t + h.phase) * h.drift;
        if (h.y < -20) { h.y = canvas.height + 20; h.x = Math.random() * canvas.width; }
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', setSize); cancelAnimationFrame(rafId); };
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    // Open WhatsApp with pre-filled message
    const encodedMsg = encodeURIComponent(`💌 Message from confession website:\n\n"${message.trim()}"\n\n💗`);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');

    setSent(true);
    setTimeout(() => onDone(), 3000);
  };

  const handleSkip = () => {
    onDone();
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0515 50%, #030108 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)' }}
      />

      <div className="relative z-10 max-w-md w-full">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="input"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              {/* Envelope icon */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-4"
                style={{ filter: 'drop-shadow(0 0 15px rgba(255,45,117,0.5))' }}
              >
                💌
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-serif text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 20px rgba(255,45,117,0.25)' }}
              >
                You can leave me a message 🥺
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.6 }}
                className="text-white/40 text-sm mb-6"
              >
                Write whatever's in your heart...
              </motion.p>

              {/* Glassmorphism text area card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-full rounded-2xl p-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,45,117,0.2), rgba(255,45,117,0.05))',
                }}
              >
                <div className="rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(10, 5, 20, 0.8)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setCharCount(e.target.value.length);
                    }}
                    placeholder="Type your message here... ✍️"
                    rows={5}
                    maxLength={500}
                    className="w-full bg-transparent text-white/90 placeholder-white/25 p-4 text-base resize-none outline-none"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      lineHeight: 1.6,
                    }}
                  />
                  <div className="flex items-center justify-between px-4 pb-3">
                    <span className="text-white/20 text-xs">{charCount}/500</span>
                    <div className="flex gap-1">
                      {['😊', '❤️', '🥰', '💕'].map((e, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setMessage(prev => prev + e);
                            setCharCount(prev => prev + e.length);
                            textareaRef.current?.focus();
                          }}
                          className="text-lg hover:scale-125 transition-transform p-1"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-4 mt-5"
              >
                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="px-8 py-3 rounded-full text-base font-semibold text-white relative overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  style={{
                    background: message.trim()
                      ? 'linear-gradient(135deg, #ff2d75 0%, #ff6b9d 50%, #ff2d75 100%)'
                      : 'rgba(255,255,255,0.1)',
                    boxShadow: message.trim()
                      ? '0 0 25px rgba(255,45,117,0.4), 0 8px 25px rgba(0,0,0,0.3)'
                      : 'none',
                  }}
                >
                  {message.trim() && (
                    <motion.div
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                    />
                  )}
                  <span className="relative z-10">Send 💌</span>
                </motion.button>

                {/* Skip */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="px-5 py-3 rounded-full text-sm text-white/40 hover:text-white/60 transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  Maybe later
                </motion.button>
              </motion.div>

              {/* Helper text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 2 }}
                className="text-white/20 text-[10px] mt-4 italic"
              >
                Message will be sent via WhatsApp 💬
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="sent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-6xl mb-4"
              >
                💗
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 25px rgba(255,45,117,0.3)' }}
              >
                Message sent!
              </h2>
              <p className="text-pink-300/60 text-base">
                Thank you... I'll read it later 🥰
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
