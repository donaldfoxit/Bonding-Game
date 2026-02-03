import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHarmoniController } from './hooks/useHarmoniController';
import { YouTubePlayer } from './components/audio/YouTubePlayer';

// Components
import HeroSection from "./components/v3/HeroSection";
import RulesStage from "./components/v3/RulesStage";
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
  const [loading, setLoading] = useState(true);
  const [showAffirmation, setShowAffirmation] = useState(false);

  // VIEW STATE: 'hero' -> 'rules' -> 'setup' -> 'affirmation' -> 'journey'
  const [view, setView] = useState('hero');

  const { gameState: state, actions, data } = useHarmoniController();

  // Sync internal game stage with view
  useEffect(() => {
    if (state.stage === 'journey' && !showAffirmation) setView('journey');
    if (state.stage === 'complete') setView('complete');
    if (state.stage === 'welcome' && view === 'journey') setView('hero');
  }, [state.stage, view, showAffirmation]);

  const combinedState = { ...state, destinations: data.destinations };

  // Handle affirmation completion
  const handleAffirmationComplete = () => {
    setShowAffirmation(false);
    actions.startJourney();
  };

  // Handle setup initiation - show affirmation first
  const handleInitiateWithAffirmation = () => {
    setShowAffirmation(true);
  };

  // Smooth Transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="main-container relative w-full h-screen overflow-hidden bg-[#000105]">
          <GlowBorder />
          <NoiseOverlay opacity={0.04} />

          <AnimatePresence mode="wait">

            {/* 1. HERO - On Click, switch to RULES */}
            {view === 'hero' && (
              <motion.div key="hero" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30">
                <HeroSection onEnter={() => setView('rules')} />
              </motion.div>
            )}

            {/* 2. RULES - On Confirm, switch to SETUP */}
            {view === 'rules' && (
              <motion.div key="rules" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30 bg-[#000105]">
                <RulesStage onConfirm={() => setView('setup')} />
              </motion.div>
            )}

            {/* 3. SETUP - Selects journey, triggers affirmation */}
            {view === 'setup' && (
              <motion.div key="setup" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-30 bg-[#000105]">
                <SetupStage
                  destinations={data.destinations}
                  onSelectDest={actions.setDestination}
                  onSelectTime={actions.setTimerDuration}
                  onInitiate={handleInitiateWithAffirmation}
                />
              </motion.div>
            )}


            {/* 4. AFFIRMATION - Shows before journey */}
            {showAffirmation && (
              <motion.div key="affirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50">
                <AffirmationStage onComplete={handleAffirmationComplete} />
              </motion.div>
            )}

            {/* 5. JOURNEY INTERFACE */}
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

          {/* Modals */}
          <AnimatePresence>
            {state.showBondingPrompt && (
              <BondingDiceModal
                prompt={state.currentBondingPrompt}
                onClose={() => actions.setShowBondingPrompt(false)}
              />
            )}
          </AnimatePresence>

          <div className="fixed bottom-0 left-0 opacity-0 pointer-events-none">
            <YouTubePlayer playing={state.audioPlaying} videoId={state.destination?.youtubeId || "LcDjP3cdk0g"} />
          </div>
        </div>
      )}
    </>
  );
}