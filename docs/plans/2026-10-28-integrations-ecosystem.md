# Integrations Ecosystem Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the JobNinjas `/integrations` hub from static preview cards into a fully functioning integration ecosystem covering Greenhouse, Workday, Gmail, Slack, Google Calendar, GitHub, and Generic Webhooks, connected directly to board agent pipelines.

**Architecture:** A unified provider adapter pattern (`lib/integrations/`) backed by the Prisma `Connector` model, exposing standardized `/api/integrations/[provider]/*` REST endpoints (test, configure, sync, trigger), integrated with dynamic configuration modals on `/integrations` and hooked into board agents (Outreach via Gmail, Schedule via Google Calendar, Screening via GitHub, Alerts via Slack).

**Tech Stack:** Next.js 15 App Router, Prisma ORM, PostgreSQL, TypeScript, Groq LLM, Lucide React, Tailwind CSS.

---

### Task 1: Connector Database Schema & Shared Credentials Manager

**Files:**
- Modify: `job-ninjas/apps/web/prisma/schema.prisma:36-50`
- Create: `job-ninjas/apps/web/src/lib/integrations/connector-service.ts`
- Test: `job-ninjas/apps/web/src/lib/integrations/connector-service.test.ts`

**Step 1: Write the failing test**
Create test checking credential serialization, retrieval, status updates, and organization scoping.
```ts
// connector-service.test.ts
import { describe, it, expect } from 'vitest';
import { getConnectorConfig, setConnectorConfig } from './connector-service';

describe('ConnectorService', () => {
  it('stores and retrieves sanitized integration credentials', async () => {
    await setConnectorConfig('test-org', 'SLACK', { webhookUrl: 'https://hooks.slack.com/services/123' }, 'ACTIVE');
    const config = await getConnectorConfig('test-org', 'SLACK');
    expect(config.status).toBe('ACTIVE');
    expect(config.settings.webhookUrl).toBe('https://hooks.slack.com/services/123');
  });
});
```

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/connector-service.test.ts`
Expected: FAIL ("cannot find module ./connector-service")

**Step 3: Implement minimal code**
Expand `schema.prisma` `Connector` model with `config Json?` and implement `connector-service.ts` with encrypt/decrypt or safe JSON storage for organization-scoped integrations.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/connector-service.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add job-ninjas/apps/web/prisma/schema.prisma job-ninjas/apps/web/src/lib/integrations/
git commit -m "feat(integrations): add ConnectorService data access layer"
```

---

### Task 2: Greenhouse Configuration & Webhook Sync

**Files:**
- Create: `job-ninjas/apps/web/src/components/integrations/greenhouse-config-modal.tsx`
- Create: `job-ninjas/apps/web/src/app/api/integrations/greenhouse/config/route.ts`
- Test: `job-ninjas/apps/web/src/lib/integrations/greenhouse.test.ts`

**Step 1: Write the failing test**
Test testing credentials against Greenhouse Harvest API v3 mock/demo endpoints.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/greenhouse.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Wire existing `/api/integrations/greenhouse/test` and `/candidates` to persist active key in `Connector` model.
- Build `GreenhouseConfigModal` supporting live Harvest Key testing, active job binding, and automated sync intervals.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/greenhouse.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): complete Greenhouse configuration & persistence"
```

---

### Task 3: Workday ATS Adapter (RaaS & Candidate Roster)

**Files:**
- Create: `job-ninjas/apps/web/src/lib/integrations/workday.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/workday/test/route.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/workday/candidates/route.ts`
- Create: `job-ninjas/apps/web/src/components/integrations/workday-config-modal.tsx`
- Test: `job-ninjas/apps/web/src/lib/integrations/workday.test.ts`

**Step 1: Write the failing test**
Verify Workday RaaS / REST credential validation, applicant report parsing, and standard normalization into JobNinjas candidate records.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/workday.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Create Workday API client supporting Tenant, Client ID, Client Secret, RaaS Report URL (with fallback demo generator for sandbox testing).
- Return normalized candidates: `firstName`, `lastName`, `email`, `requisitionId`, `resumeText`.
- Create `WorkdayConfigModal` with field inputs and live status verification.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/workday.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): implement Workday ATS adapter and config modal"
```

