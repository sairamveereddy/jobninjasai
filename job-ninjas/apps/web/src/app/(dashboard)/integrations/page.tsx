"use client";

import { useState, useEffect } from 'react';
import { Code, Mail, MessageSquare, Calendar, Briefcase, Webhook, CheckCircle2, RefreshCw } from 'lucide-react';
import { GreenhouseConfigModal } from '@/components/integrations/greenhouse-config-modal';
import { WorkdayConfigModal } from '@/components/integrations/workday-config-modal';
import { GmailConfigModal } from '@/components/integrations/gmail-config-modal';
import { SlackConfigModal } from '@/components/integrations/slack-config-modal';
import { GCalConfigModal } from '@/components/integrations/gcal-config-modal';
import { GitHubConfigModal } from '@/components/integrations/github-config-modal';
import { WebhookConfigModal } from '@/components/integrations/webhook-config-modal';

type ModalType =
  | 'GREENHOUSE'
  | 'WORKDAY'
  | 'GMAIL'
  | 'SLACK'
  | 'GOOGLE_CALENDAR'
  | 'GITHUB'
  | 'GENERIC_WEBHOOK'
  | null;

const INTEGRATION_DEFS = [
  {
    id: 'GREENHOUSE' as const,
    name: 'Greenhouse',
    category: 'ATS Adapter',
    icon: Briefcase,
    color: 'bg-emerald-100 text-emerald-700',
    description: 'Import job openings, candidate pipelines, and resumes via Harvest v3.',
  },
  {
    id: 'WORKDAY' as const,
    name: 'Workday',
    category: 'ATS Adapter',
    icon: Briefcase,
    color: 'bg-blue-100 text-blue-700',
    description: 'Connect enterprise job requisitions and candidate attachments via RaaS.',
  },
  {
    id: 'GMAIL' as const,
    name: 'Gmail',
    category: 'Communication',
    icon: Mail,
    color: 'bg-rose-100 text-rose-700',
    description: 'Direct recruiter outreach and candidate updates via Workspace.',
  },
  {
    id: 'SLACK' as const,
    name: 'Slack',
    category: 'Communication',
    icon: MessageSquare,
    color: 'bg-purple-100 text-purple-700',
    description: 'Real-time Block Kit alerts for candidate scores, shortlists, and approvals.',
  },
  {
    id: 'GOOGLE_CALENDAR' as const,
    name: 'Google Calendar',
    category: 'Scheduling',
    icon: Calendar,
    color: 'bg-amber-100 text-amber-800',
    description: 'Live availability lookup and Google Meet interview video booking.',
  },
  {
    id: 'GITHUB' as const,
    name: 'GitHub',
    category: 'Verification',
    icon: Code,
    color: 'bg-slate-200 text-slate-800',
    description: 'Verify engineering portfolios, open-source repositories, and commit signals.',
  },
  {
    id: 'GENERIC_WEBHOOK' as const,
    name: 'Generic Webhook',
    category: 'Custom',
    icon: Webhook,
    color: 'bg-indigo-100 text-indigo-700',
    description: 'Inbound candidate application ingest & outbound event streaming.',
  },
];

export default function IntegrationsPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [statuses, setStatuses] = useState<Record<string, { status: string; lastSyncAt?: string }>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatuses = () => {
    setIsRefreshing(true);
    fetch('/api/integrations/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.connectors) {
          setStatuses(data.connectors);
        }
      })
      .catch(() => {})
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Integrations</h2>
          <p className="text-sm text-slate-500 mt-1">
            Connect JobNinjas to your ATS, communication, and scheduling ecosystem
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStatuses}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          title="Refresh integration statuses"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Status</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {INTEGRATION_DEFS.map((int) => {
          const live = statuses[int.id];
          const isConnected = live?.status === 'ACTIVE';
          const isReady = live?.status === 'READY' || (!live && (int.id === 'WORKDAY' || int.id === 'GMAIL' || int.id === 'SLACK' || int.id === 'GOOGLE_CALENDAR'));
          const displayStatus = isConnected ? 'Active' : isReady ? 'Ready' : 'Available';

          return (
            <div
              key={int.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col hover:border-indigo-300 hover:shadow-lg transition-all duration-200 shadow-xs"
            >
              <div className={`w-12 h-12 rounded-2xl ${int.color} flex items-center justify-center mb-4 shadow-sm`}>
                <int.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{int.name}</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{int.category}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">{int.description}</p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isConnected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isReady
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isConnected && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  {displayStatus}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal(int.id)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modals for all 7 providers */}
      <GreenhouseConfigModal
        isOpen={activeModal === 'GREENHOUSE'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
      <WorkdayConfigModal
        isOpen={activeModal === 'WORKDAY'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
      <GmailConfigModal
        isOpen={activeModal === 'GMAIL'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
      <SlackConfigModal
        isOpen={activeModal === 'SLACK'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
      <GCalConfigModal
        isOpen={activeModal === 'GOOGLE_CALENDAR'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
      <GitHubConfigModal
        isOpen={activeModal === 'GITHUB'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
      <WebhookConfigModal
        isOpen={activeModal === 'GENERIC_WEBHOOK'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchStatuses}
      />
    </div>
  );
}
