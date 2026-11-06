
import { useEffect, useRef, useState } from "react";
import fundoVideo from "../assets/fundo-moda.mp4";
import logo from "../public/logo-vestispace.png";

export default function SplashScreen({ onExitStart, onComplete }) {
    const [progress, setProgress] = useState(0);
    const [exiting, setExiting] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);

    const completedRef = useRef(false);

    useEffect(() => {
        const duration = 3700;
        const startedAt = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const value = Math.min((elapsed / duration) * 100, 100);

            setProgress(value);

            if (value >= 100) {
                clearInterval(timer);

                onExitStart?.();

                requestAnimationFrame(() => {
                    setExiting(true);
                });

                setTimeout(() => {
                    if (!completedRef.current) {
                        completedRef.current = true;
                        onComplete?.();
                    }
                }, 3000);
            }
        }, 25);

        return () => clearInterval(timer);
    }, [onExitStart, onComplete]);

    return (
        <div
            className={`splash-screen ${exiting ? "splash-exiting" : ""}`}
            role="status"
            aria-label="Carregando Vestispace"
        >
            <video
                className={`splash-video ${videoEnded ? "video-ended" : ""}`}
                src={fundoVideo}
                autoPlay
                muted
                playsInline
                onEnded={(e) => {
                    e.currentTarget.pause();
                    setVideoEnded(true);
                }}
                aria-hidden="true"
            />

            <div className="splash-overlay" />

            <div className="splash-glow splash-glow-one" />
            <div className="splash-glow splash-glow-two" />

            <div className="splash-content">
                <div className="splash-logo-wrap">
                    <img
                        src={logo}
                        alt="Vestispace"
                        className="splash-logo"
                    />
                </div>

                <p className="splash-tagline">
                    GESTÃO INTELIGENTE DE ESTOQUE
                </p>

                <div
                    className="splash-loader"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.floor(progress)}
                >
                    <span style={{ width: `${progress}%` }} />
                </div>

                <div className="splash-progress">
                    <span>Carregando seu ambiente...</span>
                    <strong>{Math.floor(progress)}%</strong>
                </div>
            </div>

            <span className="splash-footer">
                VESTISPACE • FASHION STOCK PLATFORM
            </span>
        </div>
    );
}