---

### Task 4: Gmail Outreach & Communication Adapter

**Files:**
- Create: `job-ninjas/apps/web/src/lib/integrations/gmail.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/gmail/test/route.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/gmail/send/route.ts`
- Create: `job-ninjas/apps/web/src/components/integrations/gmail-config-modal.tsx`
- Modify: `job-ninjas/apps/web/src/components/board/artifact-sheet.tsx`
- Test: `job-ninjas/apps/web/src/lib/integrations/gmail.test.ts`

**Step 1: Write the failing test**
Verify email draft formatting, recipient substitution, and mail dispatch logic.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/gmail.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Build OAuth2 / App Password / SMTP sender handler.
- Expose `/api/integrations/gmail/send` with subject, body, toEmail.
- Hook into `ArtifactSheet` for outreach email and rejection draft so recruiters can click "Send via Gmail" directly after reviewing the AI draft.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/gmail.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): implement Gmail outreach dispatcher and direct action in ArtifactSheet"
```

---

### Task 5: Slack Recruiter Notifications & Human Gate Approvals

**Files:**
- Create: `job-ninjas/apps/web/src/lib/integrations/slack.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/slack/test/route.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/slack/notify/route.ts`
- Create: `job-ninjas/apps/web/src/components/integrations/slack-config-modal.tsx`
- Modify: `job-ninjas/apps/web/src/components/board/canvas.tsx` (auto-branch and gate triggers)
- Test: `job-ninjas/apps/web/src/lib/integrations/slack.test.ts`

**Step 1: Write the failing test**
Verify Slack Block Kit message payload generation for hiring alerts, candidate shortlist notifications, and interview decision approvals.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/slack.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Build Slack Webhook / Bot client with styled Block Kit alerts (Candidate name, Role, Overall score, Next step recommendation).
- Expose `/api/integrations/slack/notify`.
- Wire into pipeline runner: when Decision Agent finishes with "HIRE" or Shortlist needs human gate, emit notification to configured Slack channel.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/slack.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): implement Slack notifications and Block Kit pipeline alerts"
```

---

### Task 6: Google Calendar Real-Time Scheduling Adapter

**Files:**
- Create: `job-ninjas/apps/web/src/lib/integrations/google-calendar.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/gcal/test/route.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/gcal/slots/route.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/gcal/book/route.ts`
- Create: `job-ninjas/apps/web/src/components/integrations/gcal-config-modal.tsx`
- Modify: `job-ninjas/apps/web/src/components/board/artifact-sheet.tsx`
- Test: `job-ninjas/apps/web/src/lib/integrations/google-calendar.test.ts`

**Step 1: Write the failing test**
Test slot availability calculator and Google Calendar event generation with Google Meet link.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/google-calendar.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Connect to Google Calendar Free/Busy API to inspect interviewer schedules.
- Connect `agent-schedule` slots output to Google Calendar so recruiter can click "Book on Google Calendar" directly from `ArtifactSheet`.
- Auto-generate calendar invite containing Google Meet link and interview guide.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/google-calendar.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): add Google Calendar availability engine and booking integration"
```

---

### Task 7: GitHub Candidate Technical Verification

**Files:**
- Create: `job-ninjas/apps/web/src/lib/integrations/github.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/github/verify/route.ts`
- Create: `job-ninjas/apps/web/src/components/integrations/github-config-modal.tsx`
- Modify: `job-ninjas/apps/web/src/lib/agents/implementations/resume-intelligence.ts`
- Test: `job-ninjas/apps/web/src/lib/integrations/github.test.ts`

**Step 1: Write the failing test**
Test candidate GitHub username parsing, repository metadata aggregation, and code activity scoring.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/github.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Query GitHub REST API (or demo sandbox) for repositories, commit stars, primary languages, and recent activity.
- Feed verified GitHub repository signals directly into `agent-resume` (Resume Intelligence) and `agent-screen` to detect authentic code experience vs inflated resume claims.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/github.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): implement GitHub candidate technical verification adapter"
```

