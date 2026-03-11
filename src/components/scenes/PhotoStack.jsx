"use client";
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function PhotoStack({ photos, message }) {
    const canvasRef = useRef(null);

    // Background star particles + heart-shaped confetti burst
    useEffect(() => {
        // 1. Heart-shaped confetti burst
        const heartShape = confetti.shapeFromPath({
            path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 googly,googly 76,56',
            matrix: [0.03333333, 0, 0, 0.03333333, -5.566666, -2.4]
        });

        // Try heart shape confetti, fall back to normal if shapeFromPath isn't available
        const launchConfetti = () => {
            const defaults = {
                spread: 360,
                ticks: 100,
                gravity: 0.4,
                decay: 0.94,
                startVelocity: 20,
                colors: ['#ff2d75', '#ff69b4', '#ff1493', '#ffffff', '#ffd700'],
            };

            // Burst 1
            confetti({ ...defaults, particleCount: 30, origin: { x: 0.2, y: 0.5 }, shapes: ['circle'] });
            confetti({ ...defaults, particleCount: 30, origin: { x: 0.8, y: 0.5 }, shapes: ['circle'] });
            confetti({ ...defaults, particleCount: 20, origin: { x: 0.5, y: 0.3 }, shapes: ['circle'] });

            // Delayed burst
            setTimeout(() => {
                confetti({ ...defaults, particleCount: 40, origin: { x: 0.3, y: 0.6 }, shapes: ['circle'] });
                confetti({ ...defaults, particleCount: 40, origin: { x: 0.7, y: 0.6 }, shapes: ['circle'] });
            }, 600);
        };

        launchConfetti();

        // 2. Background star canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // Create star particles
        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            speed: Math.random() * 0.15 + 0.02,
            phase: Math.random() * Math.PI * 2,
        }));

        let rafId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const t = Date.now() * 0.001;
            stars.forEach(s => {
                const twinkle = Math.abs(Math.sin(t + s.phase));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 230, 240, ${twinkle * 0.9})`;
                ctx.fill();
                s.y -= s.speed;
                if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
            });
            rafId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // Heart-shaped photo positions using the parametric heart equation
    // x(t) = 16sin³(t)
    // y(t) = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    // We place photos at specific parameter values along the heart curve
    const getHeartPosition = (t, scale = 12) => {
        const x = scale * Math.pow(Math.sin(t), 3) * 16;
        const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x, y };
    };

    // Generate positions for many small photo cards along the heart curve
    // We'll use the 3 photos and repeat them along the heart
    const heartPhotoCount = 14;
    const heartPhotos = Array.from({ length: heartPhotoCount }, (_, i) => {
        const t = (i / heartPhotoCount) * Math.PI * 2;
        const pos = getHeartPosition(t, 14);
        return {
            src: photos[i % photos.length],
            x: pos.x,
            y: pos.y,
            rotate: (Math.random() - 0.5) * 16,
            delay: i * 0.15,
        };
    });

    // Lantern positions (Tangled/Rapunzel floating lanterns 🏮)
    const lanterns = Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,  // % left
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 8,
        size: 22 + Math.random() * 16,
        sway: 15 + Math.random() * 20,
    }));

    return (
        <div className="fixed inset-0 bg-[#05010a] z-40 overflow-hidden flex flex-col items-center justify-center">
            {/* Star particle background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Floating Lanterns 🏮 */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {lanterns.map(l => (
                    <motion.div
                        key={l.id}
                        initial={{ y: '110vh', opacity: 0 }}
                        animate={{ y: '-20vh', opacity: [0, 0.9, 0.85, 0.9, 0] }}
                        transition={{
                            duration: l.duration,
                            delay: l.delay,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute"
                        style={{ left: `${l.x}%` }}
                    >
                        <motion.div
                            animate={{ x: [-l.sway, l.sway, -l.sway], rotate: [-3, 3, -3] }}
                            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative"
                        >
                            {/* Lantern body */}
                            <div
                                className="rounded-lg relative"
                                style={{
                                    width: l.size,
                                    height: l.size * 1.4,
                                    background: 'linear-gradient(180deg, #ffb347 0%, #ff8c00 40%, #e65100 100%)',
                                    boxShadow: `0 0 ${l.size}px rgba(255,170,50,0.5), 0 0 ${l.size * 2}px rgba(255,140,0,0.2)`,
                                    borderRadius: `${l.size * 0.15}px ${l.size * 0.15}px ${l.size * 0.25}px ${l.size * 0.25}px`,
                                }}
                            >
                                {/* Inner glow */}
                                <div
                                    className="absolute inset-1 rounded"
                                    style={{
                                        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,230,150,0.6) 0%, transparent 70%)',
                                    }}
                                />
                            </div>
                            {/* Tiny string at bottom */}
                            <div
                                className="mx-auto"
                                style={{
                                    width: 1,
                                    height: l.size * 0.3,
                                    background: 'rgba(255,170,50,0.3)',
                                }}
                            />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Heart Formation of Photos */}
            <div className="relative z-10 flex items-center justify-center" style={{ width: '100%', height: '65vh' }}>
                {heartPhotos.map((photo, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            x: photo.x,
                            y: photo.y,
                            rotate: photo.rotate,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: photo.delay,
                            type: 'spring',
                            stiffness: 120,
                            damping: 15,
                        }}
                        className="absolute"
                        style={{ zIndex: i }}
                    >
                        {/* Floating effect after appearing */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                                duration: 3 + (i % 3),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: photo.delay + 0.8,
                            }}
                        >
                            <div
                                className="rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(255,45,117,0.4)] border-2 border-white/60"
                                style={{ width: 80, height: 80 }}
                            >
                                <img
                                    src={photo.src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                ))}

                {/* Center Glowing Heart Emoji */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                    transition={{ delay: heartPhotoCount * 0.15 + 0.3, duration: 1, ease: 'easeOut' }}
                    className="absolute z-30 text-7xl md:text-8xl"
                    style={{ filter: 'drop-shadow(0 0 30px rgba(255,45,117,0.8))' }}
                >
                    <motion.span
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
                        className="inline-block"
                    >
                        💖
                    </motion.span>
                </motion.div>
            </div>

            {/* Bottom Text */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: heartPhotoCount * 0.15 + 0.5 }}
                className="relative z-20 text-center mt-4"
            >
                <h1
                    className="text-5xl md:text-7xl font-serif text-white"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,45,117,0.9), 0 0 60px rgba(255,45,117,0.4)'
                    }}
                >
                    {message}
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: heartPhotoCount * 0.15 + 2, duration: 2 }}
                    className="text-white/50 mt-3 text-sm tracking-[0.3em] uppercase"
                >
                    Forever & Always
                </motion.p>
            </motion.div>
        </div>
    );
}
