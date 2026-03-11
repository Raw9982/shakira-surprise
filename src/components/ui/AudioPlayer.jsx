"use client";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer({ src }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Basic setup
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }

        // Attempt to autoplay when component mounts
        const playAudio = async () => {
            try {
                if (audioRef.current) {
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } catch (err) {
                // Autoplay was blocked by browser
                console.log("Autoplay blocked. User interaction required.");
                setIsPlaying(false);
            }
        };

        // Listen for the first click anywhere on the document to start audio if autoplay failed
        const handleFirstInteraction = () => {
            if (!isPlaying && audioRef.current) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(e => console.log("Still cannot play", e));

                // Remove listener after first successful interaction
                document.removeEventListener("click", handleFirstInteraction);
                document.removeEventListener("touchstart", handleFirstInteraction);
            }
        };

        document.addEventListener("click", handleFirstInteraction);
        document.addEventListener("touchstart", handleFirstInteraction);

        // Initial autoplay attempt
        playAudio();

        return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
        };
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <>
            <audio ref={audioRef} src={src} loop preload="auto" />
            <button
                onClick={toggleMute}
                className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 transition-all duration-300 group"
            >
                {isPlaying ? (
                    <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                ) : (
                    <div className="relative">
                        <VolumeX className="w-6 h-6 opacity-70" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                        </span>
                    </div>
                )}
            </button>
        </>
    );
}
