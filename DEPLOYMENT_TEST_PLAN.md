# JobNinjas — Backend Migration Test Plan

This document outlines the smoke tests and end-to-end verification steps required to ensure the native FastAPI orchestration is working correctly and all n8n dependencies are removed.

## 1. Environment Verification
Ensure the following environment variables are set in the production environment:
- `OPENAI_API_KEY`: Used for question generation.
- `VAPI_API_KEY`: For triggering outbound calls.
- `VAPI_ASSISTANT_ID`: The ID of the Vapi assistant to use.
- `VAPI_PHONE_NUMBER_ID`: The ID of the Vapi phone number to use.
- `VAPI_WEBHOOK_SECRET`: For verifying Vapi call reports.
- `DODO_WEBHOOK_SECRET`: For verifying payment webhooks.
- `DODO_API_KEY`: For payment processing (if used in other parts).

## 2. Smoke Tests (Manual/Postman)

### A. Call Initiation
**Endpoint**: `POST /api/ninja/v2/call`
**Payload**: `{"email": "user@example.com"}`
**Verification**:
- [ ] Response is `200 OK` with `success: true`.
- [ ] A record appears in `call_attempts` table in RDS with status `triggered`.
- [ ] Vapi receives the call trigger (check Vapi dashboard).
- [ ] Phone rings (if using a real number).

### B. Vapi Webhook (End-of-Call)
**Endpoint**: `POST /api/vapi/webhook`
**Payload**: (Mock Vapi end-of-call report)
```json
{
  "message": {
    "type": "end-of-call-report",
    "call": {
      "id": "vapi-call-id-123",
      "transcript": "Hello, how are you?",
      "summary": "The candidate spoke about their experience.",
      "analysis": {
        "structuredData": {
          "overall": 85,
          "communication": 90,
          "technical": 80
        }
      },
      "assistantOverrides": {
        "variableValues": {
          "user_id": "1"
        }
      }
    }
  }
}
```
**Verification**:
- [ ] Response is `200 OK`.
- [ ] `call_results` table is updated with transcript and scores.
- [ ] `user_profiles` table reflects incremented streak.

### C. Dodo Payment Webhook
**Endpoint**: `POST /api/dodo/webhook`
**Payload**: (Mock Dodo order.success)
```json
{
  "type": "order.success",
  "data": {
    "customer": { "email": "user@example.com" },
    "product_id": "prod_ninja_monthly",
    "id": "dodo-order-id-456"
  }
}
```
**Verification**:
- [ ] Response is `200 OK`.
- [ ] `ninja_plans` table reflects `plan_tier: monthly` and `status: active`.

### D. Dashboard Data
**Endpoint**: `GET /api/ninja/v2/dashboard?email=user@example.com`
**Verification**:
- [ ] `stats.subscription` contains the correct plan info.
- [ ] `stats.latest_call` shows the most recent result from RDS.

## 3. Automated Verification (Future)
- Implement `pytest` suites for `backend/ninja/*.py` using mocked external APIs.
- Use `playwright` for end-to-end dashboard flow verification.
