import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHarmoniController } from './hooks/useHarmoniController';
import { YouTubePlayer } from './components/audio/YouTubePlayer';
import { Play, Home } from 'lucide-react';

// COMPONENTS
import HeroSection from "./components/v3/HeroSection";
import RulesStage from "./components/v3/RulesStage";
import FactsStage from "./components/v3/FactsStage"; // <--- NEW IMPORT
import SetupStage from "./components/v3/SetupStage";
import JourneyInterface from "./components/v3/JourneyInterface";
import BondingDiceModal from "./components/v3/BondingDiceModal";
import LoadingScreen from "./components/v3/LoadingScreen";
import AffirmationStage from "./components/v3/AffirmationStage";
import NoiseOverlay from "./components/effects/NoiseOverlay";

const GlowBorder = () => (
  <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] opacity-80" />
);

export default function App() {
  // PHASE 1: START SCREEN -> LOADING -> RUNNING
  const [appPhase, setAppPhase] = useState('start');

  // PHASE 2: VIEW MANAGER ('hero' -> 'rules' -> 'facts' -> 'setup' ...)
  const [view, setView] = useState('hero');

  const { gameState: state, actions, data } = useHarmoniController();

  // Sync internal game stage with view
  useEffect(() => {
    if (state.stage === 'journey') setView('journey');
    if (state.stage === 'complete') setView('complete');
    if (state.stage === 'welcome' && view === 'journey') setView('hero');
  }, [state.stage, view]);

  const combinedState = { ...state, destinations: data.destinations };

  // Page Transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } }
  };

  return (
    <>
      <div className="main-container relative w-full h-screen overflow-hidden bg-[#000105]">
        <GlowBorder />
        <NoiseOverlay opacity={0.04} />

        {/* GLOBAL HOME BUTTON - Shows on all pages except start and hero */}
        {appPhase === 'running' && view !== 'hero' && (
          <button
            onClick={() => {
              actions.setAudioPlaying(false);
              actions.setStage('welcome');
              setView('hero');
            }}
            className="fixed top-6 left-6 z-[9999] p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 group"
            title="Return Home"
          >
            <Home className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </button>
        )}

        <AnimatePresence mode="wait">

          {/* 1. START SCREEN */}
          {appPhase === 'start' && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#000105] cursor-pointer"
              onClick={() => {
                setAppPhase('loading');
                actions.setAudioPlaying(true); // START MUSIC
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} className="group flex flex-col items-center gap-6">
                <div className="p-6 rounded-full border border-white/10 bg-white/5 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500">
                  <Play className="w-8 h-8 text-white/50 group-hover:text-white transition-colors fill-white/10" />
                </div>
                <p className="font-montserrat text-xs tracking-[0.4em] text-white/40 uppercase group-hover:text-white/80 transition-colors">
                  Click to Initialize
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* 2. LOADING SCREEN */}
          {appPhase === 'loading' && (
            <LoadingScreen
              key="loader"
              onComplete={() => setAppPhase('running')}
            />
          )}

          {/* 3. RUNNING APP */}
          {appPhase === 'running' && (
            <motion.div key="app-content" className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">

                {/* HERO */}
                {view === 'hero' && (
                  <motion.div key="hero" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30">
                    <HeroSection onEnter={() => setView('rules')} />
                  </motion.div>
                )}

                {/* RULES -> Go to FACTS */}
                {view === 'rules' && (
                  <motion.div key="rules" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30 bg-[#000105]">
                    <RulesStage onConfirm={() => setView('facts')} />
                  </motion.div>
                )}

                {/* NEW: FACTS -> Go to SETUP */}
                {view === 'facts' && (
                  <motion.div key="facts" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30 bg-[#000105]">
                    <FactsStage onNext={() => setView('setup')} />
                  </motion.div>
                )}

                {/* SETUP -> Go to WISH */}
                {view === 'setup' && (
                  <motion.div key="setup" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30 bg-[#000105]">
                    <SetupStage
                      destinations={data.destinations}
                      onSelectDest={actions.setDestination}
                      onSelectTime={actions.setTimerDuration}
                      onInitiate={() => {
                        actions.setAudioPlaying(false); // CUT MUSIC FOR VIDEO
                        setView('wish');
                      }}
                    />
                  </motion.div>
                )}

                {/* AFFIRMATION -> Go to GAME */}
                {view === 'wish' && (
                  <AffirmationStage key="wish" onComplete={() => actions.startJourney()} />
                )}

                {/* THE JOURNEY */}
                {view === 'journey' && (
                  <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-black">
                    <JourneyInterface
                      data={combinedState}
                      onNext={actions.handleContinue}
                      onHome={() => {
                        actions.setStage('welcome');
                        setView('hero');
                      }}
                      onRisk={actions.handleDareToRisk}
                      onBond={actions.rollDice}
                      actions={actions}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Global Components */}
        <AnimatePresence>
          {state.showBondingPrompt && (
            <BondingDiceModal
              prompt={state.currentBondingPrompt}
              onClose={() => actions.setShowBondingPrompt(false)}
            />
          )}
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 opacity-0 pointer-events-none">
          <YouTubePlayer
            playing={state.audioPlaying}
            videoId={state.destination?.youtubeId || "LcDjP3cdk0g"}
          />
        </div>
      </div>
    </>
  );
}