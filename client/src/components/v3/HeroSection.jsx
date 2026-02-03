import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

// Corrected Image Path
const HOME_BG = "/jeffrey-lai-Cz57JO4T0gQ-unsplash.jpg";

const HeroSection = ({ onEnter }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            onEnter();
        }, 600);
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-[#000105]">

            {/* 1. ALIVE BACKGROUND */}
            <motion.div
                animate={{ scale: [1, 1.15, 1], x: [0, -10, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundImage: `url('${HOME_BG}')` }}
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000105]/20 to-[#000105]" />
            </motion.div>

            <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />

            {/* 2. CONTENT - TIGHTENED LAYOUT */}
            <div className="relative z-30 flex flex-col items-center justify-center h-full px-4">

                {/* "The Journey of" - Pulled closer to the title */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    // CHANGED: mb-0 and translate-y-4 to pull it DOWN into the title
                    className="font-montserrat text-xs md:text-sm text-accent/80 mb-0 translate-y-4 tracking-[0.5em] uppercase drop-shadow-lg z-10"
                >
                    The Journey of
                </motion.p>

                {/* "Harmoni" - Negative top margin to pull it UP */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1.2 }}
                    className="font-playfair italic font-medium text-6xl md:text-8xl lg:text-9xl tracking-tight text-white mb-6 drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                >
                    Harmoni
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="font-playfair italic text-white/60 text-lg md:text-2xl mb-20 tracking-wide font-light"
                >
                    a conversation with the soul
                </motion.p>

                {/* 3. LOVE BUTTON (Reduced Size) */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, type: "spring", stiffness: 200 }}
                    onClick={handleClick}
                    className="group relative cursor-pointer outline-none z-50 p-4"
                >
                    <motion.div
                        animate={{ scale: isClicked ? 1.2 : [1, 1.1, 1] }}
                        transition={{ duration: isClicked ? 0.3 : 2, repeat: isClicked ? 0 : Infinity, ease: "easeInOut" }}
                    >
                        <Heart
                            strokeWidth={1.5}
                            size={32} /* Reduced size from 40 to 32 */
                            className={`transition-all duration-500 ease-out
                                ${isClicked
                                    ? "fill-pink-500 text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.9)]"
                                    : "text-white/70 hover:text-pink-300 hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                                }
                            `}
                        />
                    </motion.div>

                    {!isClicked && (
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-montserrat text-[9px] tracking-[0.3em] text-white/30 uppercase transition-opacity whitespace-nowrap">
                            Click to Enter
                        </span>
                    )}
                </motion.button>
            </div>
        </section>
    );
};

export default HeroSection;
