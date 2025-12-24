"use client";

import React from "react";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
}

/**
 * Skeleton loader component for loading states
 */
export function Skeleton({
    width = "100%",
    height = "1rem",
    borderRadius = "var(--radius-md)",
    className = "",
}: SkeletonProps) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                borderRadius,
                background: "linear-gradient(90deg, var(--color-neutral-800) 25%, var(--color-neutral-700) 50%, var(--color-neutral-800) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
            }}
        />
    );
}

/**
 * Skeleton card for dashboard loading states
 */
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
    return (
        <div
            className="card"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
            }}
        >
            <div className="flex items-center justify-between">
                <Skeleton width={100} height={12} />
                <Skeleton width={60} height={24} borderRadius="var(--radius-full)" />
            </div>
            <Skeleton width="70%" height={28} />
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} width={`${90 - i * 10}%`} height={12} />
            ))}
        </div>
    );
}

/**
 * Skeleton row for table/list loading states
 */
export function SkeletonRow() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                padding: "var(--space-4)",
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "var(--radius-md)",
            }}
        >
            <Skeleton width={40} height={40} borderRadius="var(--radius-md)" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={10} />
            </div>
            <Skeleton width={80} height={24} borderRadius="var(--radius-full)" />
        </div>
    );
}

/**
 * Dashboard skeleton layout
 */
export function DashboardSkeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {/* Stats row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "var(--space-4)",
                }}
            >
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="card"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-2)",
                        }}
                    >
                        <Skeleton width={80} height={12} />
                        <Skeleton width="50%" height={32} />
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "var(--space-6)",
                }}
            >
                <SkeletonCard lines={5} />
                <SkeletonCard lines={4} />
            </div>
        </div>
    );
}
