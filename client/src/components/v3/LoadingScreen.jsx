import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
    "Silence your phones...",
    "Face each other...",
    "Leave the outside world behind...",
    "You're about to go somewhere real...",
    "Open your heart.",
    "Be here. Fully.",
];

const LoadingScreen = ({ onComplete }) => {
    const [count, setCount] = useState(0);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const duration = 2500;
        const intervalTime = duration / 100;
        const timer = setInterval(() => {
            setCount(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 600);
                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);
        return () => clearInterval(timer);
    }, [onComplete]);

    // Rotate quote every ~600ms
    useEffect(() => {
        const q = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % QUOTES.length);
        }, 600);
        return () => clearInterval(q);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-[#000105] flex flex-col items-center justify-center text-white overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,102,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                            opacity: 0
                        }}
                        animate={{ y: [null, -100], opacity: [0, 0.6, 0] }}
                        transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2, ease: "easeOut" }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-10">
                {/* Giant counter */}
                <motion.h1
                    className="font-playfair text-[10rem] md:text-[14rem] leading-none font-thin tracking-tighter text-white/10"
                    animate={{ opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {count.toString().padStart(2, '0')}
                </motion.h1>

                {/* Rotating cinematic quotes */}
                <div className="h-8 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={quoteIndex}
                            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="font-playfair italic text-base md:text-lg text-white/40 tracking-wide"
                        >
                            {QUOTES[quoteIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress line at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                <motion.div
                    className="h-full bg-gradient-to-r from-accent/50 via-accent to-accent/50"
                    initial={{ width: "0%" }}
                    animate={{ width: `${count}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
