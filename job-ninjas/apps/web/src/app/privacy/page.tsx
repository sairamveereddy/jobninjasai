import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border">
        <div className="mb-8">
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
            &larr; Back to Login
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when using Job Ninjas, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Account information (name, email, company details)</li>
              <li>Workflow configurations and AI agent prompts</li>
              <li>Candidate data processed through our platform</li>
              <li>Usage data and interactions with our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, maintain, and improve our AI hiring platform</li>
              <li>Process and analyze candidate profiles as directed by your workflows</li>
              <li>Communicate with you regarding service updates and support</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Candidate Data Processing</h2>
            <p>As a recruitment automation platform, we process candidate data on your behalf. You remain the data controller, and we act as the data processor. We do not use your candidates' personal data for our own purposes or to train our foundational AI models without explicit consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your data and candidate information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
            <p>We may use third-party service providers (such as OpenAI or Anthropic) to power our AI agents. These providers are bound by strict confidentiality and data protection agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or need help, please contact us at <a href="mailto:veereddy@jobninjas.org" className="text-blue-600 hover:underline">veereddy@jobninjas.org</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
