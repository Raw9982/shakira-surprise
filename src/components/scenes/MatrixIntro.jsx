"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ScrambleText({ text, delay = 0, speed = 40 }) {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオ0123456789!@#$%♡♥❤';

    useEffect(() => {
        const timeout = setTimeout(() => {
            let iteration = 0;
            const maxIter = text.length * 3;
            const interval = setInterval(() => {
                setDisplay(
                    text.split('').map((ch, i) =>
                        i < iteration / 3 ? ch : chars[Math.floor(Math.random() * chars.length)]
                    ).join('')
                );
                iteration++;
                if (iteration >= maxIter) { setDisplay(text); clearInterval(interval); }
            }, speed);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, delay, speed]);

    return <>{display || '\u00A0'.repeat(text.length)}</>;
}

export default function MatrixIntro({ name, introTitle }) {
    const canvasRef = useRef(null);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 1200);
        const t2 = setTimeout(() => setPhase(2), 2200);
        const t3 = setTimeout(() => setPhase(3), 3800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        setSize();
        window.addEventListener('resize', setSize);

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ0123456789♡♥❤.:;!?".split("");
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = Array(columns).fill(0).map(() => ({
            y: Math.random() * -100, speed: Math.random() * 0.5 + 0.4,
        }));

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px 'Courier New', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i].y * fontSize;
                const b = Math.random();

                if (b > 0.96) ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                else if (b > 0.8) ctx.fillStyle = `rgba(255, 45, 117, ${Math.random() * 0.4 + 0.6})`;
                else if (b > 0.5) ctx.fillStyle = `rgba(255, 100, 150, ${Math.random() * 0.3 + 0.15})`;
                else ctx.fillStyle = `rgba(255, 45, 117, ${Math.random() * 0.15 + 0.05})`;

                ctx.fillText(text, x, y);
                if (drops[i].y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i].y = 0; drops[i].speed = Math.random() * 0.5 + 0.4;
                }
                drops[i].y += drops[i].speed;
            }
        };

        const interval = setInterval(draw, 33);
        return () => { clearInterval(interval); window.removeEventListener('resize', setSize); };
    }, []);

    return (
        <div className="fixed inset-0 bg-black z-40 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />
            <div className="absolute inset-0 z-5 pointer-events-none opacity-[0.03]"
                style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}
            />
            <div className="absolute inset-0 z-5 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
            />

            <div className="relative z-10 flex h-full items-center justify-center">
                <AnimatePresence>
                    {phase >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            {/* Terminal-style status line */}
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 0.4, width: 'auto' }}
                                transition={{ delay: 0, duration: 0.5 }}
                                className="text-[10px] font-mono text-green-400/50 tracking-widest mb-4 overflow-hidden whitespace-nowrap"
                            >
                                &gt; ESTABLISHING CONNECTION...
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 0.7, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-sm md:text-base tracking-[0.5em] uppercase mb-5 text-pink-300/80 font-light"
                            >
                                <ScrambleText text={introTitle || "FOR YOU"} delay={300} speed={50} />
                            </motion.p>

                            {phase >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative"
                                >
                                    {/* Glitch layers */}
                                    <motion.h1
                                        animate={{
                                            x: [0, -3, 0, 2, 0],
                                            opacity: [1, 0.8, 1, 0.9, 1],
                                        }}
                                        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
                                        className="absolute inset-0 text-6xl md:text-9xl font-black tracking-wider select-none pointer-events-none"
                                        style={{
                                            color: '#00ffff',
                                            textShadow: '0 0 10px #00ffff',
                                            clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                                            mixBlendMode: 'screen',
                                        }}
                                        aria-hidden="true"
                                    >
                                        <ScrambleText text={name.toUpperCase()} delay={0} speed={35} />
                                    </motion.h1>
                                    <motion.h1
                                        animate={{
                                            x: [0, 3, 0, -2, 0],
                                            opacity: [1, 0.7, 1, 0.85, 1],
                                        }}
                                        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }}
                                        className="absolute inset-0 text-6xl md:text-9xl font-black tracking-wider select-none pointer-events-none"
                                        style={{
                                            color: '#ff0040',
                                            textShadow: '0 0 10px #ff0040',
                                            clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                                            mixBlendMode: 'screen',
                                        }}
                                        aria-hidden="true"
                                    >
                                        <ScrambleText text={name.toUpperCase()} delay={0} speed={35} />
                                    </motion.h1>
                                    {/* Main name */}
                                    <h1
                                        className="text-6xl md:text-9xl font-black tracking-wider relative"
                                        style={{
                                            color: '#ff2d75',
                                            textShadow: '0 0 20px #ff2d75, 0 0 40px #ff2d75, 0 0 80px #ff2d75, 0 0 120px rgba(255,45,117,0.3)',
                                        }}
                                    >
                                        <ScrambleText text={name.toUpperCase()} delay={0} speed={35} />
                                    </h1>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
                                className="mt-5 h-[2px] w-40 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
                            />

                            {/* ACCESS GRANTED after decode */}
                            {phase >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mt-5 flex items-center gap-2"
                                >
                                    <motion.div
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-2 h-2 rounded-full bg-green-400"
                                    />
                                    <span className="text-[11px] font-mono tracking-[0.3em] text-green-400/70 uppercase">
                                        Access Granted — Message Decrypted
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
