"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import useSoundEffects from '@/hooks/useSoundEffects';

// Different No-button behavior modes
const NO_BEHAVIORS = [
  'runaway',     // 0: classic random teleport
  'runaway',     // 1: again
  'runaway',     // 2: again  
  'gravity',     // 3: drops to bottom then bounces
  'spin',        // 4: spins 360 while moving
  'tiny',        // 5: becomes comedically small
  'runaway',     // 6: classic
  'flip',        // 7: goes upside down
  'clone',       // 8: 3 fake buttons appear
  'runaway',     // 9: classic
  'gravity',     // 10+: cycle through fun ones
];

export default function ConfessionQuestion({ onYes }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [yesClicked, setYesClicked] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [noRotation, setNoRotation] = useState(0);
  const [noFlipped, setNoFlipped] = useState(false);
  const [clones, setClones] = useState([]);
  const [noScale, setNoScale] = useState(1);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { playSwoosh, playPop, playFanfare } = useSoundEffects();

  const noTexts = [
    "Nope 😢", "Are you sure? 🥺", "Seriously?! 😭", "Think again babe 💔",
    "Don't be like that... 😿", "You're making me sad 🥹", "Pleasee... 🙏", "That's mean 😤",
    "I won't give up! 💪", "IMPOSSIBLE! 😱", "Button is tired 🏃‍♂️", "I'm hiding 🫣",
    "Found me!...bye 🏃", "There's no No button 🙈", "Give up yet? 😏",
  ];

  const snarkyComments = [
    "", "Hehe naughty button 😏", "That's 2 times already.. 🤭",
    "The 'No' button is exercising 🏃‍♂️", "Just click Yes already 😝",
    "This button doesn't wanna be clicked 🤣", "Button is exhausted from running 😮‍💨",
    "It's playing hide and seek 🫣", "There's only one right answer 🤫",
    "Just accept your fate ❤️", "Level 10! You're persistent 💀",
    "The button wants to retire 👴", "Feel bad for the button 🥲",
  ];

  // Hearts canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener('resize', setSize);

    const hearts = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width, y: canvas.height + Math.random() * 300,
      size: Math.random() * 10 + 6, speed: Math.random() * 0.6 + 0.2,
      drift: Math.random() * 0.3 - 0.15, opacity: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
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
        if (h.y < -30) { h.y = canvas.height + 30; h.x = Math.random() * canvas.width; }
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', setSize); cancelAnimationFrame(rafId); };
  }, []);

  const spawnEmoji = useCallback(() => {
    const emojis = ['😢', '💔', '😭', '🥺', '😤', '💀', '🏃‍♂️', '😱', '🫣', '😮‍💨', '🤡', '👻'];
    const e = { id: Date.now() + Math.random(), emoji: emojis[Math.floor(Math.random() * emojis.length)], x: 20 + Math.random() * 60 };
    setFloatingEmojis(prev => [...prev.slice(-10), e]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(f => f.id !== e.id)), 2000);
  }, []);

  const getRandomPos = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const maxX = rect.width / 2 - 80;
    const maxY = rect.height / 2 - 50;
    return { x: (Math.random() - 0.5) * maxX * 2, y: (Math.random() - 0.5) * maxY * 2 };
  }, []);

  const handleNoHover = useCallback(() => {
    const behavior = NO_BEHAVIORS[Math.min(noCount, NO_BEHAVIORS.length - 1)];
    const newPos = getRandomPos();

    // Screen shake
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
    spawnEmoji();
    playSwoosh();

    switch (behavior) {
      case 'gravity':
        // Drop to bottom first, then bounce to random
        setNoPos({ x: noPos.x, y: 250 });
        setTimeout(() => setNoPos(newPos), 600);
        break;
      case 'spin':
        setNoRotation(prev => prev + 720);
        setNoPos(newPos);
        break;
      case 'tiny':
        setNoScale(0.4);
        setNoPos(newPos);
        setTimeout(() => setNoScale(0.7), 1000);
        break;
      case 'flip':
        setNoFlipped(prev => !prev);
        setNoPos(newPos);
        break;
      case 'clone':
        // Spawn 3 fake clone buttons that also run away
        const c = [0, 1, 2].map(i => ({
          id: Date.now() + i,
          pos: getRandomPos(),
        }));
        setClones(c);
        setNoPos(newPos);
        setTimeout(() => setClones([]), 2000);
        break;
      default:
        setNoPos(newPos);
    }

    setNoCount(prev => prev + 1);
  }, [noCount, noPos.x, getRandomPos, spawnEmoji, playSwoosh]);

  const handleYes = () => {
    setYesClicked(true);
    playPop();
    setTimeout(() => playFanfare(), 400);
    const colors = ['#ff2d75', '#ff6b9d', '#ff9ec1', '#ffffff', '#ffb6c1', '#ff69b4'];
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors, startVelocity: 40 });
    setTimeout(() => {
      confetti({ particleCount: 70, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors });
      confetti({ particleCount: 70, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors });
    }, 400);
    setTimeout(() => confetti({ particleCount: 60, spread: 360, origin: { x: 0.5, y: 0.3 }, colors, scalar: 1.5 }), 800);
    setTimeout(() => confetti({ particleCount: 40, spread: 120, origin: { y: 0.7 }, colors }), 1200);
    setTimeout(() => onYes(), 2500);
  };

  const yesScale = 1 + noCount * 0.1;
  const noOpacity = Math.max(1 - noCount * 0.05, 0.25);
  const noFontSize = Math.max(16 - noCount * 0.7, 7);

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0515 50%, #030108 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
      />

      {/* Floating emoji reactions */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map(e => (
            <motion.div key={e.id}
              initial={{ opacity: 1, y: '80%', x: `${e.x}%`, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 0, y: '10%', scale: 1.5, rotate: 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute text-3xl"
            >{e.emoji}</motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clone No buttons */}
      <AnimatePresence>
        {clones.map(c => (
          <motion.div key={c.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1, x: c.pos.x, y: c.pos.y }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute z-30 px-4 py-2 rounded-2xl text-sm text-white/40 border border-white/10 pointer-events-none"
            style={{ background: 'rgba(255,255,255,0.03)', left: '50%', top: '50%' }}
          >
            Nggak 😢
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        animate={shaking ? { x: [0, -10, 10, -6, 6, 0], y: [0, 4, -4, 2, -2, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-lg"
      >
        {/* Heart icon */}
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }} className="mb-5"
        >
          <motion.div animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl md:text-7xl"
            style={{ filter: 'drop-shadow(0 0 25px rgba(255,45,117,0.6))' }}
          >
            {yesClicked ? '🥰' : noCount > 8 ? '😏' : noCount > 5 ? '🥹' : '💗'}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!yesClicked ? (
            <motion.div key="question" className="flex flex-col items-center">
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 30px rgba(255,45,117,0.3)' }}
              >
                Wanna be my girlfriend?
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.8 }}
                className="text-white/40 text-sm mb-3"
              >be honest okay... 🥺</motion.p>
            </motion.div>
          ) : (
            <motion.div key="celebration" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }} className="flex flex-col items-center"
            >
              <motion.h2 className="text-4xl md:text-6xl font-serif text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 40px rgba(255,45,117,0.5)' }}
              >YEAYY!! 🎉🥳</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.4 }}
                className="text-pink-200 text-lg md:text-xl"
              >I promise I'll make you the happiest! 💗</motion.p>
              {noCount > 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.8 }}
                  className="text-white/40 text-sm mt-2"
                >(after {noCount}x escape attempts 🤭)</motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Snarky comment */}
        <AnimatePresence>
          {noCount > 0 && !yesClicked && (
            <motion.p key={`snark-${noCount}`}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-pink-400/80 text-sm mb-2 font-medium mt-2"
            >{snarkyComments[Math.min(noCount, snarkyComments.length - 1)]}</motion.p>
          )}
        </AnimatePresence>

        {/* Buttons */}
        {!yesClicked && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center justify-center gap-6 relative mt-3"
            style={{ minHeight: 200, width: '100%' }}
          >
            {/* YES */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              animate={{ scale: yesScale }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={handleYes}
              className="relative px-8 py-4 rounded-2xl text-xl font-bold text-white overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ff2d75 0%, #ff6b9d 50%, #ff2d75 100%)',
                boxShadow: `0 0 ${20 + noCount * 8}px rgba(255,45,117,${0.4 + noCount * 0.06}), 0 10px 30px rgba(0,0,0,0.3)`,
              }}
            >
              <motion.div animate={{ x: [-200, 200] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
              />
              <span className="relative z-10">
                {noCount === 0 ? "Yes! 💖" : noCount < 3 ? "Yes please! 💖" : noCount < 5 ? "YESS! 💗💗" : noCount < 8 ? "YESSS!! 💖💖💖" : "CLICK HERE!! 💖💖💖💖"}
              </span>
            </motion.button>

            {/* NO — runs away with different behaviors */}
            <motion.button
              animate={{
                x: noPos.x, y: noPos.y,
                opacity: noOpacity,
                rotate: noRotation + (noFlipped ? 180 : 0),
                scale: noScale,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onMouseEnter={handleNoHover}
              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleNoHover(); }}
              onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNoHover(); }}
              className="px-5 py-3 rounded-2xl font-medium text-white/60 border border-white/10 transition-colors select-none"
              style={{
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)',
                fontSize: noFontSize, touchAction: 'none',
                WebkitTouchCallout: 'none', WebkitUserSelect: 'none',
              }}
            >
              {noTexts[noCount % noTexts.length]}
            </motion.button>
          </motion.div>
        )}

        {/* Funny disclaimer */}
        {!yesClicked && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2 }}
            className="text-white/25 text-[10px] mt-1 italic"
          >
            *The 'No' button is currently under maintenance 🔧
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
