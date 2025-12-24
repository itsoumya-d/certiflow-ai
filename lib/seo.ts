/**
 * JSON-LD Structured Data for CertiFlow AI
 * https://developers.google.com/search/docs/appearance/structured-data
 */

export interface OrganizationSchema {
    "@context": "https://schema.org";
    "@type": "Organization";
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
    contactPoint: {
        "@type": "ContactPoint";
        telephone: string;
        contactType: string;
        areaServed: string;
        availableLanguage: string[];
    };
}

export interface SoftwareApplicationSchema {
    "@context": "https://schema.org";
    "@type": "SoftwareApplication";
    name: string;
    applicationCategory: string;
    operatingSystem: string;
    offers: {
        "@type": "Offer";
        price: string;
        priceCurrency: string;
    };
    aggregateRating?: {
        "@type": "AggregateRating";
        ratingValue: string;
        ratingCount: string;
    };
}

export interface FAQSchema {
    "@context": "https://schema.org";
    "@type": "FAQPage";
    mainEntity: Array<{
        "@type": "Question";
        name: string;
        acceptedAnswer: {
            "@type": "Answer";
            text: string;
        };
    }>;
}

// Organization Schema
export const organizationSchema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CertiFlow AI",
    url: "https://certiflow.ai",
    logo: "https://certiflow.ai/logo.png",
    sameAs: [
        "https://twitter.com/certiflowai",
        "https://linkedin.com/company/certiflowai",
        "https://github.com/certiflowai",
    ],
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-888-CERTIFLOW",
        contactType: "sales",
        areaServed: "Worldwide",
        availableLanguage: ["English", "German"],
    },
};

// Software Application Schema
export const softwareApplicationSchema: SoftwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CertiFlow AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "4999",
        priceCurrency: "USD",
    },
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "127",
    },
};

// FAQ Schema (for landing page)
export const faqSchema: FAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How long does it take to get SOC 2 certified with CertiFlow AI?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "With CertiFlow AI, most companies achieve audit readiness in 7 days, compared to the industry average of 6-12 weeks. Our autonomous agents automate 95% of evidence collection and control verification.",
            },
        },
        {
            "@type": "Question",
            name: "What compliance frameworks does CertiFlow AI support?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "CertiFlow AI supports 20+ frameworks including SOC 2 Type I & II, ISO 27001, HIPAA, GDPR, PCI-DSS, SOC 1, NIST CSF, and more. Our cross-mapping feature lets you reuse evidence across multiple frameworks.",
            },
        },
        {
            "@type": "Question",
            name: "How is CertiFlow AI different from Vanta or Drata?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "CertiFlow AI uses Agentic AI (Gemini Computer Use) to go beyond simple API integrations. Our agents can navigate cloud consoles, take timestamped screenshots, and verify configurations that other tools cannot access automatically.",
            },
        },
        {
            "@type": "Question",
            name: "Do I need technical expertise to use CertiFlow AI?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. CertiFlow AI is designed for compliance managers and VPs of Engineering without deep security expertise. Our AI guides you through the entire process and auto-generates policies tailored to your organization.",
            },
        },
    ],
};

// Helper to generate script tag content
export function generateJsonLd(schema: object): string {
    return JSON.stringify(schema);
}
