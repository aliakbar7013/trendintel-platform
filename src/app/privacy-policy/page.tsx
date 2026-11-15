import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TrendIntel",
  description:
    "TrendIntel's privacy policy explaining data protection, Google AdSense cookies, analytics disclosure, and GDPR/CCPA compliance.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
          DATA GOVERNANCE & PRIVACY
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-400 font-mono">
          Effective Date: January 1, 2025 • Last Updated: Current Year
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-slate-300">
        <h2>1. Overview</h2>
        <p>
          TrendIntel (operated at <code>https://trendintel.blog</code>) respects your personal privacy. This document outlines the types of information collected when you access our publications, how that data is used, and your rights under global privacy regulations including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li><strong>Direct Communications:</strong> When you submit a dispatch or inquiry via our contact form, we collect your name, email address, subject, and message content to respond to your communication.</li>
          <li><strong>Automated Telemetry:</strong> Like most web publications, our servers record standard HTTP request logs (IP addresses, browser type, referring pages, timestamps) solely for security monitoring, DDoS mitigation, and diagnostic performance.</li>
          <li><strong>Cookies & Web Beacons:</strong> We may use cookies to remember session preferences and understand aggregate reader traffic.</li>
        </ul>

        <h2>3. Google AdSense & Third-Party Advertising</h2>
        <p>
          TrendIntel may display advertising served by Google AdSense and authorized third-party ad networks. Google uses cookies (including the DoubleClick cookie) to serve ads based on prior visits to our website or other sites on the Internet:
        </p>
        <ul>
          <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400">Google Ads Settings</a>.</li>
          <li>Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-400">aboutads.info</a>.</li>
        </ul>

        <h2>4. Data Retention and Security</h2>
        <p>
          We employ industry-standard encryption (TLS/SSL) for all data in transit. Inquiries submitted via our contact portal are stored securely in our private MySQL database and are never sold, rented, or leased to marketing brokers.
        </p>

        <h2>5. Your Privacy Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to request access to, correction of, or deletion of your personal data held in our systems. To exercise these rights, email <code>privacy@trendintel.blog</code>.
        </p>
      </div>
    </div>
  );
}
