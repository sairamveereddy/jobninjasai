import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, DollarSign, ShieldAlert, UserX, Gavel, Mail, CheckCircle, XCircle } from 'lucide-react';
import { BRAND } from '../config/branding';
import { Card } from './ui/card';
// import Header from './Header';
// import SideMenu from './SideMenu';

const Section = ({ icon: Icon, title, children, color = 'text-blue-600' }) => (
    <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-6 h-6 ${color}`} />
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
);

const TermsAndConditions = () => {
    const navigate = useNavigate();
    // const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const EFFECTIVE_DATE = 'February 24, 2026';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header and SideMenu provided by standard layout or simple navigation */}

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
                        <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms & Conditions</h1>
                    <p className="text-gray-500 text-sm">Effective Date: {EFFECTIVE_DATE}</p>
                    <p className="text-gray-600 mt-2 text-lg">
                        By using {BRAND.name}, you agree to the following terms. Please read them carefully.
                    </p>
                </div>

                {/* Key Highlights */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-800 text-sm">Free Evaluation</p>
                            <p className="text-green-700 text-sm">Test our AI tools for free before committing to a paid plan.</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3">
                        <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-blue-800 text-sm">Monthly Subscriptions</p>
                            <p className="text-blue-700 text-sm">Plans starting at $15/month. Cancel anytime from your dashboard.</p>
                        </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-3">
                        <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-orange-800 text-sm">No Refunds</p>
                            <p className="text-orange-700 text-sm">All subscription payments are final. No partial refunds upon cancellation.</p>
                        </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-3">
                        <ShieldAlert className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-purple-800 text-sm">No Job Guarantee</p>
                            <p className="text-purple-700 text-sm">We provide tools and services to assist your job search. We do not guarantee employment outcomes.</p>
                        </div>
                    </div>
                </div>

                <Card className="p-8 border-none shadow-xl bg-white/80 backdrop-blur-sm space-y-8">

                    <Section icon={FileText} title="1. Acceptance of Terms">
                        <p>By accessing or using {BRAND.name} ("the Platform"), you agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. If you do not agree, please do not use our services.</p>
                        <p>These Terms apply to all users, including free-tier users and active subscribers.</p>
                    </Section>

                    <Section icon={CheckCircle} title="2. Free Evaluation Period" color="text-green-600">
                        <p>The free evaluation of {BRAND.name} includes:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Access to core AI tools to evaluate their effectiveness.</li>
                            <li>Limited usage quotas for resume scanning and application assistance.</li>
                        </ul>
                        <p>Once evaluation limits are reached, a paid subscription is required to continue using premium features.</p>
                    </Section>

                    <Section icon={DollarSign} title="3. Subscription & Pricing" color="text-blue-600">
                        <p>We offer monthly subscription tiers: <strong>Starter ($15/mo)</strong>, <strong>Pro ($59/mo)</strong>, and <strong>Elite ($99/mo)</strong>. Key terms:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Subscriptions are billed in advance on a recurring monthly basis.</li>
                            <li>You may cancel your subscription at any time through your dashboard. Cancellation will stop future renewals.</li>
                            <li>Pricing is subject to change with notice. Price changes will apply to the next billing cycle.</li>
                            <li>Usage quotas (e.g., AI Ninja calls) are allocated per billing period and do not roll over.</li>
                        </ul>
                    </Section>

                    <Section icon={XCircle} title="4. Refund Policy" color="text-red-500">
                        <p>All subscription payments are <strong>final and non-refundable</strong>. By subscribing:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You acknowledge that you have evaluated the platform's features.</li>
                            <li>You understand that no refunds or pro-rated credits will be issued for partial months or unused features.</li>
                        <li>You agree that no chargebacks will be filed for valid processed subscription fees.</li>
                        </ul>
                        <p>See our full <button onClick={() => { }} className="text-blue-600 underline">Refund Policy</button> for details.</p>
                    </Section>

                    <Section icon={UserX} title="5. Acceptable Use" color="text-orange-600">
                        <p>You agree not to use {BRAND.name} to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Generate false, misleading, or fraudulent job application materials.</li>
                            <li>Violate any applicable laws or third-party terms of service (e.g., job boards).</li>
                            <li>Scrape, copy, or reverse-engineer any part of the platform.</li>
                            <li>Share your account credentials or Pro access with others.</li>
                            <li>Use automated bots or scripts to abuse platform features.</li>
                        </ul>
                        <p>We reserve the right to suspend or terminate accounts that violate these terms without a refund.</p>
                    </Section>

                    <Section icon={ShieldAlert} title="6. No Employment Guarantee" color="text-yellow-600">
                        <p>{BRAND.name} is a job search assistance platform. We provide AI-powered tools, resume tailoring, job matching, and application automation. By using our service, you acknowledge:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We do <strong>not</strong> guarantee job interviews, offers, or employment outcomes.</li>
                            <li>Results vary based on your qualifications, market conditions, and employer decisions beyond our control.</li>
                            <li>AI-generated content (resumes, cover letters) should be reviewed by you before submission.</li>
                            <li>You are responsible for the accuracy of information in your profile and resume.</li>
                        </ul>
                    </Section>

                    <Section icon={Gavel} title="7. Intellectual Property" color="text-gray-600">
                        <p>All platform content, software, AI models, branding, and features are the intellectual property of {BRAND.name}. You retain full ownership of your personal data (resume, profile, application history).</p>
                        <p>By uploading content to our platform, you grant {BRAND.name} a limited, non-exclusive license to process that content to provide services to you.</p>
                    </Section>

                    <Section icon={ShieldAlert} title="8. Limitation of Liability" color="text-red-400">
                        <p>To the maximum extent permitted by law, {BRAND.name} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform, including lost job opportunities or employment decisions made by third parties.</p>
                        <p>Our total liability to you for any claim shall not exceed the amount you paid for the service in the preceding 12 months.</p>
                    </Section>

                    <Section icon={Gavel} title="9. Governing Law" color="text-indigo-600">
                        <p>These Terms are governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved through good-faith negotiation or, if necessary, binding arbitration.</p>
                    </Section>

                    <Section icon={Mail} title="10. Contact Us" color="text-blue-600">
                        <p>For questions about these Terms, contact us:</p>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2">
                            <p><strong>{BRAND.name}</strong></p>
                            <p>Email: <a href={`mailto:${BRAND.supportEmail}`} className="text-blue-600 underline">{BRAND.supportEmail}</a></p>
                            <p>Website: <a href={BRAND.website} className="text-blue-600 underline">{BRAND.website}</a></p>
                        </div>
                    </Section>

                    <p className="text-sm text-gray-400 text-center pt-4 border-t border-gray-100">
                        We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the updated Terms.
                    </p>
                </Card>
            </main>

            <footer className="bg-white border-t py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">{BRAND.copyright}</p>
                    <div className="flex justify-center gap-6 mt-2 text-sm">
                        <button onClick={() => navigate('/privacy-policy')} className="text-gray-500 hover:underline">Privacy Policy</button>
                        <button onClick={() => navigate('/terms')} className="text-blue-600 hover:underline">Terms & Conditions</button>
                        <button onClick={() => navigate('/refund-policy')} className="text-gray-500 hover:underline">Refund Policy</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsAndConditions;
