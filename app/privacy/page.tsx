import LegalPage from "../components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        At <strong>AI Videxa</strong>, your privacy is important to us. This
        Privacy Policy explains how we collect, use, store, and protect your
        information when you access or use our website, applications, and
        services (collectively, the “Platform”).
      </p>

      <p>
        By using AI Videxa, you agree to the practices described in this policy.
      </p>

      {/* -------------------- */}
      <h2>1. Information We Collect</h2>

      <p>We may collect the following types of information:</p>

      <ul>
        <li>
          <strong>Personal Information:</strong> Name, email address, and
          account-related details provided during registration or login.
        </li>
        <li>
          <strong>Usage Information:</strong> Pages visited, features used,
          interaction data, device type, browser type, and approximate location
          (country-level).
        </li>
        <li>
          <strong>Content Data:</strong> Text, prompts, or files you submit for
          processing using AI Videxa tools.
        </li>
        <li>
          <strong>Payment Information:</strong> Billing-related data processed
          securely by third-party payment providers. AI Videxa does not store
          full payment card details.
        </li>
      </ul>

      {/* -------------------- */}
      <h2>2. How We Use Your Information</h2>

      <ul>
        <li>To provide, operate, and improve AI Videxa services</li>
        <li>To personalize your experience and preferences</li>
        <li>To maintain platform security and prevent fraud or misuse</li>
        <li>To communicate important updates, service notices, or support</li>
        <li>To comply with legal and regulatory obligations</li>
      </ul>

      {/* -------------------- */}
      <h2>3. AI & User Content</h2>

      <p>
        Content you submit to AI Videxa may be processed by artificial
        intelligence systems to generate results. We do not claim ownership of
        your content.
      </p>

      <p>
        AI outputs are generated automatically and may not always be accurate.
        You are responsible for reviewing and verifying any output before use.
      </p>

      {/* -------------------- */}
      <h2>4. Cookies & Tracking Technologies</h2>

      <p>
        AI Videxa uses cookies and similar technologies to ensure essential
        functionality, improve performance, and enhance user experience.
      </p>

      <p>
        You can manage or withdraw your consent at any time through our cookie
        consent banner or your browser settings.
      </p>

      {/* -------------------- */}
      <h2>5. Data Sharing & Third Parties</h2>

      <p>
        We do not sell your personal data. We may share information only with:
      </p>

      <ul>
        <li>Trusted service providers (authentication, analytics, payments)</li>
        <li>Legal authorities if required by law or regulation</li>
        <li>Business partners strictly for platform functionality</li>
      </ul>

      {/* -------------------- */}
      <h2>6. Data Security</h2>

      <p>
        We implement reasonable technical and organizational measures to protect
        your data against unauthorized access, loss, or misuse. However, no
        internet-based system can be guaranteed to be 100% secure.
      </p>

      {/* -------------------- */}
      <h2>7. Data Retention</h2>

      <p>
        We retain personal information only for as long as necessary to fulfill
        the purposes outlined in this policy, unless a longer retention period
        is required by law.
      </p>

      {/* -------------------- */}
      <h2>8. Your Rights</h2>

      <p>
        Depending on your location, you may have the right to:
      </p>

      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction or deletion of your data</li>
        <li>Withdraw consent where applicable</li>
        <li>Request data portability (where legally required)</li>
      </ul>

      {/* -------------------- */}
      <h2>9. Children’s Privacy</h2>

      <p>
        AI Videxa is not intended for children under the age of 13. We do not
        knowingly collect personal data from children.
      </p>

      {/* -------------------- */}
      <h2>10. Changes to This Policy</h2>

      <p>
        We may update this Privacy Policy from time to time. Continued use of AI
        Videxa after updates indicates acceptance of the revised policy.
      </p>

      {/* -------------------- */}
      <h2>11. Contact Us</h2>

      <p>
        If you have questions or concerns about this Privacy Policy or your data,
        please contact us at:
      </p>

      <p>
        <strong>Email:</strong> support@aividexa.com
      </p>
    </LegalPage>
  );
}
