import React from 'react';
import { motion } from 'framer-motion';
import { playClickSound } from '../../utils/clickSound';

const FactsStage = ({ onNext }) => {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[#000105] text-center px-6 overflow-hidden">

            {/* Subtle Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#000105] to-[#000105] pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
                {/* Title */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="font-montserrat text-accent text-[10px] md:text-xs tracking-[0.4em] uppercase mb-12 opacity-80"
                >
                    Before We Begin
                </motion.p>

                {/* FACT 1 */}
                <motion.h2
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="font-playfair text-xl md:text-3xl text-white/90 leading-relaxed mb-8"
                >
                    "Shared vulnerability creates a biological bond<br /> stronger than time."
                </motion.h2>

                {/* FACT 2 */}
                <motion.h2
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 3, duration: 1.5 }}
                    className="font-playfair text-xl md:text-3xl text-white/60 leading-relaxed mb-8 italic"
                >
                    "To be truly known... is to be truly loved."
                </motion.h2>

                {/* FACT 3 */}
                <motion.h2
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 5, duration: 1.5 }}
                    className="font-playfair text-xl md:text-3xl text-white/40 leading-relaxed mb-16"
                >
                    "There are no wrong answers here.<br /> Only truths."
                </motion.h2>

                {/* Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 6.5, duration: 1 }}
                >
                    <button
                        onClick={() => {
                            playClickSound();
                            onNext();
                        }}
                        className="group relative px-10 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all duration-500"
                    >
                        <span className="font-montserrat text-[9px] tracking-[0.3em] text-white uppercase group-hover:tracking-[0.4em] transition-all">
                            Choose Your Path
                        </span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FactsStage;
