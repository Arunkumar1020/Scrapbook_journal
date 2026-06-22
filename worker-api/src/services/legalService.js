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