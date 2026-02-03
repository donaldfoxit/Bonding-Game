import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Flame, Heart, X } from 'lucide-react';

// Round names for progress display
const roundNames = ["Warm Welcome", "First Glimpses", "Authentic Self", "Heart Space", "Dreams", "Forever", "Compatibility"];

const JourneyInterface = ({ data, onNext, onHome, onBond, actions }) => {
    const {
        currentQuestionData,
        showRiskyQuestion,
        currentRiskyQuestion,
        currentRound = 0,
        questionsAnswered = 0
    } = data;

    // State to delay the "Continue" button (Forced Presence)
    const [canContinue, setCanContinue] = useState(false);

    // Whenever the question changes, lock the button for 2.5 seconds
    useEffect(() => {
        setCanContinue(false);
        const timer = setTimeout(() => setCanContinue(true), 2500);
        return () => clearTimeout(timer);
    }, [currentQuestionData]);

    const questionText = currentQuestionData?.q || "Breathe...";

    // Progress calculation - 7 rounds (0-6), show as percentage
    const progressPercent = Math.min(((currentRound + 1) / 7) * 100, 100);
    const currentRoundName = roundNames[currentRound] || "Journey";

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#000105] flex flex-col items-center justify-center">

            {/* 1. BREATHING BACKGROUND - 10 second pulse */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#000105] to-[#000105]"
            />

            {/* Film grain overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.8)] pointer-events-none z-10" />

            {/* 2. TOP BAR - Home + Progress */}
            <div className="absolute top-8 left-8 right-8 z-50 flex items-center gap-6">
                <button onClick={onHome} className="p-3 text-white/30 hover:text-white transition-colors">
                    <Home size={24} />
                </button>

                {/* Progress Bar */}
                <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-montserrat text-[10px] tracking-[0.3em] text-white/30 uppercase">
                            {currentRoundName}
                        </span>
                        <span className="font-montserrat text-[10px] text-white/20">
                            {questionsAnswered} answered
                        </span>
                    </div>
                    <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT - Question + Buttons together */}
            <div className="relative z-20 max-w-4xl px-8 text-center flex flex-col items-center">

                {/* Cinematic Blur-In Text Animation */}
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

                {/* BUTTONS - Risk + Continue side by side */}
                <motion.div
                    className="mt-16 flex items-center gap-6"
                    animate={{
                        opacity: canContinue ? 1 : 0,
                        y: canContinue ? 0 : 20
                    }}
                    transition={{ duration: 1 }}
                >
                    {/* Risk Button */}
                    <motion.button
                        onClick={() => actions.handleDareToRisk()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!canContinue}
                        className="flex items-center gap-2 px-6 py-4 bg-red-950/30 border border-red-500/40 rounded-full hover:bg-red-950/50 hover:border-red-500/60 transition-all shadow-[0_0_25px_rgba(220,38,38,0.15)]"
                    >
                        <Flame className="text-red-400" size={18} />
                        <span className="font-montserrat text-sm font-medium tracking-widest text-red-200 uppercase">
                            Risk
                        </span>
                    </motion.button>

                    {/* Continue Button - Primary */}
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

            {/* 5. RISK MODAL - Casino Card Flip Style */}
            <AnimatePresence>
                {showRiskyQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
                        onClick={() => actions.setShowRiskyQuestion(false)}
                    >
                        {/* Casino Card */}
                        <motion.div
                            initial={{ rotateY: 180, scale: 0.8 }}
                            animate={{ rotateY: 0, scale: 1 }}
                            exit={{ rotateY: -180, scale: 0.8 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                duration: 0.6
                            }}
                            style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                            className="relative w-[340px] md:w-[400px] aspect-[3/4] cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Card Face */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2a0a0a] via-[#1a0505] to-[#0d0202] border-2 border-red-900/60 shadow-[0_0_60px_rgba(220,38,38,0.25),inset_0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">

                                {/* Corner decorations */}
                                <div className="absolute top-4 left-4 text-red-600/40 text-2xl">♠</div>
                                <div className="absolute top-4 right-4 text-red-600/40 text-2xl">♥</div>
                                <div className="absolute bottom-4 left-4 text-red-600/40 text-2xl rotate-180">♦</div>
                                <div className="absolute bottom-4 right-4 text-red-600/40 text-2xl rotate-180">♣</div>

                                {/* Card inner border */}
                                <div className="absolute inset-6 border border-red-900/30 rounded-lg" />

                                {/* Content */}
                                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                                    <Flame className="text-red-500 mb-4 animate-pulse" size={36} />

                                    <p className="font-montserrat text-[10px] tracking-[0.4em] text-red-400/60 uppercase mb-6">
                                        High Stakes
                                    </p>

                                    <p className="font-playfair text-xl md:text-2xl text-white/90 leading-relaxed mb-8 italic">
                                        "{currentRiskyQuestion?.q || "What is a truth you've never shared?"}"
                                    </p>

                                    <motion.button
                                        onClick={() => actions.setShowRiskyQuestion(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
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
