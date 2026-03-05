import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const CelestialParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    background: `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`,
                    filter: 'blur(0.5px)',
                }}
                initial={{ top: '110%', opacity: 0 }}
                animate={{ top: '-10%', opacity: [0, 0.6, 0] }}
                transition={{
                    duration: Math.random() * 14 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 6,
                    ease: 'linear',
                }}
            />
        ))}
    </div>
);

// Compute a fun "depth score" from game stats
const computeDepthScore = (questionsAnswered, bondsTriggered, risksUsed) => {
    const base = Math.min(questionsAnswered * 1.5, 60);
    const bondBonus = Math.min(bondsTriggered * 5, 20);
    const riskBonus = Math.min(risksUsed * 4, 20);
    return Math.min(Math.round(base + bondBonus + riskBonus), 100);
};

const getDepthLabel = (score) => {
    if (score >= 80) return { label: "Soul Level", color: "text-violet-300" };
    if (score >= 60) return { label: "Heart Level", color: "text-pink-300" };
    if (score >= 40) return { label: "Meaningful", color: "text-indigo-300" };
    return { label: "A Beautiful Start", color: "text-blue-300" };
};

const CompletionScreen = ({ data, onRestart }) => {
    const {
        partner1Name,
        partner2Name,
        questionsAnswered = 0,
    } = data;

    // Estimate bonds/risks from questionsAnswered (actual counts not tracked yet — simple estimate)
    const bondsTriggered = Math.floor(questionsAnswered / 5);
    const risksUsed = Math.floor(questionsAnswered / 8);
    const depthScore = computeDepthScore(questionsAnswered, bondsTriggered, risksUsed);
    const { label, color } = getDepthLabel(depthScore);

    const namesDisplay = (partner1Name || partner2Name)
        ? `${partner1Name || 'Partner 1'} & ${partner2Name || 'Partner 2'}`
        : null;

    // Play soft chime on arrival
    useEffect(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const freqs = [523.25, 659.25, 783.99, 1046.5]; // C chord
            freqs.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime + i * 0.12;
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
                osc.start(now);
                osc.stop(now + 2.2);
            });
        } catch (e) { }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative h-screen w-full overflow-hidden bg-[#000105] flex flex-col items-center justify-center"
        >
            {/* Ambient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.12)_0%,_transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(236,72,153,0.08)_0%,_transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_250px_100px_rgba(0,0,0,0.85)] pointer-events-none" />
            <CelestialParticles />

            <div className="relative z-10 flex flex-col items-center text-center max-w-lg px-8">
                {/* Top ornament */}
                <motion.div
                    initial={{ width: 0 }} animate={{ width: 64 }} transition={{ delay: 0.5, duration: 1 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12"
                />

                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="font-montserrat text-[10px] tracking-[0.5em] text-white/30 uppercase mb-6"
                >
                    Journey Complete
                </motion.p>

                {namesDisplay && (
                    <motion.h1
                        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ delay: 1, duration: 1 }}
                        className="font-playfair italic text-3xl md:text-4xl text-white/90 mb-3"
                        style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}
                    >
                        {namesDisplay}
                    </motion.h1>
                )}

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="font-playfair italic text-xl text-white/50 mb-14 leading-relaxed"
                >
                    "You showed up for each other."
                </motion.p>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="flex gap-10 mb-14"
                >
                    {[
                        { val: questionsAnswered, label: 'Questions' },
                        { val: bondsTriggered, label: 'Bonds' },
                        { val: risksUsed, label: 'Risks Taken' },
                    ].map(({ val, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                            <span className="font-playfair text-4xl text-white/80">{val}</span>
                            <span className="font-montserrat text-[9px] tracking-[0.3em] text-white/25 uppercase">{label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Depth Score */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2, type: 'spring', stiffness: 80 }}
                    className="mb-14 px-10 py-6 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-sm"
                >
                    <p className="font-montserrat text-[9px] tracking-[0.4em] text-white/25 uppercase mb-2">Depth Score</p>
                    <p className={`font-playfair text-5xl font-light mb-1 ${color}`}>{depthScore}</p>
                    <p className={`font-playfair italic text-sm ${color} opacity-70`}>{label}</p>
                </motion.div>

                {/* Restart */}
                <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
                    onClick={onRestart}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="group relative px-12 py-4 rounded-full overflow-hidden"
                >
                    <div className="absolute inset-0 border border-white/15 rounded-full group-hover:border-white/35 bg-white/5 group-hover:bg-white/10 transition-all duration-500 backdrop-blur-sm" />
                    <span className="relative font-montserrat text-sm tracking-widest text-white/60 group-hover:text-white/90 uppercase transition-colors">
                        Journey Again
                    </span>
                </motion.button>

                {/* Bottom ornament */}
                <motion.div
                    initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 3, duration: 1 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent mt-14"
                />
            </div>
        </motion.div>
    );
};

export default CompletionScreen;
