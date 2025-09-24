'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsAndServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="prose prose-gray max-w-none">
          <p>
            These Terms of Service ("Terms") govern your access to and use of our project
            management web application (the "Service"). By accessing or using the Service,
            you agree to be bound by these Terms.
          </p>

          <h2>Use of the Service</h2>
          <ul>
            <li>You must provide accurate account information and safeguard your credentials.</li>
            <li>You are responsible for content you create, upload, or share via the Service.</li>
            <li>You will not misuse the Service or attempt to disrupt its operation or security.</li>
          </ul>

          <h2>Subscriptions and Billing</h2>
          <p>
            If the Service includes paid plans, fees are billed in advance on a recurring basis per
            your selected plan and are non-refundable except as required by law or expressly stated.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Service, including software, design, and content, is owned by us or our licensors and
            protected by applicable laws. You retain ownership of your data; granting us a limited
            license to host and process it to operate the Service.
          </p>

          <h2>Integrations and Third-Party Services</h2>
          <p>
            Certain features may rely on third-party services (e.g., authentication, calendars,
            email). Your use of those services is subject to their terms; we are not responsible for
            their actions or availability.
          </p>

          <h2>Termination</h2>
          <p>
            We may suspend or terminate access if you violate these Terms or if necessary to protect
            the Service or other users. You may stop using the Service at any time.
          </p>

          <h2>Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. To the maximum extent
            permitted by law, we are not liable for indirect, incidental, special, consequential, or
            exemplary damages.
          </p>

          <h2>Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes
            take effect constitutes acceptance of the updated Terms.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these Terms, contact support through the app or via the contact
            details in the site footer.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}


