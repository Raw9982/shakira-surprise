"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoGallery({ photos, captions = [] }) {
    const canvasRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotate carousel every 2s
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % photos.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [photos.length]);

    // Background particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.06 + 0.01,
        }));

        let rafId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const t = Date.now() * 0.001;
            particles.forEach(p => {
                const twinkle = (Math.sin(t + p.phase) + 1) / 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 235, ${twinkle * 0.5 + 0.1})`;
                ctx.fill();
                p.y -= p.speed;
                if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
            });
            rafId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // Get relative index for 3D positioning
    const getOffset = (index) => {
        const diff = index - activeIndex;
        if (diff > photos.length / 2) return diff - photos.length;
        if (diff < -photos.length / 2) return diff + photos.length;
        return diff;
    };

    return (
        <div className="fixed inset-0 z-40 overflow-hidden flex flex-col items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0a0515 60%, #030108 100%)' }}
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Vignette */}
            <div className="absolute inset-0 z-5 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
            />

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center mb-6 md:mb-10"
            >
                <motion.p
                    className="text-xs md:text-sm tracking-[0.4em] uppercase text-pink-300/60 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    ✨ Kenangan Kita ✨
                </motion.p>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mx-auto h-[1px] w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
                />
            </motion.div>

            {/* 3D Carousel */}
            <div className="relative z-10 w-full max-w-5xl h-[340px] md:h-[420px] flex items-center justify-center" style={{ perspective: '1200px' }}>
                {photos.map((src, index) => {
                    const offset = getOffset(index);
                    const isActive = offset === 0;
                    const absOffset = Math.abs(offset);

                    return (
                        <motion.div
                            key={index}
                            animate={{
                                x: offset * 220,
                                z: isActive ? 0 : -150 * absOffset,
                                rotateY: offset * -15,
                                scale: isActive ? 1 : 0.75 - absOffset * 0.05,
                                opacity: absOffset > 1 ? 0.3 : 1,
                            }}
                            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            onClick={() => setActiveIndex(index)}
                            className="absolute cursor-pointer"
                            style={{
                                transformStyle: 'preserve-3d',
                                zIndex: 10 - absOffset,
                            }}
                        >
                            <div
                                className="rounded-2xl overflow-hidden transition-shadow duration-500"
                                style={{
                                    width: isActive ? 260 : 200,
                                    background: 'rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(12px)',
                                    border: isActive
                                        ? '2px solid rgba(255,45,117,0.4)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: isActive
                                        ? '0 0 40px rgba(255,45,117,0.3), 0 20px 60px rgba(0,0,0,0.5)'
                                        : '0 8px 30px rgba(0,0,0,0.4)',
                                }}
                            >
                                <div className="p-2">
                                    <div className="overflow-hidden rounded-xl aspect-[3/4] bg-black/30">
                                        <img
                                            src={src}
                                            alt={`Memory ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Caption for active photo */}
            <div className="relative z-10 mt-6 md:mt-8 text-center h-16">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-lg md:text-xl text-white/80 font-serif italic"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            textShadow: '0 0 20px rgba(255,45,117,0.2)',
                        }}
                    >
                        {captions[activeIndex] || `Momen ke-${activeIndex + 1}`}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="relative z-10 mt-4 flex gap-2">
                {photos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className="transition-all duration-300"
                        style={{
                            width: i === activeIndex ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: i === activeIndex
                                ? 'linear-gradient(90deg, #ff2d75, #ff6b9d)'
                                : 'rgba(255, 255, 255, 0.2)',
                            boxShadow: i === activeIndex ? '0 0 10px rgba(255,45,117,0.5)' : 'none',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
