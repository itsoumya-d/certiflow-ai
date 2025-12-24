"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  faqSchema,
  generateJsonLd,
} from "@/lib/seo";
import {
  staggerContainer,
  staggerContainerSlow,
  staggerChild,
  fadeInUp,
  hoverLift,
} from "@/lib/animations";
import {
  Shield,
  Clock,
  CheckCircle2,
  Zap,
  ArrowRight,
  PlayCircle,
  Lock,
  RefreshCw,
  FileCheck,
  Bot,
  ChevronRight,
  Star,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd(faqSchema) }}
      />
      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                background:
                  "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={24} color="white" />
            </div>
            <span
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-bold)",
              }}
            >
              CertiFlow<span className="text-gradient"> AI</span>
            </span>
          </div>
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: "block" }}
          >
            <X size={24} />
          </button>
        </div>
        <div className="mobile-menu-links">
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>
            Features
          </a>
          <a href="#frameworks" onClick={() => setMobileMenuOpen(false)}>
            Frameworks
          </a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </a>
          <a href="/trust-center" onClick={() => setMobileMenuOpen(false)}>
            Trust Center
          </a>
          <a
            href="/demo"
            className="btn btn-primary"
            style={{ marginTop: "var(--space-4)" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "var(--space-4) var(--space-6)",
        }}
      >
        <div
          className="container flex items-center justify-between"
          style={{ maxWidth: 1280 }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                background:
                  "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={24} color="white" />
            </div>
            <span
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-bold)",
              }}
            >
              CertiFlow
              <span className="text-gradient"> AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav flex items-center gap-6">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#frameworks" className="nav-link">
              Frameworks
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="/trust-center" className="nav-link">
              Trust Center
            </a>
            <a href="/demo" className="btn btn-primary">
              Get Started <ArrowRight size={16} />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>


      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Effects */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-grid">
            <motion.div
              variants={staggerContainerSlow}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div
                className="badge animate-pulse-glow"
                style={{ marginBottom: "var(--space-6)", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}
                variants={staggerChild}
              >
                <Bot size={14} className="text-primary-400" />
                Next-Gen Agentic GRC
              </motion.div>

              <motion.h1
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                  lineHeight: 1,
                  marginBottom: "var(--space-6)",
                  letterSpacing: "-0.04em"
                }}
                variants={staggerChild}
                className="text-balance"
              >
                Compliance on <br />
                <span className="text-gradient animate-background-pan" style={{ backgroundSize: "200% auto" }}>Autopilot</span>
              </motion.h1>

              <motion.p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-neutral-400)",
                  marginBottom: "var(--space-8)",
                  maxWidth: 540,
                  lineHeight: 1.6
                }}
                variants={staggerChild}
                className="text-balance"
              >
                CertiFlow AI uses autonomous agents to navigate your stack, collect evidence, and verify controls 24/7. Stop managing spreadsheets and start automated audits.
              </motion.p>

              <motion.div className="flex flex-wrap gap-4" style={{ marginBottom: "var(--space-8)" }} variants={staggerChild}>
                <motion.a
                  href="/demo"
                  className="btn btn-primary btn-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Audit-Ready Now <ArrowRight size={18} />
                </motion.a>
                <motion.a
                  href="/dashboard"
                  className="btn btn-secondary btn-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayCircle size={18} />
                  Watch Agent in Action
                </motion.a>
              </motion.div>

              <motion.div className="flex gap-8" variants={staggerChild}>
                {[
                  { label: "Automation", val: "98%" },
                  { label: "Time Saved", val: "10x" },
                  { label: "Accuracy", val: "99.9%" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: "var(--text-2xl)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--color-neutral-50)"
                      }}
                    >
                      {stat.val}
                    </div>
                    <div style={{ color: "var(--color-neutral-500)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <div
              className="animate-fade-in relative"
              style={{ animationDelay: "400ms" }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 animate-pulse-glow" />
              <div
                className="card card-premium relative"
                style={{
                  padding: "var(--space-8)",
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: "var(--space-8)" }}
                >
                  <div>
                    <h3 style={{ fontSize: "var(--text-xl)" }}>Compliance Health</h3>
                    <p className="text-muted text-xs">Real-time Agent Monitoring</p>
                  </div>
                  <div className="status-indicator">
                    <span className="status-dot success" />
                    <span className="text-xs font-semibold text-success">Live Agent</span>
                  </div>
                </div>

                {/* Progress Ring */}
                <div
                  className="flex justify-center"
                  style={{ marginBottom: "var(--space-8)" }}
                >
                  <div className="progress-ring scale-125">
                    <svg width="120" height="120">
                      <circle
                        className="progress-ring-bg"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="8"
                        style={{ opacity: 0.1 }}
                      />
                      <motion.circle
                        className="progress-ring-fill"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="8"
                        strokeDasharray="326.7"
                        initial={{ strokeDashoffset: 326.7 }}
                        animate={{ strokeDashoffset: 36 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                      />
                    </svg>
                    <div className="progress-ring-text">
                      <motion.span
                        className="progress-ring-value"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                      >
                        91%
                      </motion.span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "var(--space-4)",
                  }}
                >
                  {[
                    { label: "AWS S3 Encryption", status: "Verified", color: "var(--color-success)" },
                    { label: "Okta MFA Policies", status: "Syncing", color: "var(--color-primary-400)" }
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="flex items-center gap-3">
                        <Bot size={16} className="text-primary-400" />
                        <span className="text-sm font-medium">{task.label}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: task.color }}>{task.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-10 -right-10 animate-float" style={{ animationDelay: "1s" }}>
                <div className="card glass p-4 rounded-xl border-emerald-500/20 shadow-glow">
                  <Shield size={24} className="text-emerald-400" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-10 animate-float" style={{ animationDelay: "2s" }}>
                <div className="card glass p-4 rounded-xl border-teal-500/20 shadow-glow">
                  <Zap size={24} className="text-teal-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Experience Section */}
      <section style={{ padding: "var(--space-24) 0", background: "linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.05), transparent)" }}>
        <div className="container">
          <div className="hero-grid" style={{ gridTemplateColumns: "1fr 1.2fr" }}>
            <div className="order-2 md:order-1">
              <div className="card card-premium p-0 overflow-hidden" style={{ minHeight: 400 }}>
                <div className="bg-neutral-900/50 p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Autonomous Terminal v2.1</div>
                </div>
                <div className="p-6 font-mono text-xs space-y-3">
                  <div className="text-primary-400 animate-pulse-glow inline-block px-2 py-0.5 rounded bg-primary-500/10 mb-2">[AGENT_INITIATED]</div>
                  <div className="text-neutral-300">$ certiflow-agent analyze-cloud-infra --scope=SOC2-CC6.1</div>
                  <div className="text-neutral-500">{">"} Accessing AWS Console via headless browser...</div>
                  <div className="text-neutral-500">{">"} Verifying IAM Role "Compliance-Scanner-V4"</div>
                  <div className="text-success">{">"} SUCCESS: IAM Policy strictly enforces MFA (Policy-ID: p-09x8)</div>
                  <div className="text-neutral-500">{">"} Capturing cryptographically signed screenshot...</div>
                  <div className="text-primary-400">{">"} Uploading to Evidence Vault [Hash: 0x77ab...f2]</div>
                  <div className="text-neutral-300 animate-fade-in" style={{ animationDelay: "2s" }}>$ _</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl mb-6">Autonomous <span className="text-gradient">Agentic</span> Workflows</h2>
              <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                Unlike traditional tools that simply check APIs, CertiFlow agents perform actual work. They log into consoles, verify configurations visually, and even perform remediation steps—just like a human security engineer would.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Visual Verification", desc: "Agents take and sign screenshots as absolute proof." },
                  { title: "Zero API Dependence", desc: "If you can see it in a browser, CertiFlow can audit it." },
                  { title: "Continuous Loop", desc: "Never drifts. If a setting changes, the agent fixes it instantly." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-200">{item.title}</h4>
                      <p className="text-xs text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{ padding: "var(--space-24) 0", position: "relative" }}
      >
        <div className="container">
          <div
            style={{
              textAlign: "center",
              marginBottom: "var(--space-16)",
            }}
          >
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              The Last Compliance Tool <br /> You&apos;ll <span className="text-gradient">Ever Need</span>
            </h2>
            <p
              style={{
                color: "var(--color-neutral-400)",
                fontSize: "var(--text-lg)",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Building a world-class security posture shouldn&apos;t be a full-time job.
            </p>
          </div>

          <div className="features-grid stagger">
            <FeatureCard
              icon={<Bot size={24} className="text-primary-400" />}
              title="Agentic Verification"
              description="AI agents autonomously navigate cloud consoles and verify security controls with visual proof."
            />
            <FeatureCard
              icon={<Shield size={24} className="text-teal-400" />}
              title="7-Day Certification"
              description="Compress months of effort into one week. Reach peak audit-readiness at record speed."
            />
            <FeatureCard
              icon={<RefreshCw size={24} className="text-indigo-400" />}
              title="Auto-Remediation"
              description="Detected a gap? Let our agents fix it for you with one click, from MFA resets to firewall patches."
            />
            <FeatureCard
              icon={<Lock size={24} className="text-violet-400" />}
              title="Trust Center"
              description="A live, public-facing dashboard of your security posture, verified by cryptographically signed logs."
            />
            <FeatureCard
              icon={<FileCheck size={24} className="text-primary-400" />}
              title="Multi-Framework Mapping"
              description="One piece of evidence. Automatic satisfaction of SOC 2, ISO 27001, HIPAA, and more."
            />
            <FeatureCard
              icon={<Zap size={24} className="text-amber-400" />}
              title="Vendor Risk Management"
              description="Automate the collection and analysis of your downstream vendors' compliance posture."
            />
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section
        id="frameworks"
        style={{
          padding: "var(--space-24) 0",
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="container">
          <div
            style={{
              textAlign: "center",
              marginBottom: "var(--space-16)",
            }}
          >
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Supported Frameworks
            </h2>
            <p
              style={{
                color: "var(--color-neutral-400)",
                fontSize: "var(--text-lg)",
              }}
            >
              One platform. Unlimited frameworks. Complete coverage.
            </p>
          </div>

          <div
            className="frameworks-grid stagger"
          >
            {[
              { name: "SOC 2 Type II", controls: 116, color: "#10b981" },
              { name: "ISO 27001", controls: 93, color: "#3b82f6" },
              { name: "HIPAA", controls: 54, color: "#8b5cf6" },
              { name: "GDPR", controls: 72, color: "#ec4899" },
              { name: "PCI-DSS", controls: 264, color: "#f59e0b" },
              { name: "NIST 800-53", controls: 325, color: "#06b6d4" },
              { name: "DORA", controls: 89, color: "#84cc16" },
              { name: "Custom", controls: "∞", color: "#6366f1" },
            ].map((framework, index) => (
              <div
                key={index}
                className="card"
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: `${framework.color}20`,
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-4)",
                  }}
                >
                  <Shield size={24} color={framework.color} />
                </div>
                <h4 style={{ marginBottom: "var(--space-2)" }}>
                  {framework.name}
                </h4>
                <p
                  style={{
                    color: "var(--color-neutral-400)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {framework.controls} controls
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <div
            style={{
              textAlign: "center",
              marginBottom: "var(--space-16)",
            }}
          >
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Simple, Transparent Pricing
            </h2>
            <p
              style={{
                color: "var(--color-neutral-400)",
                fontSize: "var(--text-lg)",
              }}
            >
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Starter */}
            <div
              className="card card-premium"
              style={{ padding: "var(--space-8)", position: "relative" }}
            >
              <h3 style={{ marginBottom: "var(--space-2)" }}>Starter</h3>
              <p
                style={{
                  color: "var(--color-neutral-400)",
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Perfect for early-stage startups
              </p>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <span
                  style={{
                    fontSize: "var(--text-4xl)",
                    fontWeight: "var(--font-bold)",
                  }}
                >
                  $4,999
                </span>
                <span style={{ color: "var(--color-neutral-400)" }}>/year</span>
              </div>
              <ul
                className="space-y-4 mb-8"
                style={{ listStyle: "none", padding: 0 }}
              >
                {[
                  "1 Framework (SOC 2)",
                  "Autonomous Evidence Tracking",
                  "Unlimited Evidence Storage",
                  "Public Trust Center",
                  "Standard Agent credits",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-neutral-300"
                  >
                    <CheckCircle2 size={14} className="text-primary-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/demo" className="btn btn-secondary w-full">
                Get Started
              </a>
            </div>

            {/* Growth - Most Popular */}
            <div
              className="card card-premium"
              style={{
                padding: "var(--space-8)",
                position: "relative",
                border: "2px solid var(--color-primary-500)",
                transform: "scale(1.05)",
                zIndex: 2
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))",
                  padding: "var(--space-1) var(--space-4)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-semibold)",
                  color: "white",
                  boxShadow: "var(--shadow-glow)"
                }}
              >
                THE AUDIT KILLER
              </div>
              <h3 style={{ marginBottom: "var(--space-2)" }}>Growth</h3>
              <p
                style={{
                  color: "var(--color-neutral-400)",
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-6)",
                }}
              >
                For high-growth scale-ups
              </p>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <span
                  style={{
                    fontSize: "var(--text-4xl)",
                    fontWeight: "var(--font-bold)",
                  }}
                >
                  $14,999
                </span>
                <span style={{ color: "var(--color-neutral-400)" }}>/year</span>
              </div>
              <ul
                className="space-y-4 mb-8"
                style={{ listStyle: "none", padding: 0 }}
              >
                {[
                  "Unlimited Frameworks",
                  "Advanced Agentic Computer Use",
                  "Autonomous Remediation",
                  "Zero-Trust Proof Signatures",
                  "Custom Mapping Engine",
                  "Priority Agent Queueing",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-neutral-100 font-medium"
                  >
                    <CheckCircle2 size={14} className="text-primary-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/demo" className="btn btn-primary w-full shadow-glow">
                Scale Securely
              </a>
            </div>

            {/* Enterprise */}
            <div
              className="card card-premium"
              style={{ padding: "var(--space-8)", position: "relative" }}
            >
              <h3 style={{ marginBottom: "var(--space-2)" }}>Enterprise</h3>
              <p
                style={{
                  color: "var(--color-neutral-400)",
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-6)",
                }}
              >
                For global organizations
              </p>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <span
                  style={{
                    fontSize: "var(--text-4xl)",
                    fontWeight: "var(--font-bold)",
                  }}
                >
                  Custom
                </span>
              </div>
              <ul
                className="space-y-4 mb-8"
                style={{ listStyle: "none", padding: 0 }}
              >
                {[
                  "Private Cloud Deployment",
                  "Dedicated AI Security Advisor",
                  "Custom Framework Designer",
                  "On-Premise Agent Integration",
                  "White-Glove Onboarding",
                  "Formal Auditor Liaison",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-neutral-300"
                  >
                    <CheckCircle2 size={14} className="text-primary-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/demo" className="btn btn-secondary w-full">
                Talk to Security Lead
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "var(--space-16)",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(45, 212, 191, 0.05) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Ready to Eliminate Your Compliance Tax?
            </h2>
            <p
              style={{
                color: "var(--color-neutral-400)",
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-8)",
                maxWidth: 600,
                margin: "0 auto var(--space-8)",
              }}
            >
              Join hundreds of companies that have reduced audit prep time by
              85% with CertiFlow AI.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/demo" className="btn btn-primary btn-lg">
                Start Free Trial <ArrowRight size={18} />
              </a>
              <a href="/demo" className="btn btn-secondary btn-lg">
                Schedule Demo <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "var(--space-12) 0",
          borderTop: "1px solid var(--glass-border)",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} color="var(--color-primary-500)" />
              <span style={{ fontWeight: "var(--font-semibold)" }}>
                CertiFlow AI
              </span>
            </div>
            <div
              style={{
                color: "var(--color-neutral-500)",
                fontSize: "var(--text-sm)",
              }}
            >
              © 2025 CertiFlow AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .nav-link {
          color: var(--color-neutral-400);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: color var(--transition-fast);
        }
        .nav-link:hover {
          color: var(--color-neutral-100);
        }
      `}</style>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div
        style={{
          width: 48,
          height: 48,
          background: "rgba(16, 185, 129, 0.1)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-primary-400)",
          marginBottom: "var(--space-4)",
        }}
      >
        {icon}
      </div>
      <h4 style={{ marginBottom: "var(--space-2)" }}>{title}</h4>
      <p
        style={{
          color: "var(--color-neutral-400)",
          fontSize: "var(--text-sm)",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}
