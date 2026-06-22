export function getPrivacyPolicyData() {
  return {
    version: "1.0",
    effective_date: "2026-06-22",
    app_name: "ScrapBook Journal Tracker",
    company_name: "ScrapBook",
    contact_email: "support@scrapbook.app",
    sections: [
      {
        title: "Information We Collect",
        content:
          "We collect account information such as name, email address, password hash, journal entries, moods, uploaded image URLs, consent status, and audit activity required to operate the service.",
      },
      {
        title: "How We Use Your Data",
        content:
          "Your data is used to provide secure login, journal management, image uploads, admin management, data export, account deletion, and security monitoring.",
      },
      {
        title: "Consent",
        content:
          "During registration, users must provide consent for processing account and journal data. Consent details are stored with timestamp information.",
      },
      {
        title: "Data Export",
        content:
          "Users can export their account and journal data in JSON format from the Profile & Privacy page.",
      },
      {
        title: "Account Deletion",
        content:
          "Users can permanently delete their account. This removes the user account, journals, and uploaded images from storage.",
      },
      {
        title: "Security",
        content:
          "The platform uses JWT authentication, role-based access control, Cloudflare Worker secrets, HTTPS, and audit logging for security monitoring.",
      },
      {
        title: "Admin Access",
        content:
          "Administrators can monitor users, journals, and audit logs. Admin actions are logged for security and accountability.",
      },
      {
        title: "Data Retention",
        content:
          "User data is retained while the account is active. Deleted account data is removed from the application database and storage.",
      },
      {
        title: "User Rights",
        content:
          "Users can access, export, and delete their data. These features support privacy rights under GDPR-style and DPDP-style requirements.",
      },
    ],
  };
}

