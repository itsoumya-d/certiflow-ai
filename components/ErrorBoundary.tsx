"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });

        // You could send this to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        padding: "var(--space-8)",
                        background: "var(--color-neutral-950)",
                        color: "var(--color-neutral-50)",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: "var(--radius-full)",
                            background: "rgba(239, 68, 68, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "var(--space-6)",
                        }}
                    >
                        <AlertTriangle size={40} color="var(--color-error)" />
                    </div>

                    <h1
                        style={{
                            fontSize: "var(--text-2xl)",
                            fontWeight: "var(--font-bold)",
                            marginBottom: "var(--space-3)",
                        }}
                    >
                        Something went wrong
                    </h1>

                    <p
                        style={{
                            fontSize: "var(--text-base)",
                            color: "var(--color-neutral-400)",
                            maxWidth: "400px",
                            marginBottom: "var(--space-6)",
                        }}
                    >
                        We&apos;re sorry, but something unexpected happened. Please try again or return to the homepage.
                    </p>

                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <details
                            style={{
                                marginBottom: "var(--space-6)",
                                padding: "var(--space-4)",
                                background: "var(--color-neutral-900)",
                                borderRadius: "var(--radius-lg)",
                                border: "1px solid var(--color-neutral-700)",
                                maxWidth: "600px",
                                width: "100%",
                                textAlign: "left",
                            }}
                        >
                            <summary
                                style={{
                                    cursor: "pointer",
                                    fontWeight: "var(--font-medium)",
                                    marginBottom: "var(--space-2)",
                                }}
                            >
                                Error Details (Development Only)
                            </summary>
                            <pre
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-error)",
                                    whiteSpace: "pre-wrap",
                                    overflowX: "auto",
                                }}
                            >
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}

                    <div style={{ display: "flex", gap: "var(--space-4)" }}>
                        <button
                            onClick={this.handleReset}
                            className="btn btn-primary"
                            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="btn btn-secondary"
                            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
                        >
                            <Home size={18} />
                            Go Home
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
