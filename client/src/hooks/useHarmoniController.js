import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { fallbackQuestions as localFallbackQuestions, fallbackRiskyQuestions as localFallbackRiskyQuestions } from '../data/fallback-questions';

// --- CONFIGURATION ---
const supabase = createClient(
  'https://mvcavbkzhclnwmrrffpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y2F2Ymt6aGNsbndtcnJmZnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMDM1MTAsImV4cCI6MjA4NDc3OTUxMH0.o99uK58ebEdk_BI5lzUVkfSlKY3TllHnvMGhXY1_zPQ'
);

// --- HELPERS ---

// Fisher-Yates shuffle — unbiased, every permutation equally likely
const smartShuffle = (array) => {
  if (!array || !Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const organizeQuestions = (rawData) => {
  const organized = { round0: [], round1: [], round2: [], round3: [], round4: [], round5: [], round6: [] };
  if (!rawData) return organized;
  const dataArray = Array.isArray(rawData) ? rawData : Object.values(rawData).flat();

  dataArray.forEach(item => {
    if (!item) return;
    const q = {
      q: item.question || item.q || item.question_text || "Breathe...",
      round: item.round_number ?? item.round ?? 0,
      depth: item.depth || 2,
      fixed: item.fixed || false
    };
    const key = `round${q.round}`;
    if (organized[key]) organized[key].push(q);
    else organized['round0'].push(q);
  });

  // Respect the `fixed` flag: pinned questions always lead their round,
  // the rest are shuffled freely around them.
  Object.keys(organized).forEach(k => {
    const fixedOnes = organized[k].filter(q => q.fixed);
    const freeOnes = smartShuffle(organized[k].filter(q => !q.fixed));
    organized[k] = [...fixedOnes, ...freeOnes];
  });

  return organized;
};

// --- HOOK ---
export function useHarmoniController() {
  const [questions, setQuestions] = useState(() => organizeQuestions(localFallbackQuestions));

  const [stage, setStage] = useState("welcome");
  const [destination, setDestination] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Partner names
  const [partner1Name, setPartner1Name] = useState('');
  const [partner2Name, setPartner2Name] = useState('');

  // Risk cooldown — locked for N questions after use
  const [riskCooldown, setRiskCooldown] = useState(0);

  // Audio & Flags
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);

  // Interaction State
  const [showBondingPrompt, setShowBondingPrompt] = useState(false);
  const [currentBondingPrompt, setCurrentBondingPrompt] = useState(null);
  const [showRiskyQuestion, setShowRiskyQuestion] = useState(false);
  const [currentRiskyQuestion, setCurrentRiskyQuestion] = useState(null);
  const [timerDuration, setTimerDuration] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Data Pools
  const [riskyQuestions, setRiskyQuestions] = useState(localFallbackRiskyQuestions || []);
  const [bondingPrompts, setBondingPrompts] = useState([]);

  const questionCounter = useRef(0);
  const nextBondingTarget = useRef(Math.floor(Math.random() * 3) + 2);
  // Cache raw question data so startJourney can re-shuffle on every replay
  const rawQuestionsData = useRef(localFallbackQuestions);

  // Initial Fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const { data: qData } = await supabase.from('questions').select('*');
        if (qData?.length > 0) {
          rawQuestionsData.current = qData; // Cache for re-shuffling on replay
          setQuestions(organizeQuestions(qData));
        }

        const { data: rData } = await supabase.from('risky_questions').select('*');
        if (rData?.length > 0) setRiskyQuestions(rData);

        const { data: bData } = await supabase.from('bonding_prompts').select('*');
        if (bData?.length > 0) setBondingPrompts(bData);
      } catch (e) {
        console.warn("Using local fallback data");
      }
    };
    initData();
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStage("complete");
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // --- ACTIONS ---

  const startThemeMusic = () => {
    setAudioPlaying(true);
  };

  const startJourney = () => {
    if (!destination) return alert("Please select a path.");
    if (!timerDuration) return alert("Please set a time.");

    // CHECK IF MAIN JOURNEY
    if (destination.id === 'main') {
      // ACTIVATE GAME — re-shuffle from live data every time for true randomness on replay
      setQuestions(organizeQuestions(rawQuestionsData.current));
      setIsComingSoon(false);
      setTimeRemaining(timerDuration * 60);
      setTimerActive(true);
      setStage('journey');
      setAudioPlaying(true); // Resume music

      // Reset counters
      setCurrentRound(0);
      setCurrentQuestion(0);
      setQuestionsAnswered(0);
      questionCounter.current = 0;
      nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
    } else {
      // ALL OTHER JOURNEYS -> COMING SOON
      setIsComingSoon(true);
      setStage('journey');
      setAudioPlaying(false);
    }
  };

  const handleContinue = () => {
    if (isComingSoon) return;

    questionCounter.current += 1;
    setQuestionsAnswered(prev => prev + 1);
    // Tick down risk cooldown
    setRiskCooldown(prev => Math.max(0, prev - 1));

    // Bonding Logic (Active for Main Journey)
    if (questionCounter.current >= nextBondingTarget.current) {
      let prompt = { text: "Look into each other's eyes for 60 seconds." };
      if (bondingPrompts.length > 0) prompt = bondingPrompts[Math.floor(Math.random() * bondingPrompts.length)];
      setCurrentBondingPrompt(prompt);
      setShowBondingPrompt(true);
      questionCounter.current = 0;
      nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
    } else {
      const curRoundKey = `round${currentRound}`;
      const roundQs = questions?.[curRoundKey] || [];

      if (currentQuestion < roundQs.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentRound < 6 && questions[`round${currentRound + 1}`]?.length > 0) {
        setCurrentRound(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        setStage("complete");
        setTimerActive(false);
      }
    }
  };

  const handleDareToRisk = () => {
    if (isComingSoon) return;
    if (riskCooldown > 0) return; // Cooldown active
    const pool = (riskyQuestions.length > 0) ? riskyQuestions : localFallbackRiskyQuestions;
    const q = pool[Math.floor(Math.random() * pool.length)] || { q: "What is a truth you've never shared?" };
    setCurrentRiskyQuestion(q);
    setShowRiskyQuestion(true);
    setRiskCooldown(3); // Lock for 3 questions
  };

  const currentRoundQuestions = questions?.[`round${currentRound}`] || [];
  const currentQuestionData = currentRoundQuestions[currentQuestion] || { q: "Loading..." };

  // Total questions across all rounds for accurate progress
  const totalQuestions = Object.values(questions).reduce((sum, arr) => sum + arr.length, 0);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    gameState: {
      stage, destination, currentRound, currentQuestion,
      currentQuestionData, isComingSoon,
      audioPlaying, showBondingPrompt, currentBondingPrompt,
      showRiskyQuestion, currentRiskyQuestion,
      timeRemaining: formatTime(timeRemaining),
      questionsAnswered, totalQuestions,
      partner1Name, partner2Name,
      riskCooldown,
    },
    actions: {
      setStage, setDestination, startJourney, handleContinue,
      setAudioPlaying, startThemeMusic,
      setShowBondingPrompt, setShowRiskyQuestion,
      handleDareToRisk, setTimerDuration,
      setPartner1Name, setPartner2Name,
      rollDice: () => { }
    },
    data: {
      // 6 JOURNEYS
      destinations: [
        {
          id: 'main',
          name: 'The Deep Dive',
          description: 'The foundation. Deep questions, risks & bonding.',
          image: '/jeffrey-lai-Cz57JO4T0gQ-unsplash.jpg',
          youtubeId: "LcDjP3cdk0g"
        },
        {
          id: 'mirror',
          name: 'The Mirror',
          description: 'How well do you know me? (Coming Soon)',
          image: '/alexander-mass-4Up_Tnlvb3s-unsplash-2.jpg',
          youtubeId: "LcDjP3cdk0g"
        },
        {
          id: 'crossroads',
          name: 'The Crossroads',
          description: 'Scenarios & Values. (Coming Soon)',
          image: '/stefano-valtorta-zfJMDR-btBg-unsplash.jpg',
          youtubeId: "8O-1qB-fxjc"
        },
        {
          id: 'truth',
          name: 'Truth or Dare',
          description: 'High stakes fun. (Coming Soon)',
          image: '/kamil-foatov-8bSX6bx8KwQ-unsplash.jpg',
          youtubeId: "MqDODqQO0FI"
        },
        {
          id: 'riddle',
          name: 'Cupid\'s Riddle',
          description: 'Playful riddles. (Coming Soon)',
          image: '/noukka-signe-s90wTklH2to-unsplash.jpg',
          youtubeId: "LcDjP3cdk0g"
        },
        {
          id: 'date',
          name: 'The Spark',
          description: 'Date ideas & Inspiration. (Coming Soon)',
          image: '/pexels-reymark-gadil-1663304-9744183.jpg',
          youtubeId: "8O-1qB-fxjc"
        }
      ]
    }
  };
}
export default useHarmoniController;