---

### Task 8: Inbound & Outbound Generic Webhook Engine

**Files:**
- Create: `job-ninjas/apps/web/src/lib/integrations/webhooks.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/webhooks/incoming/route.ts`
- Create: `job-ninjas/apps/web/src/app/api/integrations/webhooks/outgoing/route.ts`
- Create: `job-ninjas/apps/web/src/components/integrations/webhook-config-modal.tsx`
- Test: `job-ninjas/apps/web/src/lib/integrations/webhooks.test.ts`

**Step 1: Write the failing test**
Verify HMAC signature validation for inbound webhooks and event dispatch formatting for outbound webhooks (Zapier/Make compatible).

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/webhooks.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Inbound endpoint: receives candidate application JSON payloads from external forms or scrapers and creates candidate in current role.
- Outbound dispatcher: broadcasts `candidate.scored`, `candidate.shortlisted`, `interview.completed` to configured subscriber URLs.
- Webhook modal: generates secret tokens, displays endpoint URL, and offers a "Send Test Payload" tester.

**Step 4: Run test to verify it passes**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/webhooks.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git commit -m "feat(integrations): implement generic inbound and outbound webhook engine"
```

---

### Task 9: Dynamic Integrations Hub UI (`/integrations`)

**Files:**
- Modify: `job-ninjas/apps/web/src/app/(dashboard)/integrations/page.tsx`
- Create: `job-ninjas/apps/web/src/components/integrations/integration-card.tsx`
- Create: `job-ninjas/apps/web/src/app/api/integrations/status/route.ts`

**Step 1: Write component & API tests**
Verify live status query returns real `ACTIVE` / `READY` / `CONNECTED` state from database.

**Step 2: Run test to verify it fails**
Run: `cd job-ninjas/apps/web && npx tsx src/lib/integrations/status.test.ts`
Expected: FAIL

**Step 3: Implement minimal code**
- Update `/integrations` page into an interactive dashboard.
- Clicking "Configure" on any card opens its respective modal (Greenhouse, Workday, Gmail, Slack, Google Calendar, GitHub, Generic Webhook).
- Cards display live status badges, last sync timestamp, and toggle switches.
- Light-theme polished design matching Linear-inspired JobNinjas styling.

**Step 4: Verify in browser & build**
Run: `cd job-ninjas/apps/web && npm run build`
Expected: PASS (all routes compile)

**Step 5: Commit**
```bash
git commit -m "feat(ui): connect all 7 integration cards to live configuration modals and real-time status"
```

---

### Task 10: End-to-End Pipeline Integration & Verification

**Files:**
- Modify: `job-ninjas/apps/web/src/components/board/canvas.tsx`
- Modify: `job-ninjas/apps/web/src/components/board/artifact-sheet.tsx`
- Test: `job-ninjas/apps/web/src/lib/agents/contracts.test.ts`

**Step 1: Test edge-to-edge agent contracts**
Ensure integration steps and output dispatchers pass all agent contracts.

**Step 2: Implement bridge**
- Connect `agent-outreach` -> Gmail dispatcher.
- Connect `agent-schedule` -> Google Calendar booking.
- Connect `agent-resume` -> GitHub verification enrichment.
- Connect Human Gates -> Slack alert webhook.

**Step 3: Run comprehensive verification**
Run:
```bash
cd job-ninjas/apps/web
npx tsx src/lib/agents/contracts.test.ts
npm run build
```
Expected: All tests pass and 0 build errors.

**Step 4: Commit and Push**
```bash
git commit -m "feat(integrations): link all ecosystem adapters to board agents and push live"
git push new-origin main
```
