"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    targetSelector?: string;
    position?: "top" | "bottom" | "left" | "right";
}

interface OnboardingContextType {
    currentStep: number;
    totalSteps: number;
    isActive: boolean;
    startOnboarding: () => void;
    endOnboarding: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const defaultSteps: OnboardingStep[] = [
    {
        id: "welcome",
        title: "Welcome to CertiFlow AI! 🎉",
        description: "Get audit-ready in 7 days with our autonomous compliance agents. Let's take a quick tour!",
    },
    {
        id: "dashboard",
        title: "Your Compliance Dashboard",
        description: "Track your compliance score, framework progress, and agent activity all in one place.",
    },
    {
        id: "agents",
        title: "AI-Powered Agents",
        description: "Our agents automatically collect evidence, verify compliance, and generate remediation plans.",
    },
    {
        id: "evidence",
        title: "Evidence Library",
        description: "All your compliance evidence is organized here. Upload manually or let agents collect automatically.",
    },
    {
        id: "shortcuts",
        title: "Power User Tips",
        description: "Press Ctrl+K for quick search, or ? to see all keyboard shortcuts. You're all set!",
    },
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Check if user has completed onboarding
    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem("certiflow_onboarding_complete");
        if (!hasCompletedOnboarding) {
            // Auto-start onboarding for new users after a short delay
            const timer = setTimeout(() => setIsActive(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const startOnboarding = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    const endOnboarding = () => {
        setIsActive(false);
        localStorage.setItem("certiflow_onboarding_complete", "true");
    };

    const skipOnboarding = () => {
        endOnboarding();
    };

    const nextStep = () => {
        if (currentStep < defaultSteps.length - 1) {
            setCurrentStep((s) => s + 1);
        } else {
            endOnboarding();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
        }
    };

    return (
        <OnboardingContext.Provider
            value={{
                currentStep,
                totalSteps: defaultSteps.length,
                isActive,
                startOnboarding,
                endOnboarding,
                nextStep,
                prevStep,
                skipOnboarding,
            }}
        >
            {children}
            {isActive && <OnboardingModal step={defaultSteps[currentStep]} />}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return context;
}

function OnboardingModal({ step }: { step: OnboardingStep }) {
    const { currentStep, totalSteps, nextStep, prevStep, skipOnboarding } = useOnboarding();

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
            }}
        >
            <div
                className="animate-scale-in"
                style={{
                    background: "var(--color-neutral-900)",
                    border: "1px solid var(--color-neutral-700)",
                    borderRadius: "var(--radius-xl)",
                    padding: "var(--space-6)",
                    maxWidth: "420px",
                    width: "90%",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} color="var(--color-primary-400)" />
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
                            {currentStep + 1} of {totalSteps}
                        </span>
                    </div>
                    <button
                        onClick={skipOnboarding}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--color-neutral-500)",
                            cursor: "pointer",
                            padding: "var(--space-1)",
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <h3
                    style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-semibold)",
                        marginBottom: "var(--space-2)",
                    }}
                >
                    {step.title}
                </h3>
                <p
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-neutral-400)",
                        lineHeight: 1.6,
                        marginBottom: "var(--space-6)",
                    }}
                >
                    {step.description}
                </p>

                {/* Progress dots */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "var(--space-2)",
                        marginBottom: "var(--space-5)",
                    }}
                >
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "var(--radius-full)",
                                background:
                                    i === currentStep ? "var(--color-primary-500)" : "var(--color-neutral-700)",
                                transition: "background var(--transition-fast)",
                            }}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="btn btn-secondary"
                        style={{ flex: 1, opacity: currentStep === 0 ? 0.5 : 1 }}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>
                    <button onClick={nextStep} className="btn btn-primary" style={{ flex: 1 }}>
                        {currentStep === totalSteps - 1 ? "Get Started" : "Next"}
                        {currentStep < totalSteps - 1 && <ChevronRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Button to restart onboarding from settings
 */
export function RestartOnboardingButton() {
    const { startOnboarding } = useOnboarding();

    const handleClick = () => {
        localStorage.removeItem("certiflow_onboarding_complete");
        startOnboarding();
    };

    return (
        <button onClick={handleClick} className="btn btn-secondary btn-sm">
            <Sparkles size={14} />
            Restart Tour
        </button>
    );
}
