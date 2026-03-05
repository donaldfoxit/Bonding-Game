import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playClickSound } from '../../utils/clickSound';

// Quotes scattered at intentional positions across the screen
const QUOTES = [
    {
        text: '"Shared vulnerability creates a bond stronger than time."',
        pos: 'top-[14%] left-[8%] md:left-[12%] max-w-[55%] md:max-w-xs',
        align: 'text-left',
        delay: 0.5,
        size: 'text-lg md:text-xl',
        opacity: 'text-white/80',
    },
    {
        text: '"To be truly known... is to be truly loved."',
        pos: 'top-[44%] right-[6%] md:right-[12%] max-w-[55%] md:max-w-xs',
        align: 'text-right',
        delay: 2.2,
        size: 'text-base md:text-lg',
        opacity: 'text-white/55',
    },
    {
        text: '"There are no wrong answers here. Only truths."',
        pos: 'bottom-[18%] left-[6%] md:left-[12%] max-w-[55%] md:max-w-xs',
        align: 'text-left',
        delay: 3.8,
        size: 'text-sm md:text-base',
        opacity: 'text-white/35',
    },
];

const FactsStage = ({ onNext }) => {
    const [btnVisible, setBtnVisible] = useState(false);

    return (
        <section className="relative h-screen w-full bg-[#000105] overflow-hidden">
            {/* Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#000105] to-[#000105] pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.7)] pointer-events-none" />

            {/* Scattered quotes */}
            {QUOTES.map((q, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${q.pos}`}
                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ delay: q.delay, duration: 1.6 }}
                    onAnimationComplete={() => {
                        if (i === QUOTES.length - 1) {
                            setTimeout(() => setBtnVisible(true), 800);
                        }
                    }}
                >
                    <p className={`font-playfair italic leading-relaxed ${q.size} ${q.opacity} ${q.align}`}>
                        {q.text}
                    </p>
                </motion.div>
            ))}

            {/* Quotes linger as ghostly backdrop after button appears */}
            {btnVisible && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ duration: 2 }}
                />
            )}

            {/* Center CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: btnVisible ? 1 : 0, y: btnVisible ? 0 : 20 }}
                    transition={{ duration: 0.9 }}
                >
                    <motion.p
                        className="font-montserrat text-[10px] tracking-[0.45em] text-white/30 uppercase mb-8 text-center"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        You're ready
                    </motion.p>

                    <button
                        onClick={() => {
                            playClickSound();
                            onNext();
                        }}
                        className="group relative px-14 py-5 rounded-full overflow-hidden"
                    >
                        <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/40 transition-all duration-500 bg-white/5 group-hover:bg-white/10 backdrop-blur-sm" />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-full"
                            animate={{ x: ['-150%', '150%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        <span className="relative font-playfair italic text-xl text-white/80 group-hover:text-white transition-colors">
                            Choose Your Path
                        </span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FactsStage;
