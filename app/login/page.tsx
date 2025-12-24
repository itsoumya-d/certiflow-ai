"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Shield,
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const error = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(
        error === "CredentialsSignin" ? "Invalid email or password" : null
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setLoginError("Invalid email or password");
                setIsLoading(false);
            } else if (result?.ok) {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setLoginError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword("demo123");
        setIsLoading(true);

        const result = await signIn("credentials", {
            email: demoEmail,
            password: "demo123",
            redirect: false,
            callbackUrl,
        });

        if (result?.ok) {
            router.push(callbackUrl);
            router.refresh();
        } else {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Login Card */}
            <div className="card animate-fade-in" style={{ padding: "var(--space-8)" }}>
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "var(--space-2)",
                    }}
                >
                    Welcome Back
                </h2>
                <p
                    style={{
                        textAlign: "center",
                        color: "var(--color-neutral-400)",
                        marginBottom: "var(--space-6)",
                    }}
                >
                    Sign in to your CertiFlow AI account
                </p>

                {loginError && (
                    <div
                        className="flex items-center gap-2 animate-fade-in"
                        style={{
                            padding: "var(--space-3) var(--space-4)",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: "var(--radius-lg)",
                            marginBottom: "var(--space-4)",
                            color: "var(--color-error)",
                            fontSize: "var(--text-sm)",
                        }}
                    >
                        <AlertCircle size={16} />
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "var(--text-sm)",
                                color: "var(--color-neutral-300)",
                                marginBottom: "var(--space-2)",
                            }}
                        >
                            <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            required
                            style={{
                                width: "100%",
                                padding: "var(--space-3) var(--space-4)",
                                background: "var(--color-neutral-800)",
                                border: "1px solid var(--glass-border)",
                                borderRadius: "var(--radius-lg)",
                                color: "var(--color-neutral-100)",
                                fontSize: "var(--text-sm)",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "var(--space-6)" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "var(--text-sm)",
                                color: "var(--color-neutral-300)",
                                marginBottom: "var(--space-2)",
                            }}
                        >
                            <Lock size={14} style={{ display: "inline", marginRight: 6 }} />
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: "100%",
                                    padding: "var(--space-3) var(--space-4)",
                                    paddingRight: "var(--space-12)",
                                    background: "var(--color-neutral-800)",
                                    border: "1px solid var(--glass-border)",
                                    borderRadius: "var(--radius-lg)",
                                    color: "var(--color-neutral-100)",
                                    fontSize: "var(--text-sm)",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "var(--space-3)",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--color-neutral-400)",
                                    cursor: "pointer",
                                    padding: "var(--space-1)",
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            marginBottom: "var(--space-4)",
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    size={18}
                                    style={{ animation: "spin 1s linear infinite" }}
                                />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "var(--space-4)",
                    }}
                >
                    <Link
                        href="/forgot-password"
                        style={{
                            color: "var(--color-primary-400)",
                            fontSize: "var(--text-sm)",
                            textDecoration: "none",
                        }}
                    >
                        Forgot your password?
                    </Link>
                </div>

                {/* Divider */}
                <div
                    className="flex items-center gap-4"
                    style={{ marginBottom: "var(--space-4)" }}
                >
                    <div
                        style={{ flex: 1, height: 1, background: "var(--glass-border)" }}
                    />
                    <span
                        style={{
                            color: "var(--color-neutral-500)",
                            fontSize: "var(--text-xs)",
                        }}
                    >
                        OR TRY A DEMO ACCOUNT
                    </span>
                    <div
                        style={{ flex: 1, height: 1, background: "var(--glass-border)" }}
                    />
                </div>

                {/* Demo Accounts */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "var(--space-2)",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => handleDemoLogin("soumya@certiflow.ai")}
                        disabled={isLoading}
                        className="btn btn-secondary btn-sm"
                        style={{ flexDirection: "column", padding: "var(--space-3)" }}
                    >
                        <span style={{ fontWeight: "var(--font-semibold)" }}>Admin</span>
                        <span
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-neutral-400)",
                            }}
                        >
                            Full Access
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDemoLogin("demo@certiflow.ai")}
                        disabled={isLoading}
                        className="btn btn-secondary btn-sm"
                        style={{ flexDirection: "column", padding: "var(--space-3)" }}
                    >
                        <span style={{ fontWeight: "var(--font-semibold)" }}>User</span>
                        <span
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-neutral-400)",
                            }}
                        >
                            Standard
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDemoLogin("auditor@certiflow.ai")}
                        disabled={isLoading}
                        className="btn btn-secondary btn-sm"
                        style={{ flexDirection: "column", padding: "var(--space-3)" }}
                    >
                        <span style={{ fontWeight: "var(--font-semibold)" }}>Auditor</span>
                        <span
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-neutral-400)",
                            }}
                        >
                            Read Only
                        </span>
                    </button>
                </div>
            </div>

            {/* Sign Up Link */}
            <p
                style={{
                    textAlign: "center",
                    marginTop: "var(--space-6)",
                    color: "var(--color-neutral-400)",
                    fontSize: "var(--text-sm)",
                }}
            >
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    style={{
                        color: "var(--color-primary-400)",
                        textDecoration: "none",
                    }}
                >
                    Sign up for free
                </Link>
            </p>

            <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </>
    );
}

function LoginFormFallback() {
    return (
        <div className="card animate-fade-in" style={{ padding: "var(--space-8)", textAlign: "center" }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <p style={{ marginTop: "var(--space-4)", color: "var(--color-neutral-400)" }}>Loading...</p>
            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--space-6)",
                position: "relative",
            }}
        >
            {/* Background Effects */}
            <div
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "30%",
                    width: 500,
                    height: 500,
                    background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                }}
            />

            <div style={{ maxWidth: 440, width: "100%", position: "relative" }}>
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 justify-center"
                    style={{ marginBottom: "var(--space-8)", textDecoration: "none" }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            background:
                                "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%)",
                            borderRadius: "var(--radius-lg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Shield size={28} color="white" />
                    </div>
                    <span
                        style={{
                            fontSize: "var(--text-2xl)",
                            fontWeight: "var(--font-bold)",
                            color: "var(--color-neutral-100)",
                        }}
                    >
                        CertiFlow<span className="text-gradient"> AI</span>
                    </span>
                </Link>

                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
