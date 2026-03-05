import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Flame } from 'lucide-react';

const roundNames = ["Warm Welcome", "First Glimpses", "Authentic Self", "Heart Space", "Dreams", "Forever", "Compatibility"];

// Progress bar color shifts as journey deepens
const roundGradients = [
    'from-amber-400/60 to-yellow-300/60',       // 0: Warm Welcome - gold
    'from-amber-300/60 to-orange-300/60',        // 1: First Glimpses - warm amber
    'from-purple-400/60 to-indigo-400/60',       // 2: Authentic Self - lavender
    'from-indigo-500/60 to-violet-500/60',       // 3: Heart Space - violet
    'from-violet-600/60 to-purple-600/60',       // 4: Dreams - deep violet
    'from-fuchsia-600/60 to-purple-700/60',      // 5: Forever - deep purple
    'from-pink-500/60 to-rose-500/60',           // 6: Compatibility - rose
];

// Depth dots — shown next to round name
const DepthDots = ({ depth = 2 }) => (
    <div className="flex gap-1 items-center">
        {[1, 2, 3].map(d => (
            <div
                key={d}
                className={`rounded-full transition-all duration-500 ${d <= depth
                    ? 'w-1.5 h-1.5 bg-white/60'
                    : 'w-1 h-1 bg-white/15'
                    }`}
            />
        ))}
    </div>
);

