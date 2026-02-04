import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playClickSound, playChimeSound } from '../../utils/clickSound';

// Floating ethereal particles - Subtle
const DreamParticles = () => {
    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 12 + 10
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-white/25"
                    style={{
                        left: p.x,
                        width: p.size,
                        height: p.size,
                        filter: 'blur(0.5px)'
                    }}
                    initial={{ top: '110%', opacity: 0 }}
                    animate={{
                        top: '-10%',
                        opacity: [0, 0.5, 0.4, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear'
                    }}
                />
            ))}
        </div>
    );
};

const RulesStage = ({ onConfirm }) => {
    const [partner1Clicked, setPartner1Clicked] = useState(false);
    const [partner2Clicked, setPartner2Clicked] = useState(false);

    // Play audio 0.5s after screen appears
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const audio = new Audio('/rules-audio.mp3');
            audio.volume = 0.7;
            audio.play().catch(() => {
                console.log('Rules audio blocked by browser');
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handlePartner1Click = () => {
        playClickSound();
        setPartner1Clicked(true);
        if (partner2Clicked) {
            // Play chime and agreed voice
            playChimeSound();
            const audio = new Audio('/agreed-voice.mp3');
            audio.volume = 0.8;
            audio.play().catch(() => console.log('Agreed audio blocked'));
            setTimeout(() => onConfirm(), 800);
        }
    };

    const handlePartner2Click = () => {
        playClickSound();
        setPartner2Clicked(true);
        if (partner1Clicked) {
            // Play chime and agreed voice
            playChimeSound();
            const audio = new Audio('/agreed-voice.mp3');
            audio.volume = 0.8;
            audio.play().catch(() => console.log('Agreed audio blocked'));
            setTimeout(() => onConfirm(), 800);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full min-h-screen z-50 flex flex-col items-center justify-center text-center p-8 bg-[#000105] overflow-hidden"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.06)_0%,_transparent_60%)] pointer-events-none" />

            {/* Particles */}
            <DreamParticles />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.9)]" />

            {/* Content */}
            <motion.div className="relative z-10 max-w-xl">
                {/* Decorative Line */}
                <motion.div
                    className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-12"
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                />

                {/* Title */}
                <motion.h2
                    className="font-playfair italic text-4xl md:text-5xl text-white/90 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}
                >
                    Before We Begin
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    className="font-montserrat text-xs tracking-[0.4em] text-accent/70 uppercase mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    A Sacred Agreement
                </motion.p>

                {/* Body Text */}
                <motion.div
                    className="space-y-6 mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <p className="font-playfair text-xl md:text-2xl text-white/60 leading-relaxed italic">
                        "This is a space for truth, vulnerability, and presence."
                    </p>
                    <p className="font-montserrat text-sm md:text-base text-white/40 leading-relaxed max-w-lg mx-auto">
                        What you share here stays between souls.
                        <br />Be honest. Be open. Be kind.
                    </p>
                </motion.div>

                {/* Two "I Understand" Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="flex flex-col items-center"
                >
                    <p className="text-white/30 text-xs font-montserrat tracking-wide mb-6">
                        Both partners must agree to continue
                    </p>
                    <div className="flex gap-4 md:gap-6">
                        {/* Partner 1 Button */}
                        <motion.button
                            onClick={handlePartner1Click}
                            disabled={partner1Clicked}
                            whileHover={!partner1Clicked ? { scale: 1.02 } : {}}
                            whileTap={!partner1Clicked ? { scale: 0.98 } : {}}
                            className={`group relative px-8 md:px-10 py-4 overflow-hidden transition-all duration-500 ${partner1Clicked ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <div className={`absolute inset-0 border rounded-full transition-all duration-500 ${partner1Clicked
                                ? 'border-green-400/50 bg-green-400/10'
                                : 'border-white/20 group-hover:border-white/40'
                                }`} />
                            <span className={`relative font-playfair italic text-base md:text-lg transition-colors duration-300 ${partner1Clicked ? 'text-green-400/80' : 'text-white/70 group-hover:text-white'
                                }`}>
                                {partner1Clicked ? '✓ Agreed' : 'I Understand'}
                            </span>
                        </motion.button>

                        {/* Partner 2 Button - Pink for woman */}
                        <motion.button
                            onClick={handlePartner2Click}
                            disabled={partner2Clicked}
                            whileHover={!partner2Clicked ? { scale: 1.02 } : {}}
                            whileTap={!partner2Clicked ? { scale: 0.98 } : {}}
                            className={`group relative px-8 md:px-10 py-4 overflow-hidden transition-all duration-500 ${partner2Clicked ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <div className={`absolute inset-0 border rounded-full transition-all duration-500 ${partner2Clicked
                                ? 'border-pink-400/50 bg-pink-400/10'
                                : 'border-white/20 group-hover:border-white/40'
                                }`} />
                            <span className={`relative font-playfair italic text-base md:text-lg transition-colors duration-300 ${partner2Clicked ? 'text-pink-400/80' : 'text-white/70 group-hover:text-white'
                                }`}>
                                {partner2Clicked ? '✓ Agreed' : 'I Understand'}
                            </span>
                        </motion.button>
                    </div>

                    {/* Progress indicator */}
                    {(partner1Clicked || partner2Clicked) && !(partner1Clicked && partner2Clicked) && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-accent/50 text-xs font-montserrat mt-6"
                        >
                            Waiting for partner...
                        </motion.p>
                    )}
                </motion.div>

                {/* Decorative Line Bottom */}
                <motion.div
                    className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-16"
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                />
            </motion.div>
        </motion.section>
    );
};

export default RulesStage;
