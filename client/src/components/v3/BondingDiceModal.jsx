import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

// Crystal bowl resonance using Web Audio API
const playCrystalBowl = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();

        // Two harmonics for richness
        const freqs = [432, 648]; // fundamental + perfect fifth
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Swell then long decay — crystal bowl feel
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(i === 0 ? 0.18 : 0.08, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

            osc.start(now);
            osc.stop(now + 3.5);
        });
    } catch (e) { }
};

// Celestial particles floating upward
const CelestialParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '167,139,250' : '236,72,153'},${Math.random() * 0.5 + 0.2}) 0%, transparent 70%)`
                }}
                initial={{ top: '100%', opacity: 0 }}
                animate={{
                    top: '-5%',
                    opacity: [0, 0.8, 0.6, 0],
                    scale: [1, 1.5, 1]
                }}
                transition={{
                    duration: Math.random() * 12 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 6,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

// Orbiting rings
const OrbitRing = ({ size, duration, opacity, color }) => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border"
        style={{
            width: size,
            height: size,
            borderColor: color,
            opacity,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}
    />
);

const BondingDiceModal = ({ prompt, onClose }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000105] cursor-auto pointer-events-auto overflow-hidden"
        >
            {/* Ambient Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.15)_0%,_transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.1)_0%,_transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(59,130,246,0.08)_0%,_transparent_40%)] pointer-events-none" />

            {/* Floating Particles */}
            <CelestialParticles />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_300px_120px_rgba(0,0,0,0.9)]" />

            <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-6 z-10">
                <AnimatePresence mode="wait">
                    {!revealed ? (
                        <motion.div
                            key="orb"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => { playCrystalBowl(); setRevealed(true); }}
                        >
                            {/* THE MAGICAL ORB */}
                            <div className="relative w-40 h-40 md:w-56 md:h-56">
                                {/* Outer Glow Rings */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-[-30px] rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-2xl"
                                />

                                {/* Orbiting Rings */}
                                <OrbitRing size="180%" duration={15} opacity={0.15} color="rgba(167,139,250,0.5)" />
                                <OrbitRing size="220%" duration={20} opacity={0.1} color="rgba(236,72,153,0.3)" />
                                <OrbitRing size="260%" duration={25} opacity={0.05} color="rgba(59,130,246,0.3)" />

                                {/* Main Orb */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 opacity-60 blur-xl group-hover:opacity-80 transition-all duration-700" />
                                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/90 via-purple-100 to-pink-100 shadow-[0_0_80px_rgba(255,255,255,0.6),0_0_120px_rgba(167,139,250,0.4)]" />

                                {/* Inner Heart Glow */}
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Heart className="w-12 h-12 text-purple-400/50" fill="currentColor" />
                                </motion.div>
                            </div>

                            {/* Instruction Text - More Visible */}
                            <motion.p
                                className="mt-16 text-white/80 font-playfair italic tracking-widest text-xl"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                            >
                                Touch to connect
                            </motion.p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ y: 40, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                            className="text-center"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mb-8"
                            >
                                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-300 text-[10px] tracking-[0.4em] uppercase">
                                    <Sparkles className="w-3 h-3" />
                                    A Moment of Connection
                                    <Sparkles className="w-3 h-3" />
                                </span>
                            </motion.div>

                            {/* Decorative Line */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 100 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-10"
                            />

                            {/* MAGICAL SPINNING SPHERE AROUND TEXT */}
                            <div className="relative">
                                {/* Orbiting Rings - Different angles and speeds */}
                                <motion.div
                                    animate={{ rotateZ: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-60px] md:inset-[-80px] border border-purple-400/20 rounded-full"
                                    style={{ transform: 'rotateX(70deg)' }}
                                />
                                <motion.div
                                    animate={{ rotateZ: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-40px] md:inset-[-60px] border border-pink-400/15 rounded-full"
                                    style={{ transform: 'rotateX(75deg) rotateY(20deg)' }}
                                />
                                <motion.div
                                    animate={{ rotateZ: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-80px] md:inset-[-100px] border border-blue-400/10 rounded-full"
                                    style={{ transform: 'rotateX(65deg) rotateY(-15deg)' }}
                                />

                                {/* Orbiting Star Points */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-50px] md:inset-[-70px]"
                                >
                                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full blur-[2px] shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                                    <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full blur-[1px] shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-70px] md:inset-[-90px]"
                                >
                                    <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-blue-300 rounded-full blur-[1px] shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                                    <div className="absolute top-1/2 right-0 w-2 h-2 bg-violet-300 rounded-full blur-[2px] shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                                </motion.div>

                                {/* Pulsing Inner Glow */}
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-[-20px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-xl"
                                />

                                {/* The Prompt */}
                                <motion.h3
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="relative font-playfair italic text-3xl md:text-5xl lg:text-6xl text-white/90 leading-relaxed max-w-xl mx-auto py-8"
                                    style={{ textShadow: '0 0 60px rgba(167,139,250,0.4)' }}
                                >
                                    {prompt?.text || "Hold hands and breathe together."}
                                </motion.h3>
                            </div>

                            <div className="h-8" />

                            {/* Continue Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                onClick={onClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative px-12 py-5 rounded-full overflow-hidden"
                            >
                                {/* Button Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 rounded-full border border-purple-400/30 group-hover:border-purple-400/60 transition-all duration-500 backdrop-blur-sm" />

                                {/* Shimmer */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"
                                    animate={{ x: ['-150%', '150%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />

                                <span className="relative font-playfair italic text-lg text-purple-200/80 group-hover:text-purple-100 transition-colors duration-300">
                                    Continue Journey
                                </span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default BondingDiceModal;
