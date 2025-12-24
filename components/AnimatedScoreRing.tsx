"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    animationDuration?: number;
}

export default function AnimatedScoreRing({
    score,
    size = 180,
    strokeWidth = 12,
    label = "Compliance Score",
    animationDuration = 1500,
}: AnimatedScoreRingProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Intersection Observer to trigger animation when visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    // Animate the score when visible
    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(score * easeOut));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, score, animationDuration]);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    // Color based on score
    const getColor = (value: number) => {
        if (value >= 80) return "var(--color-success)";
        if (value >= 60) return "var(--color-warning)";
        return "var(--color-error)";
    };

    const ringColor = getColor(animatedScore);

    return (
        <div
            ref={ref}
            style={{
                position: "relative",
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Background glow effect */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${ringColor}20 0%, transparent 70%)`,
                    filter: "blur(20px)",
                    opacity: animatedScore > 0 ? 1 : 0,
                    transition: "opacity 0.5s ease",
                }}
            />

            <svg
                width={size}
                height={size}
                style={{ transform: "rotate(-90deg)", position: "absolute" }}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-neutral-700)"
                    strokeWidth={strokeWidth}
                />
                {/* Animated progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: "stroke-dashoffset 0.1s ease-out, stroke 0.3s ease",
                        filter: `drop-shadow(0 0 8px ${ringColor})`,
                    }}
                />
            </svg>

            {/* Center content */}
            <div
                style={{
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        fontSize: size > 150 ? "var(--text-5xl)" : "var(--text-3xl)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--color-neutral-50)",
                        lineHeight: 1,
                    }}
                >
                    {animatedScore}
                    <span style={{ fontSize: "var(--text-xl)", color: ringColor }}>%</span>
                </div>
                <div
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-neutral-400)",
                        marginTop: "var(--space-1)",
                    }}
                >
                    {label}
                </div>
            </div>
        </div>
    );
}
