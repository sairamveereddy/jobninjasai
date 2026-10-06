import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, XCircle, DollarSign, Clock, Mail, ArrowLeft, Info, AlertTriangle, CheckCircle
} from 'lucide-react';
import { BRAND } from '../config/branding';
import { Button } from './ui/button';
import { Card } from './ui/card';
// SideMenu and Header removed

const RefundPolicy = () => {
    const navigate = useNavigate();
    const EFFECTIVE_DATE = 'February 24, 2026';

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            {/* Navigation handled by Back button */}

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-2xl mb-4">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Refund Policy</h1>
                    <p className="text-gray-500 text-sm">Effective Date: {EFFECTIVE_DATE}</p>
                    <p className="text-gray-600 mt-2 text-lg">
                        Clear, honest, and straightforward — no surprises.
                    </p>
                </div>

                <div className="space-y-8">

                    {/* Key Summary Cards */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                            <CheckCircle className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                            <p className="font-bold text-blue-800 text-sm">Free Trial</p>
                            <p className="text-blue-700 text-xs mt-1">Try the platform free to evaluate our AI tools before subscribing.</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                            <DollarSign className="w-7 h-7 text-green-600 mx-auto mb-2" />
                            <p className="font-bold text-green-800 text-sm">Monthly Plans</p>
                            <p className="text-green-700 text-xs mt-1">Starting at $15/month. Cancel anytime from your dashboard.</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                            <XCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
                            <p className="font-bold text-red-800 text-sm">No Refunds</p>
                            <p className="text-red-700 text-xs mt-1">All subscription payments are final. No refunds for partial months.</p>
                        </div>
                    </div>

                    {/* Main Policy Card */}
                    <Card className="p-8 border-none shadow-xl bg-[#faf9ff]/80 backdrop-blur-sm">

                        <section className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-gray-800">How Our Pricing Works</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                {BRAND.name} provides AI-powered job search automation through monthly subscription tiers. We offer a free evaluation period to allow users to test our AI tools before committing to a paid plan.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our plans include <strong>Starter ($15/mo)</strong>, <strong>Pro ($59/mo)</strong>, and <strong>Elite ($99/mo)</strong>. Each tier offers different levels of AI Ninja calls and guidance to fit your career goals.
                            </p>
                            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <p className="text-blue-800 text-sm">
                                    <strong>Important:</strong> These are <strong>recurring monthly subscriptions</strong>. You can cancel your subscription at any time through your account dashboard. Upon cancellation, you will retain access until the end of your current billing period.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <XCircle className="w-6 h-6 text-red-500" />
                                <h2 className="text-2xl font-semibold text-gray-800">No Refund Policy</h2>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
                                <p className="text-red-800 font-semibold mb-2">All subscription purchases and renewals are final and non-refundable.</p>
                                <p className="text-red-700 text-sm leading-relaxed">
                                    As we offer a free trial/evaluation period, users have the opportunity to test the platform's value before subscribing. Once a payment is processed, it grants immediate access to premium features and resources, making it non-refundable.
                                </p>
                            </div>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex gap-2">
                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>We do not offer pro-rated refunds for cancelled subscriptions or unused days in a billing cycle.</span>
                                </li>
                                <li className="flex gap-2">
                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>If you forget to cancel before your next billing date, we cannot issue a refund for the ensuing month.</span>
                                </li>
                                <li className="flex gap-2">
                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>We do not offer refunds if you find a job (congratulations 🎉) mid-cycle; you may simply cancel future renewals.</span>
                                </li>
                                <li className="flex gap-2">
                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>Chargeback disputes filed after a valid purchase may result in immediate account termination.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                <h2 className="text-2xl font-semibold text-gray-800">Exceptions</h2>
                            </div>
                            <p className="text-gray-600 mb-3">
                                We may review refund requests on a case-by-case basis <strong>only</strong> in the following situations:
                            </p>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Duplicate charge:</strong> You were charged more than once for the same purchase due to a technical error.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Platform unavailability:</strong> A confirmed platform-wide outage lasting more than 7 consecutive days.</span>
                                </li>
                            </ul>
                            <p className="text-gray-500 text-sm mt-3">
                                Exception requests must be submitted within <strong>48 hours of purchase</strong> to <a href={`mailto:${BRAND.supportEmail}`} className="text-blue-600 underline">{BRAND.supportEmail}</a>.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-gray-800">Need Help?</h2>
                            </div>
                            <p className="text-gray-600 mb-4">
                                If you believe you qualify for an exception or have a billing question, please reach out promptly.
                            </p>
                        </section>
                    </Card>

                    {/* Contact Section */}
                    <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Billing Questions?</h3>
                        <p className="text-gray-600 mb-6">
                            Contact our support team within 48 hours of your purchase for any billing-related concerns.
                        </p>
                        <Button
                            onClick={() => window.location.href = `mailto:${BRAND.supportEmail}`}
                            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Mail className="w-4 h-4 mr-2" /> {BRAND.supportEmail}
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="bg-[#faf9ff] border-t py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">{BRAND.copyright}</p>
                    <div className="flex justify-center gap-6 mt-2 text-sm">
                        <button onClick={() => navigate('/privacy-policy')} className="text-gray-500 hover:underline">Privacy Policy</button>
                        <button onClick={() => navigate('/terms')} className="text-gray-500 hover:underline">Terms & Conditions</button>
                        <button onClick={() => navigate('/refund-policy')} className="text-blue-600 hover:underline">Refund Policy</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RefundPolicy;
