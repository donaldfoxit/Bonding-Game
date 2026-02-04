// Simple click sound utility using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

export const playClickSound = () => {
    if (!audioContext) return;

    // Resume audio context if suspended (needed for autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Create oscillator for a nice click sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Click sound settings - short, soft pop
    oscillator.frequency.value = 1200; // Higher frequency = more "clicky"
    oscillator.type = 'sine';

    // Quick fade out for that satisfying click
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

    // Play and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
};

// Alternative softer click
export const playSoftClick = () => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Softer, lower click
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
};

// Conclusive chime sound - plays a pleasant chord for agreement
export const playChimeSound = () => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Create a pleasant chime chord (C, E, G notes)
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        // Stagger the notes slightly for a more musical effect
        const startTime = audioContext.currentTime + (index * 0.05);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.8);
    });
};