const JourneyInterface = ({ data, onNext, onHome, onBond, actions }) => {
    const {
        currentQuestionData,
        showRiskyQuestion,
        currentRiskyQuestion,
        currentRound = 0,
        questionsAnswered = 0,
        totalQuestions = 1,
        partner1Name,
        partner2Name,
        riskCooldown = 0,
    } = data;

    const [canContinue, setCanContinue] = useState(false);
    const [showBreathe, setShowBreathe] = useState(false);
    const [lastRound, setLastRound] = useState(currentRound);

    // Detect round change → show breathe screen
    useEffect(() => {
        if (currentRound !== lastRound) {
            setShowBreathe(true);
            setLastRound(currentRound);
            const t = setTimeout(() => setShowBreathe(false), 3500);
            return () => clearTimeout(t);
        }
    }, [currentRound, lastRound]);

    // 2.5s presence lock on each new question
    useEffect(() => {
        setCanContinue(false);
        const timer = setTimeout(() => setCanContinue(true), 2500);
        return () => clearTimeout(timer);
    }, [currentQuestionData]);

    const questionText = currentQuestionData?.q || "Breathe...";
    const questionDepth = currentQuestionData?.depth || 2;
    const progressPercent = totalQuestions > 0 ? Math.min((questionsAnswered / totalQuestions) * 100, 100) : 0;
    const currentRoundName = roundNames[currentRound] || "Journey";
    const barGradient = roundGradients[currentRound] || roundGradients[0];
    const riskOnCooldown = riskCooldown > 0;

    // Names label
    const namesLabel = (partner1Name || partner2Name)
        ? `${partner1Name || 'Partner 1'} & ${partner2Name || 'Partner 2'}`
        : currentRoundName;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#000105] flex flex-col items-center justify-center">

            {/* Breathing radial bg */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#000105] to-[#000105]"
            />

            {/* Film grain */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.8)] pointer-events-none z-10" />

            {/* TOP BAR */}
            <div className="absolute top-8 left-8 right-8 z-50 flex items-center gap-6">
                <button onClick={onHome} className="p-3 text-white/30 hover:text-white transition-colors">
                    <Home size={24} />
                </button>

                <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-montserrat text-[10px] tracking-[0.3em] text-white/30 uppercase">
                                {namesLabel}
                            </span>
                            <DepthDots depth={questionDepth} />
                        </div>
                        <span className="font-montserrat text-[10px] text-white/20">
                            {questionsAnswered} / {totalQuestions}
                        </span>
                    </div>
                    {/* Color-shifting progress bar */}
                    <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full bg-gradient-to-r ${barGradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                    {/* Round name below bar */}
                    <motion.p
                        key={currentRoundName}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="font-montserrat text-[9px] tracking-[0.25em] text-white/20 uppercase mt-1"
                    >
                        {currentRoundName}
                    </motion.p>
                </div>
            </div>

            {/* BREATHE INTERSTITIAL */}
            <AnimatePresence>
                {showBreathe && (
                    <motion.div
                        key="breathe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[#000105]"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            className="w-24 h-24 rounded-full border border-white/10 mb-10"
                        />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="font-playfair italic text-2xl text-white/50"
                        >
                            Take a breath.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                            className="font-montserrat text-[10px] tracking-[0.4em] text-white/20 uppercase mt-3"
                        >
                            {currentRoundName}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <div className="relative z-20 max-w-4xl px-8 text-center flex flex-col items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={questionText}
                        initial={{ opacity: 0, filter: "blur(12px)", y: 15 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        exit={{ opacity: 0, filter: "blur(12px)", y: -15 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <p className="font-montserrat text-xs text-white/40 tracking-[0.4em] uppercase mb-8">
                            Reflect Together
                        </p>
                        <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-white/90 leading-tight">
                            "{questionText}"
                        </h1>
                    </motion.div>
                </AnimatePresence>

                {/* BUTTONS */}
                <motion.div
                    className="mt-16 flex items-center gap-6"
                    animate={{ opacity: canContinue ? 1 : 0, y: canContinue ? 0 : 20 }}
                    transition={{ duration: 1 }}
                >
                    {/* Risk Button — dims on cooldown */}
                    <motion.button
                        onClick={() => !riskOnCooldown && actions.handleDareToRisk()}
                        whileHover={!riskOnCooldown ? { scale: 1.05 } : {}}
                        whileTap={!riskOnCooldown ? { scale: 0.95 } : {}}
                        disabled={!canContinue || riskOnCooldown}
                        title={riskOnCooldown ? `Available in ${riskCooldown} question${riskCooldown > 1 ? 's' : ''}` : 'Risk It'}
                        className={`relative flex items-center gap-2 px-6 py-4 rounded-full border transition-all
                            ${riskOnCooldown
                                ? 'bg-red-950/10 border-red-500/15 opacity-30 cursor-not-allowed'
                                : 'bg-red-950/30 border-red-500/40 hover:bg-red-950/50 hover:border-red-500/60 shadow-[0_0_25px_rgba(220,38,38,0.15)]'
                            }`}
                    >
                        <Flame className="text-red-400" size={18} />
                        <span className="font-montserrat text-sm font-medium tracking-widest text-red-200 uppercase">
                            {riskOnCooldown ? `${riskCooldown}` : 'Risk'}
                        </span>
                    </motion.button>

                    {/* Continue */}
                    <motion.button
                        onClick={onNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!canContinue}
                        className="px-12 py-4 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
                    >
                        <span className="font-montserrat text-base font-medium tracking-wider text-white/90">
                            Continue
                        </span>
                    </motion.button>
                </motion.div>
            </div>

            {/* RISK MODAL */}
            <AnimatePresence>
                {showRiskyQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
                        onClick={() => actions.setShowRiskyQuestion(false)}
                    >
                        <motion.div
                            initial={{ rotateY: 180, scale: 0.8 }}
                            animate={{ rotateY: 0, scale: 1 }}
                            exit={{ rotateY: -180, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                            className="relative w-[340px] md:w-[400px] aspect-[3/4] cursor-pointer"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2a0a0a] via-[#1a0505] to-[#0d0202] border-2 border-red-900/60 shadow-[0_0_60px_rgba(220,38,38,0.25),inset_0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
                                <div className="absolute top-4 left-4 text-red-600/40 text-2xl">♠</div>
                                <div className="absolute top-4 right-4 text-red-600/40 text-2xl">♥</div>
                                <div className="absolute bottom-4 left-4 text-red-600/40 text-2xl rotate-180">♦</div>
                                <div className="absolute bottom-4 right-4 text-red-600/40 text-2xl rotate-180">♣</div>
                                <div className="absolute inset-6 border border-red-900/30 rounded-lg" />
                                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                                    <Flame className="text-red-500 mb-4 animate-pulse" size={36} />
                                    <p className="font-montserrat text-[10px] tracking-[0.4em] text-red-400/60 uppercase mb-6">High Stakes</p>
                                    <p className="font-playfair text-xl md:text-2xl text-white/90 leading-relaxed mb-8 italic">
                                        "{currentRiskyQuestion?.q || "What is a truth you've never shared?"}"
                                    </p>
                                    <motion.button
                                        onClick={() => actions.setShowRiskyQuestion(false)}
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-red-900/30 border border-red-700/50 text-red-200 hover:bg-red-900/50 transition-all uppercase tracking-[0.2em] text-xs rounded-full font-montserrat"
                                    >
                                        Accept
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JourneyInterface;
