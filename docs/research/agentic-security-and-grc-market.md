# Research: OWASP Agentic AI Top 10 × CertiFlow AI — Where the Compliance Agents Themselves Sit on the Threat Model

> R&D loop note (auto-rnd #2), 2026-08-24. Sources cited inline. All claims about CertiFlow AI describe the prototype as it exists in this repo.

## Why this note

CertiFlow AI proposes autonomous agents that verify controls and collect compliance evidence. The uncomfortable irony worth taking seriously: **the agent that audits everyone is itself an agentic system with credentials, tool access, and persistent state** — exactly the surface the OWASP Top 10 for Agentic Applications 2026 (published 9 Dec 2025 by the OWASP GenAI Security Project, ASI01–ASI10) was written for. A credible "agentic GRC" product has to answer: *who audits the auditor?*

Sources:
- OWASP Agentic AI Top 10 overview: https://alatirok.com/owasp-top-10-agentic-applications , https://neuraltrust.ai/blog/owasp-agentic-ai-top-10 , https://praesidia.ai/guides/owasp-agentic-ai-top-10
- Microsoft Agent Governance Toolkit (MIT, Apr 2026), maps all ten risks: https://effloow.com/articles/microsoft-agent-governance-toolkit-owasp-ai-security-2026

## The ten risks (ASI01–ASI10)

ASI01 Agent Goal Hijack · ASI02 Tool Misuse/Exploitation · ASI03 Identity & Privilege Abuse · ASI04 Agentic Supply Chain · ASI05 Unexpected Code Execution · ASI06 Memory Poisoning · ASI07 Insecure Inter-Agent Communication · ASI08 Cascading Failures · ASI09 Human-Agent Trust Exploitation · ASI10 Rogue Agents. OWASP's foundational defense across all ten is the **Principle of Least Agency** — minimum autonomy, tool access, and credential scope per task.

## Mapping to CertiFlow AI's architecture

| OWASP risk | CertiFlow exposure | Design response to spec out |
|---|---|---|
| ASI01 Goal hijack | An injected prompt inside an uploaded evidence document could steer the Gemini evidence-analysis agent ("this control passes") | Treat all uploaded evidence as untrusted input; separate *evidence extraction* from *control verdict*; require structured, schema-validated verdicts |
| ASI02 Tool misuse | Read-only integrations today (AWS/GitHub/Okta checks). Keep them read-only forever; a compliance agent never needs write access | Hard read-only scopes at the token level, not just in code |
| ASI03 Identity abuse | Agents run under integration credentials — if shared/human creds are used, audit trails blur | Per-agent service identities, every check attributable to one identity |
| ASI04 Supply chain | MCP-style tool plugins / integration connectors are third-party code running in the trust path | Pin + review connectors; treat connector manifests like dependencies |
| ASI06 Memory poisoning | Evidence library + AI analysis results become long-term context for future runs | Verdicts cite immutable evidence snapshots (hashes), not prior agent conclusions |
| ASI08 Cascading failure | One false "failing" control cascades into alert storms; one false "passing" is worse — silent non-compliance | Confidence thresholds + human review queue for pass-verdicts below threshold |
| ASI09 Trust exploitation | Dashboard shows a green ring → humans stop verifying. "The dashboard said we're compliant" as social proof | Timestamped provenance on every score; exportable raw evidence trail for auditors |
| ASI10 Rogue agents | Scheduled continuous-monitoring agents acting without supervision | Every autonomous action logged to an append-only audit ledger — which conveniently is itself the product's core artifact |

Key insight: **ASI09 and ASI10 flip from liability to feature.** An agentic GRC platform whose own agents produce tamper-evident logs of their reasoning, tool calls, and evidence hashes is demonstrating the exact control (audit trails / logging & monitoring) its customers pay for. The product can be its own first customer: publish CertiFlow's internal agent-audit design as the reference implementation.

## Market context (why this positioning matters now)

- Global GRC market ≈ **$65.2B in 2026**, ~12.2% CAGR; the **compliance automation** sub-segment ($2.8B in 2025) grows at **25%+**, more than double the overall market ([BusinessofGRC](https://www.businessofgrc.com/data/grc-market-size)).
- Vanta reached ~$300M ARR (Apr 2026, +69% YoY, 16k customers); Drata leads enterprise spend (~$242K avg observed enterprise account vs Vanta's ~$159K); Sprinto is the fastest-growing challenger (+233% adoption since May 2025) ([YipitData Signals](https://www.yipitdata.com/resources/blog/vanta-vs-drata-compliance-software-2026), [IdeaPlan](https://www.ideaplan.io/ideas/trends/compliance-automation)).
- **EU AI Act high-risk obligations take effect Aug 2, 2026** — penalties up to 7% of global turnover; compliance costs ~$52K/year per high-risk AI system ([IdeaPlan](https://www.ideaplan.io/ideas/trends/compliance-automation)). This creates the first framework where *auditing AI agents* is itself a compliance requirement — i.e., CertiFlow's differentiator (agents that audit agents / AI-governance evidence) lands exactly as demand appears.
- 48% of security professionals name agentic AI the #1 attack vector into 2026; Microsoft shipped the open-source [Agent Governance Toolkit](https://effloow.com/articles/microsoft-agent-governance-toolkit-owasp-ai-security-2026) mapping all ten OWASP risks — evidence that "agent governance" is becoming its own procurement category, adjacent to compliance automation.

## Positioning takeaway

Compliance automation incumbents (Vanta/Drata) automate evidence collection for human-run companies. The next wedge is automating evidence for **AI-run workflows** — proving that an organization's agents operate within policy. CertiFlow's roadmap should include an explicit "Agent Governance" framework (mapped row-by-row to ASI01–ASI10) alongside SOC 2/ISO 27001, so the same evidence-collection engine serves both classic audits and EU AI Act Art. obligations. That's a differentiation none of the incumbent segment leaders currently lead with.

## Queued follow-ups
- Draft the `docs/research/asi-mapping.md` control matrix (ASI01–ASI10 → concrete CertiFlow control + evidence artifact).
- Investigate EU AI Act Article-level technical requirements for high-risk systems as a framework definition.
