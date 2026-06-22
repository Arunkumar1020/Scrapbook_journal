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