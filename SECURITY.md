# 🔒 Security & Privacy Policy: Researcher Campus

Researcher Campus is engineered with security-first design principles to safeguard intellectual property, proprietary academic manuscripts, and user credentials.

---

## 🛡️ 1. Supported Versions

| Version | Supported | Security Maintenance Status |
| :--- | :--- | :--- |
| `1.0.0.0` (Latest) | ✅ Yes | Active Security Patches & Dependency Audits |
| `< 1.0.0.0` | ❌ No | Please upgrade to the latest stable release |

---

## 🔐 2. Cryptographic Standards & Security Controls

### Dual-Token JWT Architecture
- **Access Tokens**: Short-lived (15 minutes), signed using SHA-256 HMAC secrets, verified per-request via `authMiddleware.ts`.
- **Refresh Tokens**: Long-lived (7 days), stored securely and rotated upon authentication.
- **Passwords**: Hashed with `bcrypt` (10 salt rounds) before persistence to MongoDB.

### Google Drive Credential Encryption
- All Google OAuth refresh tokens and credentials are encrypted at rest using **AES-256-GCM** authenticated encryption (`server/src/utils/crypto.ts`) with a 64-character hexadecimal key.

### Double-Blind Review Anonymity Guard
- Stage 6 pre-flight compliance automatically scans manuscripts for author names, university emails, institutional affiliations, and repository links to prevent double-blind peer-review policy violations.

---

## 🚨 3. Reporting a Vulnerability

If you discover a security vulnerability within Researcher Campus:
1. **Do not create a public GitHub issue.**
2. Send a detailed report to the security team via email: `security@researchercampus.org` (or directly to repository maintainers).
3. Include:
   - Description of the vulnerability.
   - Steps to reproduce or proof-of-concept payload.
   - Potential impact on user data or system integrity.
4. We commit to acknowledging receipt within 24 hours and providing an initial assessment and patch plan within 72 hours.
