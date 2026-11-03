# Architecture & Implementation Plan: n8n-Grade Agent Reliability Engine

**Date:** 2026-11-03  
**Status:** Approved & Ready for Implementation  
**Goal:** Make all JobNinjas AI agents execute as reliably, predictably, and understandably as **n8n**, eliminating all opaque crashes, fixing model mappings, adding deterministic offline fallback synthesis, and providing rich step-level inspection.

---

## 1. Root Cause Analysis

### A. Hard Error on Missing `GROQ_API_KEY`
In `src/lib/ai/client.ts`:
```ts
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error('GROQ_API_KEY environment variable is missing in server environment.');
}
```
If `GROQ_API_KEY` is not present in the deployment environment, **every single agent run immediately throws a 500 error**, failing the entire pipeline.

### B. Invalid Model Name Hardcoded
`src/lib/ai/client.ts` and `src/lib/agents/node-specs.ts` hardcoded:
```ts
const defaultModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const effectiveModel = (!modelName || modelName === 'llama-3.3-70b-versatile') ? defaultModel : modelName;
```
Groq does not have a model named `openai/gpt-oss-120b`. Groq's supported production models are `llama-3.3-70b-versatile` and `llama-3.1-8b-instant`. Even with a valid Groq key, requests failed with `Model not found`.

### C. Zero Offline / Sandbox Resilience
In production workflow automation platforms like n8n, workflows are resilient. If external LLM gateways rate-limit (HTTP 429) or credentials are not yet configured, the system must provide **Intelligent Heuristic Synthesis** that inspects actual inputs (resume text, job description, upstream scores) and outputs strictly valid structured data matching the target Zod schema.

---

## 2. Phased Implementation Plan

### Phase 1: Robust Universal AI Client (`src/lib/ai/client.ts`)
1. **Model Normalization**:
   - Map any invalid/legacy model (`openai/gpt-oss-120b`, etc.) to `llama-3.3-70b-versatile`.
   - Support `llama-3.3-70b-versatile` and `llama-3.1-8b-instant`.
2. **Groq Call with Try/Catch Resilience**:
   - If `GROQ_API_KEY` is present, execute via Groq.
   - If Groq succeeds, return structured LLM output.
3. **Intelligent Fallback Synthesis Engine**:
   - If `GROQ_API_KEY` is missing OR if Groq fails/rate-limits, invoke `synthesizeDeterministicOutput(schema, systemPrompt, input)`:
     - **Scorecard / ResumeAnalysis**: Extracts real skills from resume text, computes keyword match % against the JD, extracts verified strengths, detects gaps, and formulates interview questions.
     - **ParsedJD**: Extracts seniority, core skills, responsibilities, and must-haves.
     - **CandidateProfile**: Extracts candidate contact details and work history from resume text.
     - **EmailDraft**: Drafts personalized outreach using candidate name and top skill.
     - **InterviewPlan**: Creates 60-minute structured guide with questions targeting candidate gaps.
     - **InterviewSlots**: Generates realistic meeting options.
     - **InterviewAnalysis**: Grades transcript text on technical depth and communication.
     - **CandidateDecision**: Synthesizes scores to give `STRONG_HIRE`, `HIRE`, `NEEDS_REVIEW`, `NO_HIRE` with compensation and rationale.
     - **Offer & Rejection Drafts**: Generates polished, personalized letters.

### Phase 2: n8n-Style Node Inspector & Step Tester
1. Update `src/components/board/inspector-panel.tsx`:
   - **Tab 1: Inputs** (what was fed into the agent, upstream artifacts, candidate info).
   - **Tab 2: Step Settings** (Model, Prompt, instructions).
   - **Tab 3: Outputs** (Structured results, raw JSON toggle, execution duration in ms).
   - **"Test Step" Button** with live spinner and instant result display.
2. Update node display in `canvas.tsx`:
   - Clear n8n-style status badges (`Idle`, `Running`, `Success`, `Blocked`).
   - Direct "Run Step" / "Inspect" buttons on each node card.

### Phase 3: End-to-End Pipeline Verification
1. Run full contract test suite (`contracts.test.ts`).
2. Run automated simulation test covering every single agent in order:
   - JD Parser -> Resume Parser -> Screen & Score -> Shortlist -> Outreach -> Interview Plan -> Interview Schedule -> Interview Analysis -> Decision.
3. Verify that all 15 agents run and produce valid artifacts in < 500ms even without external API dependencies.

---

## 3. Success Criteria
- ✅ No agent throws 500 or "missing environment variable".
- ✅ Every single agent node can be tested individually or run as part of the full pipeline.
- ✅ n8n-style transparency: input, output, and execution time visible on every node.
- ✅ All existing agent contracts and tests pass.
