"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Navigation progress bar that shows during page transitions
 */
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Reset on route change complete
        setIsLoading(false);
        setProgress(0);
    }, [pathname, searchParams]);

    // Handle navigation start
    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true);
            setProgress(30);

            // Simulate progress
            const timer1 = setTimeout(() => setProgress(60), 100);
            const timer2 = setTimeout(() => setProgress(80), 200);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        };

        // Listen for link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (link && link.href && !link.target && !link.download) {
                const url = new URL(link.href);
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    handleStart();
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [pathname]);

    if (!isLoading && progress === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                zIndex: 99999,
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, var(--color-primary-500), var(--color-accent-500))",
                    boxShadow: "0 0 10px var(--color-primary-500)",
                    transition: "width 200ms ease-out",
                }}
            />
        </div>
    );
}