export function getDataRetentionPolicyData() {
  return {
    version: "1.0",
    effective_date: "2026-06-22",
    app_name: "ScrapBook Journal Tracker",
    retention_summary:
      "ScrapBook stores user data only for as long as needed to provide the journal service, support security monitoring, and satisfy operational requirements.",
    retention_rules: [
      {
        data_type: "User Account Data",
        examples: "Name, email, role, consent status",
        retention_period: "Until account deletion",
        deletion_method:
          "Removed from the users table when the user deletes the account or an admin deletes the user.",
      },
      {
        data_type: "Journal Data",
        examples: "Title, content, mood, created date",
        retention_period: "Until journal or account deletion",
        deletion_method:
          "Removed from the journals table when the journal or account is deleted.",
      },
      {
        data_type: "Uploaded Images",
        examples: "Journal image files stored in Cloudflare R2",
        retention_period: "Until journal or account deletion",
        deletion_method:
          "Deleted from the R2 bucket during journal, user, or account deletion cleanup.",
      },
      {
        data_type: "Authentication Data",
        examples: "Password hashes and JWT sessions",
        retention_period: "Until account deletion or token expiry",
        deletion_method:
          "Password hash is removed with the user account. JWTs expire automatically.",
      },
      {
        data_type: "Consent Records",
        examples: "Consent status and consent timestamp",
        retention_period: "Until account deletion",
        deletion_method:
          "Removed with the user account. Consent changes are also logged in audit logs.",
      },
      {
        data_type: "Audit Logs",
        examples:
          "Login events, data export events, account deletion, role changes",
        retention_period: "Recommended 180 days",
        deletion_method:
          "Can be cleaned up using scheduled retention cleanup in a future version.",
      },
    ],
    user_rights: [
      "Users can export their personal data from the Profile & Privacy page.",
      "Users can delete their account from the Profile & Privacy page.",
      "Users can manage consent from the Profile & Privacy page.",
      "Admins can review audit logs for security and compliance monitoring.",
    ],
    note:
      "This retention policy is part of the technical implementation and should be reviewed by a legal professional before production business use.",
  };
}
export function getIncidentResponsePlanData() {
  return {
    version: "1.0",
    effective_date: "2026-06-22",
    app_name: "ScrapBook Journal Tracker",
    purpose:
      "This Incident Response Plan defines how ScrapBook identifies, handles, investigates, and responds to security or privacy incidents.",
    severity_levels: [
      {
        level: "Low",
        description:
          "Minor issue with no user data exposure, such as temporary UI errors or non-sensitive logs.",
        response_time: "Within 72 hours",
      },
      {
        level: "Medium",
        description:
          "Limited security issue affecting a small number of users or non-critical systems.",
        response_time: "Within 24 hours",
      },
      {
        level: "High",
        description:
          "Confirmed unauthorized access, failed security controls, or possible personal data exposure.",
        response_time: "Immediately",
      },
      {
        level: "Critical",
        description:
          "Large-scale data breach, credential compromise, service abuse, or major system compromise.",
        response_time: "Immediate emergency response",
      },
    ],
    response_steps: [
      {
        step: "Detect",
        detail:
          "Monitor audit logs, failed logins, MFA failures, account deletions, and unusual admin activity.",
      },
      {
        step: "Contain",
        detail:
          "Restrict affected accounts, rotate secrets, disable suspicious access, and prevent further exposure.",
      },
      {
        step: "Investigate",
        detail:
          "Review audit logs, affected users, timestamps, IP-related metadata if available, and impacted data.",
      },
      {
        step: "Remediate",
        detail:
          "Patch the issue, update access controls, rotate credentials, and clean affected resources.",
      },
      {
        step: "Notify",
        detail:
          "Notify affected users or stakeholders when required by privacy, security, or business obligations.",
      },
      {
        step: "Review",
        detail:
          "Document the incident, improve controls, and update the security monitoring process.",
      },
    ],
    current_controls: [
      "JWT authentication",
      "Cloudflare Worker secrets",
      "Role-based access control",
      "MFA support",
      "Audit logs",
      "Failed login tracking",
      "Data export logging",
      "Account deletion logging",
      "Admin activity logging",
      "R2 image cleanup on deletion",
    ],
    contact_email: "support@scrapbook.app",
    note:
      "This incident response plan is a technical project document and should be reviewed by a legal/security professional before production business use.",
  };
}
export function getSecurityPolicyData() {
  return {
    version: "1.0",
    effective_date: "2026-06-22",
    app_name: "ScrapBook Journal Tracker",
    purpose:
      "This Security Policy explains the technical and operational safeguards used to protect ScrapBook accounts, journals, images, and administrative activity.",
    security_controls: [
      {
        title: "Authentication",
        description:
          "Users authenticate using email and password. Passwords are stored as password hashes, not plain text.",
      },
      {
        title: "JWT Authorization",
        description:
          "Authenticated sessions use JWT tokens. The signing secret is stored securely as a Cloudflare Worker secret.",
      },
      {
        title: "Multi-Factor Authentication",
        description:
          "Users can enable MFA using authenticator apps. MFA events are logged for security monitoring.",
      },
      {
        title: "Role-Based Access Control",
        description:
          "Admin pages and APIs are protected using role-based access control. Normal users cannot access admin functionality.",
      },
      {
        title: "Audit Logging",
        description:
          "Security and privacy events such as login, failed login, data export, consent changes, account deletion, and role changes are logged.",
      },
      {
        title: "Secure File Storage",
        description:
          "Uploaded journal images are stored in Cloudflare R2 and cleaned up during account or user deletion.",
      },
      {
        title: "Data Export and Deletion",
        description:
          "Users can export their data and permanently delete their account from the Profile & Privacy page.",
      },
      {
        title: "HTTPS Transport",
        description:
          "Frontend and backend traffic is served through HTTPS-enabled deployment platforms.",
      },
    ],
    admin_controls: [
      "Admin dashboard access is restricted to users with the admin role.",
      "Admins can review users, journals, audit logs, and security summaries.",
      "Admins can promote, demote, or delete users.",
      "Admin actions are logged for accountability.",
    ],
    recommendations: [
      "Rotate secrets periodically.",
      "Review failed login and MFA failure activity.",
      "Keep dependencies updated.",
      "Use strong passwords and enable MFA.",
      "Review audit logs regularly.",
      "Avoid sharing credentials or tokens.",
    ],
    contact_email: "support@scrapbook.app",
    note:
      "This security policy is a technical project document and should be reviewed before production business use.",
  };
}