# 🔒 Security & Data Privacy Architecture: Researcher Campus

> **Document Version**: `v1.0.0.0 Production Specification`  
> **Security Status**: Active Security Patching & Continuous Auditing  
> **Maintainer**: Researcher Campus Security Engineering Team

---

## 📑 Table of Contents
1. [Security Philosophy & Scope](#1-security-philosophy--scope)
2. [Supported Versions](#2-supported-versions)
3. [Cryptographic Standards & Token Management](#3-cryptographic-standards--token-management)
4. [Backend Isolation & AI Proxy Architecture](#4-backend-isolation--ai-proxy-architecture)
5. [Academic Privacy & Double-Blind Protection](#5-academic-privacy--double-blind-protection)
6. [Cloud Integration Security (Google OAuth & Drive)](#6-cloud-integration-security-google-oauth--drive)
7. [Vulnerability Disclosure Protocol](#7-vulnerability-disclosure-protocol)

---

## 1. Security Philosophy & Scope

Academic research involves sensitive intellectual property, unpublished empirical methodologies, proprietary datasets, and pre-peer-review manuscripts. A premature leak of an academic draft or author identity can cause:
- **Scooping Risks**: Competing research groups publishing similar findings before peer review.
- **Double-Blind Desk-Rejections**: Automatic disqualification from conferences like *NeurIPS*, *ICLR*, *CVPR*, *ACM SIGMOD*, and *IEEE S&P*.
- **Data Privacy Breaches**: Accidental exposure of institutional EHR datasets or patient information.

Researcher Campus treats security and privacy as foundational engineering requirements rather than afterthoughts.

---

## 2. Supported Versions

| Version | Status | Patch Support | Security Maintenance |
| :--- | :--- | :--- | :--- |
| `1.0.0.0` (Latest) | 🟢 Active Release | Full Support | Continuous dependency scans & active patching |
| `< 1.0.0.0` | 🔴 End of Life | Unsupported | Please upgrade to the latest stable release |

---

## 3. Cryptographic Standards & Token Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DUAL-TOKEN JWT AUTHENTICATION                       │
├────────────────────────────────┬────────────────────────────────────────────┤
│ Short-Lived Access Token       │ • Expiration: 15 Minutes                   │
│                                │ • Payload: userId, email, persona          │
│                                │ • Signing: SHA-256 HMAC (JWT_SECRET)       │
│                                │ • Transmission: Authorization: Bearer      │
├────────────────────────────────┼────────────────────────────────────────────┤
│ Long-Lived Refresh Token       │ • Expiration: 7 Days                       │
│                                │ • Signing: SHA-256 HMAC (JWT_REFRESH_SECRET│
│                                │ • Storage: httpOnly, SameSite=Strict       │
│                                │ • Rotation: Auto-refreshed via Axios Inter.│
└────────────────────────────────┴────────────────────────────────────────────┘
```

### Password Protection:
- User passwords are never stored in plaintext.
- Passwords are salted and hashed using **`bcrypt`** with 10 calculation rounds before persistence to MongoDB Atlas.

### Google OAuth Credential Encryption:
- Third-party cloud integration tokens (such as Google Drive OAuth credentials) are encrypted at rest using **AES-256-GCM** authenticated encryption (`server/src/utils/crypto.ts`).
- Encryption keys require exactly 64 hexadecimal characters (`ENCRYPTION_KEY`), ensuring 256-bit entropy with unique initialization vectors (IV) per document.

---

## 4. Backend Isolation & AI Proxy Architecture

```
[Browser / React Client] ────(NO API Keys)────▶ [Express API Backend] ────(Secure Env)────▶ [Google Gemini Pro]
```

- **Zero Client-Side Exposure**: API keys (`GEMINI_API_KEY`, `GOOGLE_API_KEY`, `JWT_SECRET`, `MONGODB_URI`) are strictly loaded into memory on the backend server and never compiled into frontend client bundles.
- **Dynamic CORS Origin Sanitization**: Express CORS middleware verifies requesting origins dynamically, supporting explicit local origins (`localhost:3000`, `localhost:5173`) and designated production domains (`*.vercel.app`), preventing unauthorized cross-origin data extraction.

---

## 5. Academic Privacy & Double-Blind Protection

### Automated Stage 6 Anonymity Guard:
To guarantee compliance with double-blind review mandates, Stage 6 (`PreFlightAudit.tsx`) executes heuristic regex and pattern-matching scanners to detect and redact:
- Author names and co-author rosters.
- Institutional emails (e.g. `@mit.edu`, `@stanford.edu`, `@ox.ac.uk`).
- Explicit university, institute, or departmental affiliations.
- Identifying funding grant identifiers and non-anonymized GitHub repositories.

---

## 6. Cloud Integration Security (Google OAuth & Drive)

- **Least-Privilege Scopes**: The system requests only minimal necessary scopes (`email`, `profile`, `drive.file`) rather than broad cloud permissions.
- **Granular Drive File Sandboxing**: The Google Drive integration writes only to documents explicitly created by Researcher Campus without accessing unrelated user files.

---

## 7. Vulnerability Disclosure Protocol

We welcome responsible security research and vulnerability reporting.

If you believe you have discovered a security issue or vulnerability:
1. **Do NOT open a public GitHub issue or discussion thread.**
2. Send an email to the maintainers at: 👉 `security@researchercampus.org` (or contact via GitHub Security Advisories).
3. Include:
   - Detailed description of the vulnerability.
   - Exact reproduction steps or proof-of-concept payload.
   - Assessment of potential impact and affected components.
4. **Our Commitment**:
   - **Triage**: Acknowledgment of report receipt within **24 hours**.
   - **Assessment**: Initial severity assessment within **48 hours**.
   - **Remediation**: Dedicated patch release and public advisory credit within **7 to 14 business days**.

---
*Verified by Researcher Campus Security Operations • August 2026*
