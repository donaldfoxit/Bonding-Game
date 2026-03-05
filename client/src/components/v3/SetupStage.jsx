import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { playClickSound } from '../../utils/clickSound';

const SetupStage = ({ destinations, onSelectDest, onSelectTime, onInitiate }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDestId, setSelectedDestId] = useState(null);

    const handleDestSelect = (dest) => {
        playClickSound();
        setSelectedDestId(dest.id);
        onSelectDest(dest);
    };

    const handleTimeSelect = (time) => {
        playClickSound();
        setSelectedTime(time);
        onSelectTime(time);
    };

    // Helper: Check if the selected card is the active one
    const isMainSelected = selectedDestId === 'main';

    return (
        <motion.div>
            <div className="relative min-h-screen py-4 bg-[#000105] flex flex-col items-center justify-center">

                {/* Header */}
                <div className="text-center mb-6">
                    <p className="text-accent font-montserrat text-[10px] tracking-[0.4em] uppercase mb-2 opacity-80">Step Into The</p>
                    <h2 className="text-4xl md:text-5xl font-playfair text-white">Choice</h2>
                </div>

                {/* CARD GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl px-4 w-full mb-8">
                    {destinations.map((dest, index) => {
                        const isSelected = selectedDestId === dest.id;
                        const isLocked = dest.id !== 'main'; // Only 'main' is unlocked

                        return (
                            <motion.div
                                key={dest.id}
                                onClick={() => handleDestSelect(dest)}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                                    relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ease-out border 
                                    h-36 md:h-44 /* Slightly taller for better reading */
                                    ${isSelected
                                        ? 'border-blue-500/50 ring-1 ring-blue-500 scale-[1.02] z-20 shadow-[0_0_30px_rgba(59,130,246,0.2)] grayscale-0'
                                        : 'border-white/10 grayscale brightness-75 hover:grayscale-0 hover:brightness-100 hover:scale-[1.02] z-10'
                                    }
                                `}
                            >
                                {/* Background Image */}
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay - Darker at bottom for text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                                {/* Lock Icon Overlay for Inactive Cards */}
                                {isLocked && (
                                    <div className="absolute top-3 right-3 text-white/30 group-hover:text-white/80 transition-colors">
                                        <Lock size={14} />
                                    </div>
                                )}

                                {/* Content - Slides up slightly on hover to show more text */}
                                <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-playfair text-lg md:text-xl text-white mb-1 leading-none drop-shadow-md">
                                        {dest.name}
                                    </h3>
                                    {/* Increased text size for readability */}
                                    <p className="font-montserrat text-[10px] md:text-[11px] text-gray-300 line-clamp-2 leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
                                        {dest.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CONTROLS AREA */}
                <div className="w-full flex flex-col justify-center items-center gap-6">

                    {/* Time Selection */}
                    <div className="flex gap-3">
                        {[10, 20, 30].map(time => (
                            <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`
                                px-6 py-2 border transition-all font-montserrat tracking-widest text-[10px] uppercase rounded-sm
                                ${selectedTime === time
                                        ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(0,102,255,0.5)] scale-105'
                                        : 'border-white/20 text-white/50 hover:border-white hover:text-white bg-black/50'}
                            `}
                            >
                                {time} MIN
                            </button>
                        ))}
                    </div>

                    {/* MAIN ACTION BUTTON */}
                    {/* Disables if no selection OR if a locked card is selected */}
                    <button
                        onClick={() => {
                            playClickSound();
                            onInitiate();
                        }}
                        disabled={!selectedTime || !selectedDestId || !isMainSelected}
                        className={`
                            px-12 py-4 font-bold tracking-[0.3em] text-[10px] uppercase transition-all duration-500 rounded-full border
                            ${(!selectedTime || !selectedDestId)
                                ? 'opacity-30 border-white/10 text-white cursor-not-allowed' // No selection
                                : !isMainSelected
                                    ? 'opacity-50 border-white/20 text-white cursor-not-allowed bg-white/5' // Locked selection
                                    : 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] cursor-pointer' // Active
                            }
                        `}
                    >
                        {/* Dynamic Text Logic */}
                        {!selectedDestId ? "SELECT A PATH" :
                            !selectedTime ? "SELECT DURATION" :
                                !isMainSelected ? "COMING SOON" : "INITIATE JOURNEY"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SetupStage;
