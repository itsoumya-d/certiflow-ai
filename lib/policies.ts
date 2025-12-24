// Core types for Policy Management

export type PolicyStatus = 'draft' | 'review' | 'active' | 'archived';
export type PolicyCategory = 'security' | 'hr' | 'operational' | 'privacy';

export interface Policy {
    id: string;
    title: string;
    description: string;
    category: PolicyCategory;
    status: PolicyStatus;
    version: string;

    // Content
    content: string; // Markdown or HTML content

    // Metadata
    owner: string; // User ID
    createdAt: Date;
    updatedAt: Date;
    approvedAt?: Date;
    approvedBy?: string; // User ID

    // Compliance
    frameworks: string[]; // e.g., ["SOC 2", "ISO 27001"]
    controls: string[]; // e.g., ["CC1.2", "A.5.1"]

    // Review cycle
    reviewFrequencyDays: number; // e.g., 365 for annual review
    nextReviewDate?: Date;
}

export interface PolicyTemplate {
    id: string;
    title: string;
    category: PolicyCategory;
    defaultContent: string; // Standard boilerplate text
    recommendedControls: string[];
}

// Example templates that would be seeded in the DB
export const POLICY_TEMPLATES: PolicyTemplate[] = [
    {
        id: "tmpl_aup",
        title: "Acceptable Use Policy",
        category: "hr",
        defaultContent: `# Acceptable Use Policy

## 1. Purpose
The purpose of this policy is to outline the acceptable use of computer equipment at the Company. These rules are in place to protect the employee and the Company. Inappropriate use exposes the Company to risks including virus attacks, compromise of network systems and services, and legal issues.

## 2. Scope
This policy applies to the use of information, electronic and computing devices, and network resources to conduct Company business or interact with internal networks and business systems, whether owned or leased by the Company, the employee, or a third party.

## 3. Policy
### 3.1 General Use and Ownership
1. Company proprietary information stored on electronic and computing devices whether owned or leased by the Company, the employee or a third party, remains the sole property of the Company. 
2. You have a responsibility to promptly report the theft, loss, or unauthorized disclosure of Company proprietary information.
3. You may access, use or share Company proprietary information only to the extent it is authorized and necessary to fulfill your assigned job duties.

### 3.2 Security and Proprietary Information
1. All mobile and computing devices that connect to the internal network must be secured with a password-protected screensaver with the automatic activation feature set at 10 minutes or less, or by logging-off when the device is unattended.
2. Postings by employees from a Company email address to newsgroups should contain a disclaimer stating that the opinions expressed are strictly their own and not necessarily those of the Company, unless posting is in the course of business duties.
3. All hosts used by the employee that are connected to the Company Internet/Intranet/Extranet, whether owned by the employee or the Company, shall be continually executing approved virus-scanning software with a current virus database.

### 3.3 Unacceptable Use
The following activities are strictly prohibited. Potential violations may include, but are not limited to:
1. Violations of the rights of any person or company protected by copyright, trade secret, patent or other intellectual property, or similar laws or regulations, including, but not limited to, the installation or distribution of "pirated" or other software products that are not appropriately licensed for use by the Company.
2. Unauthorized copying of copyrighted material including, but not limited to, digitization and distribution of photographs from magazines, books or other copyrighted sources, copyrighted music, and the installation of any copyrighted software for which the Company or the end user does not have an active license is strictly prohibited.
3. Accessing data, a server or an account for any purpose other than conducting Company business, even if you have authorized access, is prohibited.`,
        recommendedControls: ["CC9.1", "A.13.2.1"]
    },
    {
        id: "tmpl_access",
        title: "Access Control Policy",
        category: "security",
        defaultContent: `# Access Control Policy

## 1. Overview
Access to systems and data is restricted to authorized users who have a legitimate business need. This policy defines the standards for granting, reviewing, and revoking access to Company systems.

## 2. Policy
### 2.1 User Registration
1. All users must have a unique identifier (user ID) for their personal use only.
2. Shared accounts are prohibited unless explicitly authorized and documented.

### 2.2 Password Management
1. Passwords must be at least 12 characters long.
2. Passwords must contain a mix of uppercase, lowercase, numbers, and special characters.
3. Multi-Factor Authentication (MFA) is required for all remote access and cloud systems.

### 2.3 Access Review
1. User access rights are reviewed quarterly.
2. Access is revoked immediately upon termination of employment (within 24 hours).`,
        recommendedControls: ["CC6.1", "A.9.2.1", "CC6.2"]
    },
    {
        id: "tmpl_ir",
        title: "Incident Response Policy",
        category: "operational",
        defaultContent: `# Incident Response Policy

## 1. Purpose
This policy establishes a plan for managing and responding to information security incidents.

## 2. Policy
### 2.1 Reporting
1. All employees are required to report suspected security incidents immediately to 'security@company.com'.
2. Incidents include (but are not limited to): phishing attempts, lost devices, unauthorized access.

### 2.2 Response Process
1. **Identification:** Verify if an incident has occurred.
2. **Containment:** Prevent further damage (e.g., disconnect network).
3. **Eradication:** Remove the threat (e.g., delete malware).
4. **Recovery:** Restore systems to normal operation.
5. **Lessons Learned:** Post-incident review to prevent recurrence.`,
        recommendedControls: ["CC7.3", "A.16.1"]
    },
    {
        id: "tmpl_data",
        title: "Data Classification Policy",
        category: "privacy",
        defaultContent: `# Data Classification Policy

## 1. Classification Levels
Data is classified into the following categories:

### Level 1: Public
Information intended for public release (e.g., Marketing materials).

### Level 2: Internal
Information for internal use only (e.g., Org charts, internal memos).

### Level 3: Confidential
Sensitive information requiring strict access control (e.g., Customer data, PII, source code).

### Level 4: Restricted
Highly sensitive information where unauthorized disclosure could cause severe damage (e.g., Private keys, passwords, M&A data).

## 2. Handling Requirements
- **Confidential/Restricted** data must be encrypted at rest and in transit.
- **Restricted** data must not be stored on portable devices/USBs.`,
        recommendedControls: ["CC3.1", "A.8.2"]
    }
];
