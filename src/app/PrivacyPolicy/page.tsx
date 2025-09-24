'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-gray-600">Effective date: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="prose prose-gray max-w-none">
          <p>
            This Privacy Policy explains how we collect, use, and protect your information when you use
            our project management web application (the "Service"). By using the Service, you agree to the
            collection and use of information in accordance with this policy.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>Account data such as name, email, and authentication identifiers.</li>
            <li>Workspace and project data you create, upload, or edit in the app.</li>
            <li>Usage data including device/browser info and interactions for analytics and performance.</li>
          </ul>

          <h2>How We Use Information</h2>
          <ul>
            <li>To provide, maintain, and improve the Service and its features.</li>
            <li>To personalize your experience and enable collaboration across projects and teams.</li>
            <li>To communicate updates, security notices, and support-related information.</li>
          </ul>

          <h2>Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with trusted service providers
            (e.g., hosting, analytics, email) strictly to operate the Service, under appropriate agreements
            and security safeguards.
          </p>

          <h2>Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational measures to protect your data.
            No method of transmission or storage is 100% secure, but we continuously improve our safeguards.
          </p>

          <h2>Data Retention and Deletion</h2>
          <p>
            We retain data for as long as needed to provide the Service. You may request deletion of your
            account or certain data, subject to legal or operational requirements.
          </p>

          <h2>Your Choices</h2>
          <ul>
            <li>Access and update your profile information in the app.</li>
            <li>Control notifications and connected integrations in settings.</li>
            <li>Contact us to request data export or deletion.</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            The Service may integrate with third-party tools (e.g., Google Calendar) to enhance your
            workflow. Your use of integrations is subject to the third-party’s terms and privacy policies.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the new policy on this page
            and update the effective date above.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this policy, please contact support through the app or via the
            contact method provided in the footer.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}


