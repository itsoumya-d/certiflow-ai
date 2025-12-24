"use client";

import { useState } from "react";
import {
    Shield,
    ArrowLeft,
    CheckCircle2,
    Building2,
    Mail,
    User,
    Briefcase,
    Users,
    Send,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

const frameworks = [
    { id: "soc2", name: "SOC 2 Type II", popular: true },
    { id: "iso27001", name: "ISO 27001" },
    { id: "hipaa", name: "HIPAA" },
    { id: "gdpr", name: "GDPR" },
    { id: "pci-dss", name: "PCI-DSS" },
    { id: "nist", name: "NIST 800-53" },
    { id: "dora", name: "DORA" },
    { id: "other", name: "Other" },
];

const companySizes = [
    "1-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
];

export default function DemoRequestPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        role: "",
        companySize: "",
        frameworks: [] as string[],
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const updateField = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleFramework = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            frameworks: prev.frameworks.includes(id)
                ? prev.frameworks.filter((f) => f !== id)
                : [...prev.frameworks, id],
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/demo-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result.message); // Log success message from API
            setIsSubmitted(true); // Only set to submitted if API call is successful
        } catch (error) {
            console.error("Failed to submit demo request:", error);
            // Optionally, show an error message to the user
            alert("Failed to submit demo request. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 1) {
            return formData.firstName && formData.lastName && formData.email;
        }
        if (step === 2) {
            return formData.company && formData.role && formData.companySize;
        }
        if (step === 3) {
            return formData.frameworks.length > 0;
        }
        return true;
    };

    if (isSubmitted) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "var(--space-6)",
                }}
            >
                <div
                    className="card animate-scale-in"
                    style={{ maxWidth: 500, textAlign: "center", padding: "var(--space-10)" }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            background: "rgba(34, 197, 94, 0.15)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto var(--space-6)",
                        }}
                    >
                        <CheckCircle2 size={40} color="var(--color-success)" />
                    </div>

                    <h2 style={{ marginBottom: "var(--space-4)" }}>
                        Demo Request Received!
                    </h2>

                    <p
                        style={{
                            color: "var(--color-neutral-400)",
                            marginBottom: "var(--space-6)",
                        }}
                    >
                        Thank you, {formData.firstName}! Our team will reach out to{" "}
                        <strong style={{ color: "var(--color-neutral-200)" }}>
                            {formData.email}
                        </strong>{" "}
                        within 24 hours to schedule your personalized demo.
                    </p>

                    <div
                        style={{
                            padding: "var(--space-4)",
                            background: "rgba(16, 185, 129, 0.1)",
                            borderRadius: "var(--radius-lg)",
                            marginBottom: "var(--space-6)",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "var(--text-sm)",
                                color: "var(--color-primary-400)",
                            }}
                        >
                            <Sparkles
                                size={16}
                                style={{ display: "inline", marginRight: 8 }}
                            />
                            Meanwhile, explore our dashboard to see CertiFlow AI in action!
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href="/dashboard" className="btn btn-primary">
                            Explore Dashboard
                        </Link>
                        <Link href="/" className="btn btn-secondary">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", padding: "var(--space-6)" }}>
            {/* Header */}
            <div className="container" style={{ maxWidth: 800 }}>
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    style={{
                        color: "var(--color-neutral-400)",
                        textDecoration: "none",
                        marginBottom: "var(--space-8)",
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Logo */}
                <div
                    className="flex items-center gap-3"
                    style={{ marginBottom: "var(--space-8)" }}
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
                    <div>
                        <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: 0 }}>
                            Schedule a Demo
                        </h1>
                        <p style={{ color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                            See how CertiFlow AI can automate your compliance
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div
                    className="flex items-center gap-4"
                    style={{ marginBottom: "var(--space-8)" }}
                >
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2" style={{ flex: 1 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background:
                                        step >= s
                                            ? "linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))"
                                            : "var(--color-neutral-700)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: "var(--font-semibold)",
                                    color: step >= s ? "white" : "var(--color-neutral-400)",
                                }}
                            >
                                {step > s ? <CheckCircle2 size={18} /> : s}
                            </div>
                            <span
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color:
                                        step >= s
                                            ? "var(--color-neutral-100)"
                                            : "var(--color-neutral-500)",
                                }}
                            >
                                {s === 1 ? "Your Info" : s === 2 ? "Company" : "Frameworks"}
                            </span>
                            {s < 3 && (
                                <div
                                    style={{
                                        flex: 1,
                                        height: 2,
                                        background:
                                            step > s
                                                ? "var(--color-primary-500)"
                                                : "var(--color-neutral-700)",
                                        marginLeft: "var(--space-2)",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="card" style={{ padding: "var(--space-8)" }}>
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: "var(--space-6)" }}>
                                Tell us about yourself
                            </h3>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "var(--space-4)",
                                    marginBottom: "var(--space-4)",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        <User
                                            size={14}
                                            style={{ display: "inline", marginRight: 6 }}
                                        />
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => updateField("firstName", e.target.value)}
                                        placeholder="John"
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
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => updateField("lastName", e.target.value)}
                                        placeholder="Doe"
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
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-sm)",
                                        color: "var(--color-neutral-300)",
                                        marginBottom: "var(--space-2)",
                                    }}
                                >
                                    <Mail
                                        size={14}
                                        style={{ display: "inline", marginRight: 6 }}
                                    />
                                    Work Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="john@company.com"
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
                        </div>
                    )}

                    {/* Step 2: Company Info */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: "var(--space-6)" }}>
                                About your company
                            </h3>

                            <div style={{ marginBottom: "var(--space-4)" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-sm)",
                                        color: "var(--color-neutral-300)",
                                        marginBottom: "var(--space-2)",
                                    }}
                                >
                                    <Building2
                                        size={14}
                                        style={{ display: "inline", marginRight: 6 }}
                                    />
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => updateField("company", e.target.value)}
                                    placeholder="Acme Inc."
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

                            <div style={{ marginBottom: "var(--space-4)" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-sm)",
                                        color: "var(--color-neutral-300)",
                                        marginBottom: "var(--space-2)",
                                    }}
                                >
                                    <Briefcase
                                        size={14}
                                        style={{ display: "inline", marginRight: 6 }}
                                    />
                                    Your Role *
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => updateField("role", e.target.value)}
                                    placeholder="CISO, Head of Compliance, CTO..."
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

                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-sm)",
                                        color: "var(--color-neutral-300)",
                                        marginBottom: "var(--space-2)",
                                    }}
                                >
                                    <Users
                                        size={14}
                                        style={{ display: "inline", marginRight: 6 }}
                                    />
                                    Company Size *
                                </label>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "var(--space-2)",
                                    }}
                                >
                                    {companySizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => updateField("companySize", size)}
                                            className={`btn ${formData.companySize === size
                                                    ? "btn-primary"
                                                    : "btn-secondary"
                                                }`}
                                            style={{ fontSize: "var(--text-xs)" }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Frameworks */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: "var(--space-2)" }}>
                                Which frameworks are you targeting?
                            </h3>
                            <p
                                style={{
                                    color: "var(--color-neutral-400)",
                                    fontSize: "var(--text-sm)",
                                    marginBottom: "var(--space-6)",
                                }}
                            >
                                Select all that apply
                            </p>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "var(--space-3)",
                                    marginBottom: "var(--space-6)",
                                }}
                            >
                                {frameworks.map((fw) => {
                                    const isSelected = formData.frameworks.includes(fw.id);
                                    return (
                                        <button
                                            key={fw.id}
                                            type="button"
                                            onClick={() => toggleFramework(fw.id)}
                                            style={{
                                                padding: "var(--space-4)",
                                                background: isSelected
                                                    ? "rgba(16, 185, 129, 0.15)"
                                                    : "var(--color-neutral-800)",
                                                border: isSelected
                                                    ? "2px solid var(--color-primary-500)"
                                                    : "1px solid var(--glass-border)",
                                                borderRadius: "var(--radius-lg)",
                                                cursor: "pointer",
                                                textAlign: "left",
                                                transition: "all var(--transition-fast)",
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    style={{
                                                        color: isSelected
                                                            ? "var(--color-primary-400)"
                                                            : "var(--color-neutral-200)",
                                                        fontWeight: "var(--font-medium)",
                                                    }}
                                                >
                                                    {fw.name}
                                                </span>
                                                {fw.popular && (
                                                    <span className="badge badge-success">Popular</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-sm)",
                                        color: "var(--color-neutral-300)",
                                        marginBottom: "var(--space-2)",
                                    }}
                                >
                                    Anything else we should know? (Optional)
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => updateField("message", e.target.value)}
                                    placeholder="Tell us about your compliance goals..."
                                    rows={3}
                                    style={{
                                        width: "100%",
                                        padding: "var(--space-3) var(--space-4)",
                                        background: "var(--color-neutral-800)",
                                        border: "1px solid var(--glass-border)",
                                        borderRadius: "var(--radius-lg)",
                                        color: "var(--color-neutral-100)",
                                        fontSize: "var(--text-sm)",
                                        resize: "vertical",
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div
                        className="flex justify-between"
                        style={{ marginTop: "var(--space-8)" }}
                    >
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="btn btn-ghost"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={!canProceed()}
                                className="btn btn-primary"
                                style={{
                                    opacity: canProceed() ? 1 : 0.5,
                                    cursor: canProceed() ? "pointer" : "not-allowed",
                                }}
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canProceed() || isSubmitting}
                                className="btn btn-primary"
                                style={{
                                    opacity: canProceed() && !isSubmitting ? 1 : 0.5,
                                    cursor:
                                        canProceed() && !isSubmitting ? "pointer" : "not-allowed",
                                }}
                            >
                                {isSubmitting ? (
                                    "Submitting..."
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Request Demo
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Trust Badges */}
                <div
                    style={{
                        marginTop: "var(--space-8)",
                        textAlign: "center",
                        color: "var(--color-neutral-500)",
                        fontSize: "var(--text-xs)",
                    }}
                >
                    <p>
                        🔒 Your data is encrypted and never shared. Read our{" "}
                        <a
                            href="#"
                            style={{ color: "var(--color-primary-400)", textDecoration: "none" }}
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
