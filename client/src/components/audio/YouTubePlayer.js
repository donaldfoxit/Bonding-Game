import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const YouTubePlayer = ({ videoId, playing, startDelayed = false }) => {
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const containerRef = useRef(null);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const initializePlayer = () => {
            const playerElement = document.getElementById('youtube-player');
            if (!playerElement) {
                console.error('YouTube player element not found');
                return;
            }

            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.log('Error destroying player:', e);
                }
            }

            try {
                playerRef.current = new window.YT.Player('youtube-player', {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        loop: 1,
                        modestbranding: 1,
                        playlist: videoId,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3,
                        enablejsapi: 1,
                    },
                    events: {
                        onReady: (event) => {
                            console.log('YouTube player ready');
                            setPlayerReady(true);
                        },
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.ENDED) {
                                event.target.playVideo();
                            }
                        },
                        onError: (event) => {
                            console.error('YouTube player error:', event.data);
                        },
                    },
                });
            } catch (e) {
                console.error('Error creating YouTube player:', e);
            }
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube API ready');
                setTimeout(initializePlayer, 100);
            };
        } else if (window.YT.Player) {
            setTimeout(initializePlayer, 100);
        }

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                    playerRef.current = null;
                } catch (e) {
                    console.log('Error in cleanup:', e);
                }
            }
        };
    }, [videoId]);

    // Handle the "trick trigger" for autoplay policy
    useEffect(() => {
        if (playerReady && playerRef.current && playing && !hasStartedRef.current) {
            hasStartedRef.current = true;

            try {
                // TRICK: Start immediately at volume 0 to capture user interaction
                playerRef.current.setVolume(0);
                playerRef.current.playVideo();

                // Quick fade in (100ms)
                setTimeout(() => {
                    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
                        playerRef.current.setVolume(25); // Set to 25% volume
                        setShowControls(true); // Show mute button after music starts
                    }
                }, 100);
            } catch (e) {
                console.error('Error starting playback:', e);
            }
        }
    }, [playing, playerReady]);

    // Reset when videoId changes (for journey music switch)
    useEffect(() => {
        hasStartedRef.current = false;
        setShowControls(false);
    }, [videoId]);

    // Handle play/pause toggle
    useEffect(() => {
        if (playerReady && playerRef.current && hasStartedRef.current) {
            try {
                if (typeof playerRef.current.playVideo === 'function' && typeof playerRef.current.pauseVideo === 'function') {
                    if (playing) {
                        playerRef.current.playVideo();
                    } else {
                        playerRef.current.pauseVideo();
                    }
                }
            } catch (e) {
                console.error('Error toggling playback:', e);
            }
        }
    }, [playing, playerReady]);

    const toggleMute = () => {
        if (playerRef.current) {
            try {
                if (isMuted) {
                    playerRef.current.unMute();
                    playerRef.current.setVolume(25);
                } else {
                    playerRef.current.mute();
                }
                setIsMuted(!isMuted);
            } catch (e) {
                console.error('Error toggling mute:', e);
            }
        }
    };

    return (
        <>
            {/* Mute Button - Only visible after music starts */}
            {showControls && (
                <div
                    className="fixed bottom-8 right-8 transition-opacity duration-500"
                    style={{ zIndex: 99999, opacity: showControls ? 1 : 0 }}
                >
                    <button
                        onClick={toggleMute}
                        className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-300 shadow-lg hover:scale-110 border border-white/20"
                        title={isMuted ? "Unmute Music" : "Mute Music"}
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                        ) : (
                            <Volume2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            )}

            {/* Hidden YouTube Player */}
            <div ref={containerRef}>
                <div id="youtube-player" style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                    visibility: 'hidden'
                }}></div>
            </div>
        </>
    );
};
