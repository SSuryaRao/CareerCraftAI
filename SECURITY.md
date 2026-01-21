# Security Policy

## Proprietary Software Notice

**CareerCraft AI** is proprietary software. This repository is shared for portfolio and demonstration purposes only. Unauthorized use, reproduction, or distribution is strictly prohibited. See [LICENSE](LICENSE) for complete terms.

## Reporting a Vulnerability

We take the security of CareerCraft AI seriously. If you discover a security vulnerability, please follow responsible disclosure practices.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues via:

1. **Email:** suryaraosodi@gmail.com
2. **Subject Line:** "Security Vulnerability Report - CareerCraft AI"

### What to Include

Please provide the following information:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up

### Response Timeline

- **Initial Response:** Within 48 hours of report
- **Status Update:** Within 7 days with assessment
- **Fix Timeline:** Depends on severity (Critical: 1-3 days, High: 1-2 weeks, Medium: 2-4 weeks)

### Severity Levels

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | Allows unauthorized access to user data or system compromise | Authentication bypass, SQL injection |
| **High** | Significant security impact but limited scope | XSS, CSRF, privilege escalation |
| **Medium** | Security issue with moderate impact | Information disclosure, minor auth issues |
| **Low** | Minor security concern | Verbose error messages, missing headers |

### Security Measures Currently Implemented

Our platform implements multiple layers of security:

#### Authentication & Authorization
- ✅ Firebase Authentication with JWT tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ Email verification enforcement
- ✅ Admin-level authorization checks
- ✅ Token expiration and refresh mechanisms

#### API Security
- ✅ Rate limiting (500 requests/15 minutes)
- ✅ CORS with strict origin whitelisting
- ✅ Helmet.js security headers
- ✅ Request payload size limits (10MB)
- ✅ HTTP request logging

#### Data Protection
- ✅ MongoDB connection encryption
- ✅ Environment variable isolation
- ✅ Secure credential management
- ✅ Input validation and sanitization
- ✅ Query timeout protection

#### Payment Security
- ✅ Razorpay payment signature verification
- ✅ HMAC-SHA256 signature validation
- ✅ Secure webhook handling

#### Infrastructure Security
- ✅ Google Cloud Platform security features
- ✅ Cloud Run with automatic HTTPS
- ✅ Firebase security rules
- ✅ Cloud Storage bucket policies

### Out of Scope

The following are **NOT** considered security vulnerabilities:

- Issues that require physical access to a user's device
- Social engineering attacks
- Denial of Service (DoS) attacks
- Issues in third-party services (Google Cloud, Firebase, Razorpay)
- Vulnerabilities in outdated browsers
- Issues that require user to install malware
- Theoretical vulnerabilities without proof of concept

### Bug Bounty

We currently do not offer a bug bounty program. However, we greatly appreciate responsible disclosure and will acknowledge contributors who help improve our security.

### Acknowledgments

We will publicly acknowledge security researchers who responsibly disclose vulnerabilities (with their permission) in our:
- Security Hall of Fame (coming soon)
- Release notes for security patches
- Project documentation

### Legal

This security policy is provided in good faith. By reporting security issues, you agree to:
- Not publicly disclose the vulnerability until it has been addressed
- Not exploit the vulnerability beyond what is necessary to demonstrate it
- Comply with all applicable laws and regulations

### Contact

For security inquiries or concerns:
- **Email:** suryaraosodi@gmail.com
- **Response Time:** Within 48 hours

---

**Last Updated:** January 21, 2026

**Note:** This is proprietary software. Viewing this repository does not grant any license to use, modify, or distribute the code. See [LICENSE](LICENSE) for complete terms.
