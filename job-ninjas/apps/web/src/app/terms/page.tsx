import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border">
        <div className="mb-8">
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
            &larr; Back to Login
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
            <p>By accessing and using Job Ninjas, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Use of AI Agents</h2>
            <p>Job Ninjas provides AI-powered hiring agents and workflow automation tools. You are responsible for ensuring that your use of these agents complies with all applicable employment laws, anti-discrimination regulations, and hiring practices in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Privacy</h2>
            <p>Your use of Job Ninjas is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding candidate data and your personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. User Responsibilities</h2>
            <p>You agree not to use the platform to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process candidate data without proper consent</li>
              <li>Deploy agents for discriminatory hiring practices</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to bypass any security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p>The platform, including its original content, features, AI models, and functionality, are owned by Job Ninjas and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact & Support</h2>
            <p>If you have any questions, require assistance, or need to report an issue, please contact us directly at <a href="mailto:veereddy@jobninjas.org" className="text-blue-600 hover:underline">veereddy@jobninjas.org</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
